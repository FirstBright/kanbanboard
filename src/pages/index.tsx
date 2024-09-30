import Button from "@/components/ui/Button"
import Link from "next/link"

export default function Home() {
    return (
        <>
            <div className='flex h-full items-center relative justify-center pt-[82px] gap-20 w-[90%] mx-auto max-w-[1450px]'>
                <div className='grid items-center gap-6 md:grid-cols-2'>
                    <img
                        src='/hero-image.png'
                        alt='not yet'
                        className='mx-auto rounded-xl order-last md:min-w-[800px] min-w-[500px] md:h-[500px] max-sm:px-5'
                    />
                    <div className='flex flex-col justify-center max-md:items-center space-y-4 max-md:test-center'>
                        <div className='space-y-2'>
                            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl text-white'>
                                하루를 효과적으로 요약해보세요
                            </h2>
                            <p className='max-w-[500px] md:text-xl text-gray-300'>
                                칸반보드를 이용한 Todo List
                            </p>
                        </div>
                        <Link href={"/login"}>
                            <Button text='시작하기'></Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
