import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { motion } from "framer-motion"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { SyncLoader } from "react-spinners"
import { verify } from "jsonwebtoken"
import { JwtPayload } from "jsonwebtoken"
import { parseCookies } from "nookies"
import axios from "axios"

interface IJwtPayload extends JwtPayload {
    idx: number
}
const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
}

const Board = ({ user }: { user: string | null | undefined }) => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [boards, setBoards] = useState<any[]>([])
    const [newBoardName, setNewBoardName] = useState("")
    const [newTask, setNewTask] = useState("")

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const response = await axios.get("/api/boards")
                setBoards(response.data.boards)
            } catch (error) {
                console.error("Failed to fetch boards:", error)
            }
        }
        fetchBoards()
    }, [])

    const handleLoading = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            // Create new board and task API call (pseudo-code)
            await axios.post("/api/boards", {
                name: newBoardName,
                task: newTask,
            })
            toast.success(`Board created successfully!`)
            router.replace("/mykanban")
        } catch (error) {
            toast.error("Failed to create board")
        } finally {
            setLoading(false)
        }
    }
    const deleteBoard = async (boardId: number) => {
        if (confirm("Are you sure you want to delete this board?")) {
            try {
                await axios.delete(`/api/boards/${boardId}`)
                setBoards(boards.filter((board) => board.id !== boardId))
                toast.success("Board deleted successfully!")
            } catch (error) {
                toast.error("Failed to delete board")
            }
        }
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
                {boards.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className='w-full text-center'
                    >
                        <h1 className='m-10 text-4xl font-bold uppercase'>
                            Welcome {user}, Here are your Boards
                        </h1>
                        <ul>
                            {boards.map((board) => (
                                <li
                                    key={board.id}
                                    className='flex justify-between'
                                >
                                    <span>{board.name}</span>
                                    <button
                                        className='bg-red-500 text-white p-2 rounded'
                                        onClick={() => deleteBoard(board.id)}
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className='w-full text-center'
                    >
                        <h1 className='m-10 text-4xl font-bold uppercase'>
                            {user}, Let's Give Your Board a Name
                        </h1>
                        <form
                            className='flex flex-col gap-10 items-center'
                            onSubmit={handleLoading}
                        >
                            <Input
                                type='text'
                                name='name'
                                placeholder='My Board Name ...'
                                value={newBoardName}
                                onChange={(e: any) =>
                                    setNewBoardName(e.target.value)
                                }
                                disabled={loading}
                            />
                            <Button text='Continue' type='submit' />
                            {loading && (
                                <div className='flex gap-3 items-center text-white'>
                                    <SyncLoader color='#fff' />
                                    <span>Getting Your Board Ready</span>
                                </div>
                            )}
                        </form>
                    </motion.div>
                )}
            </motion.div>
        </>
    )
}
export default Board
