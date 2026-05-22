export const prerender = false

import type { APIRoute } from "astro"

const BASE_URL = 'https://api.github.com/users'

type GitHubUserData = {
    login: string,
    public_repos: number,
    location?: string,
    avatar_url?: string,
    html_url: string,
    blog?: string,
    name: string,
    bio?: string,
    company?: string,
    email?: string | null,
    hireable: boolean,
    followers: number,
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

const changeURL = (user: string, type: "user" | "repos") => {
    if (type === "user") {
        return `${BASE_URL}/${user}`
    }

    return `${BASE_URL}/${user}/repos`
}

export const GET: APIRoute = async ({ url }) => {

    const user = url.searchParams.get('user') ?? ''

    if (user === '') {
        return Response.json(
            {
                error: 'User query is required',
            },
            {
                status: 400
            }
        )
    }

    const userURL = changeURL(user, 'user')

    let userData: GitHubUserData

    try {
        const userResponse = await fetch(userURL)

        if (!userResponse.ok) {
            return Response.json(
                {
                    error: "Couldn't find GitHub user"
                },
                {
                    status: userResponse.status
                }
            )
        }

        userData = await userResponse.json()
    } catch (error) {
        return Response.json(
            {
                error: 'Failed to fetch GitHub user data'
            },
            {
                status: 500
            }
        )
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

    let repos = null

    let repoError: string | null = null

    const reposURL = changeURL(user, "repos")

    try {
        const reposResponse = await fetch(reposURL)

        if (reposResponse.ok) {
            const reposData: GitHubRepo[] = await reposResponse.json()

            repos = reposData.map((repo: GitHubRepo) => ({
                repoName: repo.name,
                stars: repo.stargazers_count,
                licenseName: repo.license?.name ?? null,
                watchers: repo.watchers,
                description: repo.description,
                language: repo.language,
                homepage: repo.homepage,
            }))
        }
    } catch (error) {
        console.warn(error)
        repoError = error instanceof Error ? error.message : 'Failed to fetch repositories'
    }

    return Response.json(
        {
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
        },
    )
}