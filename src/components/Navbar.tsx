import Link from "next/link"
import { useState } from "react"

const Navbar = () => {
    const [isSignedIn, setSignIn] = useState(false)
    return (
        <div className='py-5 transparent relative z-10 w-full'>
            <div className='flex justify-between w-[90%] max-w-[1450px] mx-auto text-white'>
                <Link
                    href={"/"}
                    className='flex gap-1 items-center text-2xl font-bold uppercase'
                >
                    <h1>Lila</h1>
                </Link>

                {!isSignedIn && (
                    <Link
                        href={"/login"}
                        className='tracking-tight hover:underline'
                    >
                        시작하기
                    </Link>
                )}
            </div>
        </div>
    )
}

export default Navbar
