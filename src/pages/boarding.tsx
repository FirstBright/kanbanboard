import { useRouter } from "next/router"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { motion } from "framer-motion"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { SyncLoader } from "react-spinners"

const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
}

const Board = ({ user }: { user: string | null | undefined }) => {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleStep = () => {
        setStep(2)
    }
    const handleLoading = () => {
        setLoading(true)
        setTimeout(() => {
            router.replace("/mykanban")
            toast.success(`Welcome to Board ${user}`)
            setLoading(false)
        }, 5000)
    }
    const goBack = () => {
        setStep(1)
    }
    return (
        <>
            <motion.div
                initial='hidden'
                animate='visible'
                exit='exit'
                variants={variants}
                transition={{ duration: 0.5 }}
                className='flex flex-col h-full items-center justify-center pt-[82px] w[90%] mx-auto max-w-[1450px] text-white'
            >
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className='w-full text-center'
                    >
                        <h1 className='m-10 text-4xl font-bold uppercase'>
                            {user} Let's Give Your Board a Name
                        </h1>
                        <form
                            className='flex flex-col gap-10 items-center'
                            onSubmit={handleStep}
                        >
                            <Input
                                type='text'
                                name='name'
                                placeholder='My Board Name ...'
                                disabled={loading}
                            />
                            <Button text='Continue' type='submit' />
                            {loading ? (
                                <div className='flex gap-3 items-center text-white'>
                                    <SyncLoader color='#fff' />
                                    <span>Getting Your Board Ready</span>
                                </div>
                            ) : null}
                        </form>
                    </motion.div>
                )}
                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className='w-full text-center'
                    >
                        <h1 className='m-10 text-4xl font-bold uppercase'>
                            Now let's add your first task!
                        </h1>
                        <form
                            onSubmit={handleLoading}
                            className='flex flex-col gap-10 items-center'
                        >
                            <Input
                                type='text'
                                name='task'
                                placeholder='My First Task...'
                                disabled={loading}
                            />
                            <div className='flex justify-between w-4/5 m-10'>
                                <Button
                                    text='Go back'
                                    onClick={goBack}
                                    disabled={loading}
                                />
                                <Button
                                    text='Continue'
                                    type='submit'
                                    disabled={loading}
                                />
                            </div>
                        </form>
                    </motion.div>
                )}
            </motion.div>
        </>
    )
}
export default Board
