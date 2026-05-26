import type { ChangeEvent, SubmitEvent } from "react"
import { useState } from "react"

import CheckedIcon from "./utils/Checked"
import StarIcon from "./utils/Star"

type User = {
    username: string
    numRepos: number
    country: string
    avatar: string
    URL: string
    site: string
    personName: string
    bio: string
    company: string
    email: string
    hireable: boolean
    followers: number
    following: number
}

type Repo = {
    repoName: string
    stars: number
    licenseName: string | null
    watchers: number
    description: string | null
    language: string | null
    homepage: string | null
}

type APIResponse = {
    user: User
    repos: Repo[] | null
    repoError?: string | null
}

export default function Hero() {
    const [user, setUser] = useState("")
    const [userData, setUserData] =
        useState<APIResponse | null>(null)

    const [loading, setLoading] =
        useState(false)

    const [error, setError] =
        useState<string | null>(null)

    const handleUserInput = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        setUser(e.target.value)
    }

    const fetchUser = async (
        e: SubmitEvent<HTMLFormElement>
    ) => {
        e.preventDefault()

        setLoading(true)
        setError(null)
        setUserData(null)

        try {
            const fetchURL = `/api/users?user=${encodeURIComponent(
                user
            )}`

            const response = await fetch(fetchURL)

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.error || "Request failed"
                )
            }

            setUserData(data)
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unknown error"
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <section>
            {/* HEADER */}
            <div className="bg-gray-600 text-gray-200 font-medium flex flex-col items-center space-y-4 py-8">
                <h2 className="text-4xl font-bold">
                    Imagine a world of coders
                </h2>

                <p>
                    Discover someone new on GitHub
                </p>

                <form
                    method=""
                    className="space-x-4 py-6"
                    onSubmit={fetchUser}
                >
                    <input
                        className="px-2 py-2 bg-gray-200 rounded-sm text-gray-700"
                        type="text"
                        value={user}
                        onChange={handleUserInput}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 px-4 py-2 rounded-sm cursor-pointer hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading
                            ? "Loading..."
                            : "Enviar"}
                    </button>
                </form>
            </div>

            {/* ERROR */}
            {error && (
                <div className="py-6 text-center text-red-600 font-bold">
                    {error}
                </div>
            )}

            {/* USER RESULTS */}
            {userData && (
                <div className="py-8 bg-green-600 text-white font-medium flex flex-col items-center text-center gap-4">
                    <h3 className="text-2xl">
                        Results
                    </h3>

                    {userData.user.avatar && (
                        <img
                            src={userData.user.avatar}
                            width={200}
                            height={200}
                            alt={`${userData.user.username} avatar`}
                            className="rounded-full"
                        />
                    )}

                    <div className="flex gap-2 items-center">
                        <StarIcon />

                        <p>
                            {
                                userData.user
                                    .followers
                            }{" "}
                            followers
                        </p>
                    </div>

                    {userData.user.personName && (
                        <div className="flex gap-2 items-center">
                            <h4 className="text-2xl">
                                {userData.user.site ? (
                                    <a
                                        href={
                                            userData
                                                .user
                                                .site
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline"
                                    >
                                        {
                                            userData
                                                .user
                                                .personName
                                        }
                                    </a>
                                ) : (
                                    userData.user
                                        .personName
                                )}
                            </h4>

                            {userData.user
                                .hireable && (
                                    <CheckedIcon />
                                )}
                        </div>
                    )}

                    <p>
                        <a
                            href={
                                userData.user.URL
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                        >
                            @
                            {
                                userData.user
                                    .username
                            }
                        </a>
                    </p>

                    {userData.user.bio && (
                        <p className="text-lg max-w-2xl">
                            {
                                userData.user
                                    .bio
                            }
                        </p>
                    )}

                    {userData.user.country && (
                        <p>
                            {
                                userData.user
                                    .country
                            }
                        </p>
                    )}
                </div>
            )}

            {/* REPOS */}
            {userData && (
                <div className="py-8 bg-blue-600 text-white font-medium flex flex-col items-center text-center gap-4">
                    <h3 className="text-2xl">
                        Repositories
                    </h3>

                    {userData.repoError ? (
                        <p className="text-xl text-red-200">
                            {
                                userData.repoError
                            }
                        </p>
                    ) : userData.repos &&
                        userData.repos.length >
                        0 ? (
                        <div className="flex flex-col gap-4 w-full items-center">
                            {userData.repos.map(
                                (repo) => (
                                    <div
                                        key={
                                            repo.repoName
                                        }
                                        className="p-4 rounded-sm w-1/2 bg-blue-700"
                                    >
                                        <h4 className="text-xl font-bold">
                                            {
                                                repo.repoName
                                            }
                                        </h4>

                                        <p>
                                            {repo.description ||
                                                "No description"}
                                        </p>

                                        <p>
                                            Language:{" "}
                                            {repo.language ||
                                                "Unknown"}
                                        </p>

                                        <p>
                                            Stars:{" "}
                                            {
                                                repo.stars
                                            }
                                        </p>

                                        <p>
                                            Watchers:{" "}
                                            {
                                                repo.watchers
                                            }
                                        </p>

                                        <p>
                                            License:{" "}
                                            {repo.licenseName ||
                                                "No license"}
                                        </p>

                                        {repo.homepage && (
                                            <a
                                                href={
                                                    repo.homepage
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-200 hover:underline"
                                            >
                                                Visit
                                                homepage
                                            </a>
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <p className="text-xl">
                            No repositories
                            found
                        </p>
                    )}
                </div>
            )}
        </section>
    )
}