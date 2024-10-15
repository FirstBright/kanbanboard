import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

export default function SignUp() {
    const router = useRouter()
    const signUpMutation = useMutation({
        mutationFn: async ({ nickname, email, password }: any) =>
            await axios.post('/api/signUp', {
                nickname,
                email,
                password,
            }),
        onSuccess: () => {
            router.push('/login')
        },
        onError: (error: any) => {
            toast.error(error.response.data.message)
        },
    })

    const signUp = (e: any) => {
        e.preventDefault()
        signUpMutation.mutate({
            nickname: e.currentTarget.nickname.value,
            email: e.currentTarget.email.value,
            password: e.currentTarget.password.value,
        })
    }

    return (
        <div className='flex items-center justify-center min-h-screen '>
            <div className='bg-white p-8 rounded-xl shadow-md max-w-md w-full text-black'>
                <form onSubmit={signUp} className='space-y-4'>
                    <h2 className='text-center text-2xl font-semibold'>
                        Sign Up
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
                        <label htmlFor='email' className='block text-sm'>
                            Email
                        </label>
                        <input
                            type='text'
                            id='email'
                            name='email'
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
                        className='w-full bg-green-500 text-white py-2'
                    >
                        Sign Up
                    </button>
                </form>
                <div className='mt-4 text-center'>
                    <a href='/login' className='text-blue-600'>
                        Already have an account? Log In
                    </a>
                </div>
            </div>
        </div>
    )
}
