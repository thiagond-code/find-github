import { useState } from "react"
import CheckedIcon from "./utils/Checked";
import StarIcon from "./utils/Star";

export default function Hero() {

    const [user, setUser] = useState('')
    const [showResults, setShowResults] = useState(false)
    const [userData, setUserData] = useState(null)

    const handleUserInput = (e) => {
        setUser(e.target.value);
    };

    const fetchUser = async (e) => {
        e.preventDefault()
        
        setShowResults(true)

        const userURL = `https://api.github.com/users/${user}`
        const response = await fetch(userURL)

        const data = await response.json()

        setUserData(data)
    }

    return (
        <section>
            <div className='bg-gray-600 text-gray-200 font-medium flex flex-col items-center space-y-4 py-8'>
                <h2 className='text-4xl font-bold'>Imagine a world of coders</h2>
                <p>Discover someone new on GitHub</p>
                <form method="get" className="space-x-4 py-6" onSubmit={fetchUser}>
                    <input className="px-2 py-2 bg-gray-200 rounded-sm text-gray-700" type="text" value={user} onChange={handleUserInput} required />
                    <button type="submit" className="bg-indigo-600 px-4 py-2 rounded-sm cursor-pointer hover:bg-indigo-700 delay-100 duration-400 ease-in-out">Enviar</button>
                </form>
            </div>
            {showResults && userData && (
                <div className='py-8 bg-green-600 text-white font-medium flex flex-col items-center text-center gap-4'>
                    <h3 className='text-2xl'>Results</h3>
                    {userData.avatar_url && <img src={userData.avatar_url} width={200} height={300} />}
                    {userData.followers && (
                        <div className='flex gap-2'>
                            <StarIcon />
                            <p>{userData.followers}</p>
                        </div>
                    )}
                    
                    {userData.name && (
                        <h4 className={`text-2xl ${userData.blog && 'text-blue-100'}`}>
                            {userData.blog ? (
                                <div className='flex gap-2'>
                                <a href={userData.blog}>
                                    {userData.name}
                                </a>
                                    {userData.hireable && <CheckedIcon />}
                                </div>
                            ) : userData.name}
                        </h4>
                    )}
                    {userData.login && (
                        <p>
                            <a href={`${userData.html_url}`}>@{userData.login}</a>
                        </p>
                    )}
                    {userData.bio && <p className='text-lg'>{userData.bio}</p>}
                    {userData.location && <p>{userData.location}</p>}           
                </div>
            )}
        </section>
    )
}