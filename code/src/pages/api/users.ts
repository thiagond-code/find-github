export const prerender = false

import type { APIRoute } from "astro"
import Bottleneck from "bottleneck"
import { GITHUB_TOKEN } from "astro:env/server"

const BASE_URL = "https://api.github.com/users"

type GitHubUserData = {
    login: string
    public_repos: number
    location?: string
    avatar_url?: string
    html_url: string
    blog?: string
    name: string
    bio?: string
    company?: string
    email?: string | null
    hireable: boolean
    followers: number
    following: number
}

type GitHubRepo = {
    name: string
    stargazers_count: number
    license?: {
        name: string
    }
    watchers: number
    description?: string
    language: string
    homepage?: string
}

const limiter = new Bottleneck({
    minTime: 1000,
    maxConcurrent: 2
})

const changeURL = (
    user: string,
    type: "user" | "repos"
) => {
    return type === "user"
        ? `${BASE_URL}/${user}`
        : `${BASE_URL}/${user}/repos`
}

const fetchData = async (
    user: string,
    type: "user" | "repos"
) => {
    const url = changeURL(user, type)

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github+json',
            "X-GitHub-Api-Version": "2026-03-10"
        }
    })

    if (!response.ok) {
        throw new Error(
            `GitHub API error (${response.status})`
        )
    }

    return response.json()
}

const throttledFetch = limiter.wrap(fetchData)

export const GET: APIRoute = async ({ url }) => {
    const user = url.searchParams.get("user") ?? ""

    if (!user) {
        return Response.json(
            {
                error: "User query is required"
            },
            {
                status: 400
            }
        )
    }

    let userData: GitHubUserData | null = null
    let repos: object[] = []
    let repoError: string | null = null

    const [userResult, reposResult] =
        await Promise.allSettled([
            throttledFetch(user, "user"),
            throttledFetch(user, "repos")
        ])

    if (userResult.status === "rejected") {
        return Response.json(
            {
                error:
                    userResult.reason instanceof Error
                        ? userResult.reason.message
                        : "Failed to fetch GitHub user"
            },
            {
                status: 500
            }
        )
    }

    userData = userResult.value as GitHubUserData

    // Repositories fetch is optional
    if (reposResult.status === "fulfilled") {
        const reposData =
            reposResult.value as GitHubRepo[]

        repos = reposData.map((repo) => ({
            repoName: repo.name,
            stars: repo.stargazers_count,
            licenseName:
                repo.license?.name ?? null,
            watchers: repo.watchers,
            description: repo.description,
            language: repo.language,
            homepage: repo.homepage
        }))
    } else {
        repoError =
            reposResult.reason instanceof Error
                ? reposResult.reason.message
                : "Failed to fetch repositories"
    }

    const {
        login: username,
        public_repos: numRepos,
        location: country,
        avatar_url: avatar,
        html_url: URL,
        blog: site,
        name: personName,
        bio,
        company,
        email,
        hireable,
        followers,
        following
    } = userData

    return Response.json({
        user: {
            username,
            numRepos,
            country,
            avatar,
            URL,
            site,
            personName,
            bio,
            company,
            email,
            hireable,
            followers,
            following
        },
        repos,
        repoError
    })
}