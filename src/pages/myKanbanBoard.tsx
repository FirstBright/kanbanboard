import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"

type TaskStatus = "TODO" | "INPROGRESS" | "PENDING" | "DONE" | "CANCEL"
// Define the Task type
type Task = {
    idx: number
    contents: string
    draggableIdx: string
    status: TaskStatus
    location: number
}
type Board = {
    idx: number
    name: string
}

interface MyKanbanBoardProps {
    boardIdx: number
}
interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-black'
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    className='bg-white rounded-lg p-6 w-96'
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

const MyKanbanBoard: React.FC<MyKanbanBoardProps> = () => {
    const [tasks, setTasks] = useState<Record<TaskStatus, Task[]>>({
        TODO: [],
        INPROGRESS: [],
        PENDING: [],
        DONE: [],
        CANCEL: [],
    })
    const router = useRouter()
    const { boardIdx } = router.query
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [currentTask, setCurrentTask] = useState<Task | null>(null)
    const [editedContents, setEditedContents] = useState("")
    const [board, setBoard] = useState<Board | null>(null)
    useEffect(() => {
        if (boardIdx) {
            fetchTasks(Number(boardIdx))
        }
    }, [boardIdx])

    const openEditModal = (task: Task) => {
        setCurrentTask(task)
        setEditedContents(task.contents)
        setIsEditModalOpen(true)
    }

    const openDeleteModal = (task: Task) => {
        setCurrentTask(task)
        setIsDeleteModalOpen(true)
    }

    const handleEditTask = async () => {
        if (currentTask) {
            await editTask(currentTask.idx, editedContents, currentTask.status)
            setIsEditModalOpen(false)
        }
    }

    const handleDeleteTask = async () => {
        if (currentTask) {
            await deleteTask(currentTask.idx, currentTask.status)
            setIsDeleteModalOpen(false)
        }
    }
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

    const fetchTasks = async (boardIdx: number) => {
        try {
            const response = await axios.get(`/api/boards/${boardIdx}`)
            const fetchedBoard = response.data
            setBoard(fetchedBoard)
            const fetchedTasks = fetchedBoard.tasks

            const tasksByStatus: Record<TaskStatus, Task[]> = {
                TODO: [],
                INPROGRESS: [],
                PENDING: [],
                DONE: [],
                CANCEL: [],
            }

            fetchedTasks.forEach((task: Task) => {
                tasksByStatus[task.status].push(task)
            })

            setTasks(tasksByStatus)
        } catch (error) {
            await logErrorToServer(error, "Error fetching tasks")
        }
    }
    const onDragEnd = async (result: DropResult) => {
        const { destination, source } = result

        if (!destination) return

        const sourceStatus = source.droppableId as TaskStatus
        const destStatus = destination.droppableId as TaskStatus

        const newTasks = { ...tasks }
        const [movedTask] = newTasks[sourceStatus].splice(source.index, 1)
        movedTask.status = destStatus
        newTasks[destStatus].splice(destination.index, 0, movedTask)

        setTasks(newTasks)

        try {
            await axios.put(`/api/tasks/${movedTask.idx}`, {
                status: destStatus,
                location: destination.index,
            })

            // Update locations for all tasks in the destination list
            const updatedDestList = newTasks[destStatus].map((task, index) => ({
                ...task,
                location: index,
            }))

            for (const task of updatedDestList) {
                await axios.put(`/api/tasks/${task.idx}`, {
                    location: task.location,
                })
            }
        } catch (error) {
            await logErrorToServer(error, "Error updating tasks")
            fetchTasks(Number(boardIdx)) // Revert to original state if the API call fails
        }
    }
    const addTask = async () => {
        try {
            const newTask = {
                contents: "New Task",
                status: "TODO" as TaskStatus,
                boardIdx: boardIdx,
            }
            const response = await axios.post(
                `/api/boards/${boardIdx}/tasks`,
                newTask
            )
            const createdTask = response.data

            setTasks((prevTasks) => ({
                ...prevTasks,
                TODO: [...prevTasks.TODO, createdTask],
            }))
        } catch (error) {
            await logErrorToServer(error, "Error adding tasks")
        }
    }

    const deleteTask = async (taskIdx: number, status: TaskStatus) => {
        try {
            await axios.delete(`/api/tasks/${taskIdx}`)

            setTasks((prevTasks) => ({
                ...prevTasks,
                [status]: prevTasks[status].filter(
                    (task) => task.idx !== taskIdx
                ),
            }))
        } catch (error) {
            await logErrorToServer(error, "Error deleting tasks")
        }
    }

    const editTask = async (
        taskIdx: number,
        newContents: string,
        status: TaskStatus
    ) => {
        try {
            const updatedTask = {
                contents: newContents,
                status: status,
            }

            const response = await axios.put(
                `/api/tasks/${taskIdx}`,
                updatedTask
            )
            const updatedTaskData = response.data

            setTasks((prevTasks) => ({
                ...prevTasks,
                [status]: prevTasks[status].map((task) =>
                    task.idx === taskIdx
                        ? { ...task, ...updatedTaskData }
                        : task
                ),
            }))
        } catch (error) {
            await logErrorToServer(error, "Error updating tasks")
        }
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='text-2xl font-bold mb-4'>
                {board ? board.name : "Loading..."}
            </h1>
            <button
                onClick={addTask}
                className='mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            >
                Add Task
            </button>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className='flex space-x-4'>
                    {(Object.keys(tasks) as TaskStatus[]).map((status) => (
                        <Droppable droppableId={status} key={status}>
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className='w-1/5 p-4 bg-gray-100 rounded-lg text-black relative pt-[60px]'
                                >
                                    <h2 className='font-bold text-lg mb-4 absolute top-[16px]'>
                                        {status}
                                    </h2>
                                    {tasks[status].map(
                                        (task: Task, index: number) => (
                                            <Draggable
                                                key={task.idx}
                                                draggableId={task.idx.toString()}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        ref={provided.innerRef}
                                                        className='p-4 mb-3 bg-white rounded-lg shadow-lg'
                                                        onClick={() =>
                                                            openEditModal(task)
                                                        }
                                                    >
                                                        <div className='flex justify-between items-center'>
                                                            <span>
                                                                {task.contents}
                                                            </span>
                                                            <div>
                                                                <button
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation()
                                                                        openDeleteModal(
                                                                            task
                                                                        )
                                                                    }}
                                                                    className='text-red-500 hover:text-red-700'
                                                                >
                                                                    ❌
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        )
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>

            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            >
                <h2 className='text-2xl font-bold mb-4'>Edit Task</h2>
                <input
                    type='text'
                    value={editedContents}
                    onChange={(e) => setEditedContents(e.target.value)}
                    className='w-full p-2 mb-4 border rounded'
                />
                <div className='flex justify-end'>
                    <button
                        onClick={() => setIsEditModalOpen(false)}
                        className='mr-2 px-4 py-2 bg-gray-300 rounded'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleEditTask}
                        className='px-4 py-2 bg-blue-500 text-white rounded'
                    >
                        Save
                    </button>
                </div>
            </Modal>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
            >
                <h2 className='text-2xl font-bold mb-4'>Delete Task</h2>
                <p>Are you sure you want to delete this task?</p>
                <div className='flex justify-end mt-4'>
                    <button
                        onClick={() => setIsDeleteModalOpen(false)}
                        className='mr-2 px-4 py-2 bg-gray-300 rounded'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDeleteTask}
                        className='px-4 py-2 bg-red-500 text-white rounded'
                    >
                        Delete
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default MyKanbanBoard
