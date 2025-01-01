import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { SyncLoader } from "react-spinners"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import "react-toastify/dist/ReactToastify.css"

interface Board {
    idx: number
    name: string
}

const BoardPage = () => {
    const [loading, setLoading] = useState(false)
    const [boardName, setBoardName] = useState("")
    const [boardList, setBoardList] = useState<Board[]>([])
    const [creatingBoard, setCreatingBoard] = useState(false)
    const router = useRouter()

    const {
        data: userData,
        isLoading: userLoading,
        isError: userError,
    } = useQuery({
        queryKey: ["me"],
        queryFn: async () => await axios.get("/api/me"),
    })
    const {
        data: boardsData,
        isLoading: boardsLoading,
        isError: boardsError,
    } = useQuery({
        queryKey: ["boards"],
        queryFn: async () => await axios.get("/api/boards"),
        enabled: !!userData, // Only fetch boards if user data is available
    })
    useEffect(() => {
        if (boardsData) {
            setBoardList(boardsData.data.boards)
        }
    }, [boardsData])

    useEffect(() => {
        if (userError || boardsError) {
            router.push("/login")
        }
    }, [userError, boardsError, router])

    const logErrorToServer = async (error: unknown, context: string) => {
        try {
            await axios.post("/api/logs", {
                message: error instanceof Error ? error.message : String(error),
                context,
                stack: error instanceof Error ? error.stack : null,
            })
        } catch (logError) {
            await axios.post("/api/logs", {
                message:
                    logError instanceof Error
                        ? logError.message
                        : String(logError),
                context: "Logging Error",
                stack: logError instanceof Error ? logError.stack : null,
            })
        }
    }

    const handleCreateBoard = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await axios.post("/api/boards", {
                name: boardName,
                userIdx: userData?.data?.idx,
            })

            toast.success(`Board "${boardName}" created!`)
            const newBoard = response.data
            setBoardList([...boardList, response.data])
            router.push(`/myKanbanBoard?boardIdx=${newBoard.idx}`)
        } catch (error) {
            await logErrorToServer(error, "Error creating board")
            toast.error("Error creating board")
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
            await logErrorToServer(error, "Error deleting board")
            toast.error("Error deleting board")
        } finally {
            setLoading(false)
        }
    }

    const handleCreateNewBoard = () => {
        setCreatingBoard(true) // Simulate that we are in board creation mode
        setBoardName("") // Reset the board name input
    }

    if (userLoading || boardsLoading) {
        return <div className='flex h-full items-center justify-center w[90%] mx-auto max-w-[1450px] text-white'>Loading...</div>
    }
    return (
        <motion.div
            initial='hidden'
            animate='visible'
            exit='exit'
            className='flex flex-col h-full items-center justify-center w[90%] mx-auto max-w-[1450px] text-white'
        >
            {creatingBoard || boardList.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='w-full text-center'
                >
                    <h1 className='m-10 text-4xl font-bold uppercase'>
                        Let&apos;s Give Your Board a Name
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
                                className='bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex justify-between items-center cursor-pointer'
                                onClick={() => {
                                    router.push({
                                        pathname: `/myKanbanBoard`,
                                        query: { boardIdx: board.idx },
                                    })
                                }}
                            >
                                <span>{board.name}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteBoard(board.idx)
                                    }}
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

export default BoardPage
