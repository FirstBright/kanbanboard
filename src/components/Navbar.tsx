import Link from "next/link"
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useEffect, useState } from "react"

const Navbar = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["me"],
        queryFn: async () => await axios.get("/api/me"),
    })

    const [isSignedIn, setSignIn] = useState(false)

    useEffect(() => {
        if (!isLoading && !isError && data?.data?.status !== "fail") {
            setSignIn(true)
        } else {
            setSignIn(false)
        }
    }, [data, isLoading, isError])

    const logoutMutation = useMutation({
        mutationFn: async () => await axios.post("/api/logout"),
        onSuccess: () => {
            window.location.reload() // Reload the page to reflect the logout
        },
    })

    const handleLogout = () => {
        logoutMutation.mutate()
    }

    return (
        <nav className='py-5 transparent sticky z-10 w-full'>
            <div className='flex justify-between w-[90%] max-w-[1450px] mx-auto text-white'>
                <Link
                    href={"/"}
                    className='flex gap-1 items-center text-2xl font-bold uppercase'
                >
                    <h1>Lila</h1>
                </Link>
                <Link
                    href={"/boardPage"}
                    className='flex gap-1 items-center text-2xl font-bold uppercase'
                >
                    <h1>Board</h1>
                </Link>

                {isSignedIn ? (
                    <div className='flex gap-4 items-center'>
                        <strong>{data?.data?.nickname}</strong>
                        <button
                            onClick={handleLogout}
                            className='tracking-tight hover:underline'
                        >
                            로그아웃
                        </button>
                    </div>
                ) : (
                    <Link
                        href={"/login"}
                        className='tracking-tight hover:underline'
                    >
                        시작하기
                    </Link>
                )}
            </div>
        </nav>
    )
}

export default Navbar
