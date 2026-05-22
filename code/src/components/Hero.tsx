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
    description: string
    language: string
    homepage: string
}

type APIResponse = {
    user: User
    repos: Repo[] | null
}

export default function Hero() {

    const [user, setUser] = useState("")
    const [showResults, setShowResults] = useState(false)
    const [userData, setUserData] = useState<APIResponse | null>(null)

    const handleUserInput = (e: ChangeEvent<HTMLInputElement>) => {
        setUser(e.target.value)
    }

    const fetchUser = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        setShowResults(true)

        try {
            const fetchURL = `/api/users?user=${user}`

            const response = await fetch(fetchURL)

            const data = await response.json()

            setUserData(data)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <section>
            <div className='bg-gray-600 text-gray-200 font-medium flex flex-col items-center space-y-4 py-8'>
                <h2 className='text-4xl font-bold'>
                    Imagine a world of coders
                </h2>

                <p>Discover someone new on GitHub</p>

                <form
                    method="get"
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
                        className="bg-indigo-600 px-4 py-2 rounded-sm cursor-pointer hover:bg-indigo-700 delay-100 duration-400 ease-in-out"
                    >
                        Enviar
                    </button>
                </form>
            </div>

            {showResults && userData && (
                <div className='py-8 bg-green-600 text-white font-medium flex flex-col items-center text-center gap-4'>

                    <h3 className='text-2xl'>Results</h3>

                    {userData.user.avatar && (
                        <img
                            src={userData.user.avatar}
                            width={200}
                            height={300}
                        />
                    )}

                    {userData.user.followers && (
                        <div className='flex gap-2'>
                            <StarIcon />
                            <p>{userData.user.followers}</p>
                        </div>
                    )}

                    {userData.user.personName && (
                        <h4 className={`text-2xl ${userData.user.site && 'text-blue-100'}`}>

                            {userData.user.site ? (
                                <div className='flex gap-2'>

                                    <a href={userData.user.site} target="_blank" rel="noopener noreferrer">
                                        {userData.user.personName}
                                    </a>

                                    {userData.user.hireable && (
                                        <CheckedIcon />
                                    )}

                                </div>
                            ) : (
                                userData.user.personName
                            )}

                        </h4>
                    )}

                    {userData.user.username && (
                        <p>
                            <a href={userData.user.URL} target="_blank" rel="noopener noreferrer">
                                @{userData.user.username}
                            </a>
                        </p>
                    )}

                    {userData.user.bio && (
                        <p className='text-lg'>
                            {userData.user.bio}
                        </p>
                    )}

                    {userData.user.country && (
                        <p>{userData.user.country}</p>
                    )}

                </div>
            )}
            {showResults && userData && userData.repos && (
                <div className='py-8 bg-blue-600 text-white font-medium flex flex-col items-center text-center gap-4'>
                    
                    <h3 className='text-2xl'>Repos</h3>
                    {userData.repos.map((repo) => (
                        <div key={repo.repoName} className='bg-blue-500 p-4 rounded-sm w-1/2'>
                            <h4 className='text-xl font-bold'>{repo.repoName}</h4>
                            <p>{repo.description}</p>
                            <p>Language: {repo.language}</p>
                            <p>Stars: {repo.stars}</p>
                            <p>Watchers: {repo.watchers}</p>
                            <p>License: {repo.licenseName || 'No license'}</p>
                            {repo.homepage && (
                                <a href={repo.homepage} target="_blank" rel="noopener noreferrer">
                                    Visit homepage
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}