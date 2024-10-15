import Button from '@/components/ui/Button'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useState, useEffect } from 'react'

export default function Home() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['me'],
        queryFn: async () => await axios.get('/api/me'),
    })

    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        if (!isLoading && !isError && data?.data?.status !== 'fail') {
            setIsAuthenticated(true)
        }
    }, [data, isLoading, isError])
    return (
        <>
            <div className='flex h-full items-center relative justify-center gap-20 w-[90%] mx-auto max-w-[1450px]'>
                <div className='flex items-center gap-6 w-full justify-between flex-col md:flex-row'>
                    <div className='flex flex-col justify-center max-md:items-center space-y-4 max-md:test-center'>
                        <div className='space-y-2'>
                            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl text-white'>
                                하루를 효과적으로 요약해보세요
                            </h2>
                            <p className='max-w-[500px] md:text-xl text-gray-300'>
                                칸반보드를 이용한 Todo List
                            </p>
                        </div>
                        <Link href={isAuthenticated ? '/boardPage' : '/login'}>
                            <Button
                                text={
                                    isAuthenticated ? '보드로 가기' : '시작하기'
                                }
                            />
                        </Link>
                    </div>
                    <img
                        src='/hero-image.png'
                        alt='not yet'
                        className='rounded-xl max-sm:px-5 object-contain w-[300px] lg:w-auto'
                    />
                </div>
            </div>
        </>
    )
}
