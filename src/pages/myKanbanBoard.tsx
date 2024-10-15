import React, { useState, useEffect } from "react"
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "react-beautiful-dnd"
import axios from "axios"

// Define the Task type
type Task = {
    idx: number
    contents: string
    draggableIdx: string
    status: "TODO" | "INPROGRESS" | "PENDING" | "DONE" | "CANCEL"
    location: number
}

interface MyKanbanBoardProps {
    boardIdx: number
}
const MyKanbanBoard: React.FC<MyKanbanBoardProps> = ({ boardIdx }) => {
    const [tasks, setTasks] = useState<{ [key: string]: Task[] }>({
        TODO: [],
        INPROGRESS: [],
        PENDING: [],
        DONE: [],
        CANCEL: [],
    })
    useEffect(() => {
        fetchTasks()
    }, [boardIdx])

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`/api/tasks?boardIdx=${boardIdx}`)
            const fetchedTasks = response.data

            const tasksByStatus = {
                TODO: fetchedTasks.filter(
                    (task: Task) => task.status === "TODO"
                ),
                INPROGRESS: fetchedTasks.filter(
                    (task: Task) => task.status === "INPROGRESS"
                ),
                PENDING: fetchedTasks.filter(
                    (task: Task) => task.status === "PENDING"
                ),
                DONE: fetchedTasks.filter(
                    (task: Task) => task.status === "DONE"
                ),
                CANCEL: fetchedTasks.filter(
                    (task: Task) => task.status === "CANCEL"
                ),
            }

            // Sort tasks by location within each status
            Object.keys(tasksByStatus).forEach((status) => {
                tasksByStatus[status].sort((a, b) => a.location - b.location)
            })

            setTasks(tasksByStatus)
        } catch (error) {
            console.error("Error fetching tasks:", error)
        }
    }
    const onDragEnd = async (result: DropResult) => {
        const { destination, source } = result

        if (!destination) return

        const sourceList = tasks[source.droppableId as keyof typeof tasks]
        const destList = tasks[destination.droppableId as keyof typeof tasks]

        if (destination.droppableId === source.droppableId) {
            const [movedTask] = sourceList.splice(source.index, 1)
            sourceList.splice(destination.index, 0, movedTask)

            const updatedList = sourceList.map((task, index) => ({
                ...task,
                location: index,
            }))

            setTasks({
                ...tasks,
                [source.droppableId]: updatedList,
            })

            try {
                // Update all tasks in the same list with new locations
                for (const task of updatedList) {
                    await axios.put(`/api/tasks/${task.idx}`, {
                        location: task.location,
                    })
                }
            } catch (error) {
                console.error("Error updating task locations:", error)
                fetchTasks() // Revert to original state if the API call fails
            }
        } else {
            // Moving between different lists
            const [movedTask] = sourceList.splice(source.index, 1)
            movedTask.status = destination.droppableId as keyof typeof tasks
            destList.splice(destination.index, 0, movedTask)

            const updatedDestList = destList.map((task, index) => ({
                ...task,
                location: index,
            }))

            setTasks({
                ...tasks,
                [source.droppableId]: sourceList,
                [destination.droppableId]: destList,
            })

            try {
                await axios.put(`/api/tasks/${movedTask.idx}`, {
                    status: movedTask.status,
                    location: destination.index,
                })
                for (const task of updatedDestList) {
                    await axios.put(`/api/tasks/${task.idx}`, {
                        location: task.location,
                    })
                }
            } catch (error) {
                console.error("Error updating task status:", error)
                fetchTasks() // Revert state if the API call fails
            }
        }
    }
    const moveTask = async (
        taskIdx: number,
        status: string,
        direction: "up" | "down"
    ) => {
        const statusTasks = tasks[status]
        const taskIndex = statusTasks.findIndex((task) => task.idx === taskIdx)

        if (
            (direction === "up" && taskIndex === 0) ||
            (direction === "down" && taskIndex === statusTasks.length - 1)
        ) {
            return // Task is already at the top/bottom
        }

        const newIndex = direction === "up" ? taskIndex - 1 : taskIndex + 1
        const updatedTasks = [...statusTasks]
        const [movedTask] = updatedTasks.splice(taskIndex, 1)
        updatedTasks.splice(newIndex, 0, movedTask)

        // Update locations
        const updatedTasksWithLocations = updatedTasks.map((task, index) => ({
            ...task,
            location: index,
        }))

        setTasks((prevTasks) => ({
            ...prevTasks,
            [status]: updatedTasksWithLocations,
        }))

        try {
            // Update locations for all tasks in the list
            for (const task of updatedTasksWithLocations) {
                await axios.put(`/api/tasks/${task.idx}`, {
                    location: task.location,
                })
            }
        } catch (error) {
            console.error("Error updating task locations:", error)
            fetchTasks() // Refetch tasks to ensure frontend state matches backend
        }
    }

    const addTask = async () => {
        const numBoardIdx = Number(boardIdx)

        if (isNaN(numBoardIdx)) {
            console.error("Invalid board index:", boardIdx)
            return
        }
        try {
            const newTask = {
                contents: "New Task",
                status: "TODO",
            }
            const response = await axios.post(
                `/api/tasks?boardIdx=${boardIdx}`,
                newTask
            )
            const createdTask = response.data

            setTasks({
                ...tasks,
                TODO: [...tasks.TODO, createdTask],
            })
        } catch (error) {
            console.error("Error adding task:", error)
        }
    }

    const deleteTask = async (
        taskIdx: number,
        status: "TODO" | "INPROGRESS" | "DONE" | "CANCEL" | "PENDING"
    ) => {
        try {
            await axios.delete(`/api/tasks/${taskIdx}`)

            setTasks((prevTasks) => ({
                ...prevTasks,
                [status]: prevTasks[status].filter(
                    (task) => task.idx !== taskIdx
                ),
            }))
        } catch (error) {
            console.error("Error deleting task:", error)
        }
    }

    const editTask = async (
        taskIdx: number,
        newContents: string,
        status: "TODO" | "INPROGRESS" | "DONE" | "CANCEL" | "PENDING"
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
            console.error("Error updating task:", error)
        }
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className='flex space-x-4'>
                {Object.keys(tasks).map((status) => (
                    <Droppable droppableId={status} key={status}>
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className='w-1/3 p-4 bg-gray-100 rounded-lg text-black'
                            >
                                <h2 className='font-bold text-lg mb-4'>
                                    {status}
                                </h2>
                                {tasks[status].map(
                                    (task: Task, index: number) => (
                                        <Draggable
                                            key={task.idx}
                                            draggableId={task.draggableIdx}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <div
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}
                                                    className='p-4 mb-3 bg-white rounded-lg shadow-lg'
                                                >
                                                    <div className='flex justify-between items-center'>
                                                        <span>
                                                            {task.contents}
                                                        </span>
                                                        <div>
                                                            <button
                                                                onClick={() =>
                                                                    moveTask(
                                                                        task.idx,
                                                                        status,
                                                                        "up"
                                                                    )
                                                                }
                                                                className='mr-2 text-gray-500 hover:text-gray-700'
                                                                disabled={
                                                                    index === 0
                                                                }
                                                            >
                                                                ↑
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    moveTask(
                                                                        task.idx,
                                                                        status,
                                                                        "down"
                                                                    )
                                                                }
                                                                className='mr-2 text-gray-500 hover:text-gray-700'
                                                                disabled={
                                                                    index ===
                                                                    tasks[
                                                                        status
                                                                    ].length -
                                                                        1
                                                                }
                                                            >
                                                                ↓
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    editTask(
                                                                        task.idx,
                                                                        prompt(
                                                                            "Edit task:",
                                                                            task.contents
                                                                        ) ||
                                                                            task.contents,
                                                                        status as
                                                                            | "TODO"
                                                                            | "INPROGRESS"
                                                                            | "DONE"
                                                                            | "PENDING"
                                                                            | "CANCEL"
                                                                    )
                                                                }
                                                                className='mr-2 text-blue-500 hover:text-blue-700'
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    deleteTask(
                                                                        task.idx,
                                                                        status as
                                                                            | "TODO"
                                                                            | "INPROGRESS"
                                                                            | "DONE"
                                                                            | "PENDING"
                                                                            | "CANCEL"
                                                                    )
                                                                }
                                                                className='text-red-500 hover:text-red-700'
                                                            >
                                                                Delete
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
    )
}

export default MyKanbanBoard
