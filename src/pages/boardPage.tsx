import { useRouter } from "next/router"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { motion } from "framer-motion"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { SyncLoader } from "react-spinners"
import { parseCookies } from "nookies"
import axios from "axios"
import { verify } from "jsonwebtoken"
import Link from "next/link"

interface Board {
    idx: number
    name: string
}

interface IJwtPayload {
    idx: number
}

const BoardPage = ({
    boards,
    userIdx,
}: {
    boards: Board[]
    userIdx: number
}) => {
    const [loading, setLoading] = useState(false)
    const [boardName, setBoardName] = useState("")
    const [boardList, setBoardList] = useState<Board[]>(boards)
    const [creatingBoard, setCreatingBoard] = useState(false)
    const router = useRouter()

    const handleCreateBoard = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await axios.post("/api/boards", {
                name: boardName,
                userIdx,
            })

            toast.success(`Board "${boardName}" created!`)
            const newBoard = response.data
            setBoardList([...boardList, response.data])
            router.push(`/myKanbanBoard?boardIdx=${newBoard.idx}`)
        } catch (error) {
            toast.error("Error creating board")
            console.error("Error creating board:", error)
        } finally {
            setLoading(false)
        }
    }
    const handleDeleteBoard = async (boardIdx: number) => {
        setLoading(true)
        try {
            await axios.delete(`/api/boards/${boardIdx}`)
            const updatedBoardList = boardList.filter(
                (board) => board.idx !== boardIdx
            )
            setBoardList(updatedBoardList)

            toast.success("Board deleted successfully!")

            // Check if the updated list is empty, and set creatingBoard to true if so
            if (updatedBoardList.length === 0) {
                setCreatingBoard(true)
            }
        } catch (error) {
            toast.error("Error deleting board")
            console.error("Error deleting board:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateNewBoard = () => {
        setCreatingBoard(true) // Simulate that we are in board creation mode
        setBoardName("") // Reset the board name input
    }

    return (
        <motion.div
            initial='hidden'
            animate='visible'
            exit='exit'
            className='flex flex-col h-full items-center justify-center pt-[82px] w[90%] mx-auto max-w-[1450px] text-white'
        >
            {creatingBoard || boards.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='w-full text-center'
                >
                    <h1 className='m-10 text-4xl font-bold uppercase'>
                        Let's Give Your Board a Name
                    </h1>
                    <form
                        className='flex flex-col gap-10 items-center'
                        onSubmit={handleCreateBoard}
                    >
                        <Input
                            type='text'
                            name='name'
                            placeholder='My Board Name ...'
                            value={boardName}
                            onChange={(e) => setBoardName(e.target.value)}
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
            ) : (
                <div className='w-full'>
                    <h1 className='text-4xl font-bold mb-8'>Your Boards</h1>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {boardList.map((board) => (
                            <div
                                key={board.idx}
                                className='bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex justify-between items-center'
                            >
                                <Link
                                    href={`/myKanbanBoard?boardIdx=${board.idx}`}
                                >
                                    {board.name}
                                </Link>

                                <button
                                    onClick={() => handleDeleteBoard(board.idx)}
                                    className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300'
                                    disabled={loading}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className='flex flex-col gap-10 mt-40 items-center'>
                        <Button
                            text='Create New Board'
                            onClick={handleCreateNewBoard}
                        />
                    </div>
                </div>
            )}
        </motion.div>
    )
}

// Fetch boards from the API in getServerSideProps
export const getServerSideProps = async (context: any) => {
    const cookies = parseCookies(context)
    const token = cookies.token

    if (!token) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        }
    }

    try {
        const decoded = verify(token, process.env.JWT_SECRET!) as IJwtPayload

        // Fetch boards from the API
        const response = await axios.get(`http://localhost:3000/api/boards`, {
            headers: { Cookie: `token=${token}` },
        })

        return {
            props: {
                boards: response.data.boards,
                userIdx: decoded.idx,
            },
        }
    } catch (error) {
        console.error("Error fetching boards:", error)
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        }
    }
}

export default BoardPage
