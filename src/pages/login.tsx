import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useRouter } from "next/router"
import Link from "next/link"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface FormData {
    nickname: string
    password: string
}

export default function Login() {
    const router = useRouter()
    const loginMutation = useMutation({
        mutationFn: async ({ nickname, password }: FormData) =>
            await axios.post("/api/login", {
                nickname,
                password,
            }),
        onSuccess: () => {
            toast.success("Logged in!")
            router.push("/boardPage")
        },
    })

    const login = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        loginMutation.mutate({
            nickname: e.currentTarget.nickname.value,
            password: e.currentTarget.password.value,
        })
    }

    return (
        <div className='flex items-center justify-center min-h-screen '>
            <div className='bg-white p-8 rounded-xl shadow-md max-w-md w-full text-black'>
                <form onSubmit={login} className='space-y-4'>
                    <h2 className='text-center text-2xl font-semibold '>
                        Log In
                    </h2>
                    <div>
                        <label htmlFor='nickname' className='block text-sm'>
                            Nickname
                        </label>
                        <input
                            type='text'
                            id='nickname'
                            name='nickname'
                            className='mt-1 block w-full'
                        />
                    </div>
                    <div>
                        <label htmlFor='password' className='block text-sm'>
                            Password
                        </label>
                        <input
                            type='password'
                            id='password'
                            name='password'
                            className='mt-1 block w-full'
                        />
                    </div>
                    <button
                        type='submit'
                        className='w-full bg-indigo-600 text-white py-2'
                    >
                        Log In
                    </button>
                </form>
                <div className='mt-4 text-center'>
                    <a href='/forgotPassword' className='text-red-600'>
                        Forgot Password?
                    </a>
                </div>
                <div className='mt-4 text-center'>
                    <Link href='/signUp' className='text-blue-600'>
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    )
}
