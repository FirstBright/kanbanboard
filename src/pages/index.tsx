import Head from "next/head"
import Button from "@/components/ui/Button"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useState, useEffect } from "react"
import Image from "next/image"

export default function Home() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["me"],
        queryFn: async () => await axios.get("/api/me"),
    })

    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        if (!isLoading && !isError && data?.data?.status !== "fail") {
            setIsAuthenticated(true)
        }
    }, [data, isLoading, isError])
    return (
        <>
            <Head>
                <title>LILA</title>
                <meta
                    name='description'
                    content='Kanban board to summarize your day'
                />
            </Head>
            <div className='flex h-full items-center relative justify-center gap-20 w-[90%] mx-auto max-w-[1450px] pt-20 md:pt-0'>
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
                        <Link href={isAuthenticated ? "/boardPage" : "/login"}>
                            <Button
                                text={
                                    isAuthenticated ? "보드로 가기" : "시작하기"
                                }
                            />
                        </Link>
                    </div>
                    <Image
                        src='/hero-image.png'
                        alt='not yet'
                        className='rounded-xl max-sm:px-5 object-contain lg:w-auto'
                        width={500}
                        height={300}
                    />
                </div>
            </div>
        </>
    )
}
