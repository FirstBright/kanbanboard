"use client"

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
    id: string
    contents: string
    status: "TODO" | "INPROGRESS" | "PENDING" | "DONE" | "CANCEL"
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
    const [isValidBoardIdx, setIsValidBoardIdx] = useState(true)

    useEffect(() => {
        if (isNaN(boardIdx)) {
            console.error("Invalid board index:", boardIdx)
            setIsValidBoardIdx(false)
            return
        }
        setIsValidBoardIdx(true)

        const fetchTasks = async () => {
            try {
                const response = await axios.get(
                    `/api/tasks?boardIdx=${boardIdx}`
                )
                const fetchedTasks = response.data

                const tasksByStatus = {
                    TODO: fetchedTasks.filter(
                        (task: Task) => task.status === "TODO"
                    ),
                    INPROGRESS: fetchedTasks.filter(
                        (task: Task) => task.status === "INPROGRESS"
                    ),
                    DONE: fetchedTasks.filter(
                        (task: Task) => task.status === "DONE"
                    ),
                    CANCEL: fetchedTasks.filter(
                        (task: Task) => task.status === "CANCEL"
                    ),
                    PENDING: fetchedTasks.filter(
                        (task: Task) => task.status === "PENDING"
                    ),
                }
                setTasks(tasksByStatus)
            } catch (error) {
                console.error("Error fetching tasks:", error)
            }
        }

        fetchTasks()
    }, [boardIdx])
    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result

        if (!destination) return

        const sourceList = tasks[source.droppableId as keyof typeof tasks]
        const destList = tasks[destination.droppableId as keyof typeof tasks]

        const [movedTask] = sourceList.splice(source.index, 1)
        movedTask.status = destination.droppableId as
            | "TODO"
            | "INPROGRESS"
            | "DONE"
            | "PENDING"
            | "CANCEL"
        destList.splice(destination.index, 0, movedTask)

        setTasks({
            ...tasks,
            [source.droppableId]: sourceList,
            [destination.droppableId]: destList,
        })
        try {
            await axios.put(`/api/tasks/${movedTask.id}`, {
                status: movedTask.status,
                contents: movedTask.contents,
            })
        } catch (error) {
            console.error("Error updating task status:", error)
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
        taskId: string,
        status: "TODO" | "INPROGRESS" | "DONE" | "CANCEL" | "PENDING"
    ) => {
        try {
            await axios.delete(`/api/tasks/${taskId}`)

            setTasks({
                ...tasks,
                [status]: tasks[status].filter((task) => task.id !== taskId),
            })
        } catch (error) {
            console.error("Error deleting task:", error)
        }
    }

    const editTask = async (
        taskId: string,
        newContents: string,
        status: "TODO" | "INPROGRESS" | "DONE" | "CANCEL" | "PENDING"
    ) => {
        try {
            const updatedTask = {
                contents: newContents,
                status: status,
            }

            await axios.put(`/api/tasks/${taskId}`, updatedTask)

            setTasks({
                ...tasks,
                [status]: tasks[status].map((task) =>
                    task.id === taskId
                        ? { ...task, contents: newContents }
                        : task
                ),
            })
        } catch (error) {
            console.error("Error updating task:", error)
        }
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='text-2xl font-bold mb-4'>My Kanban Board</h1>
            <button
                onClick={addTask}
                className='mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            >
                Add Task
            </button>
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
                                                key={task.id}
                                                draggableId={task.id}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        ref={provided.innerRef}
                                                        className='p-4 mb-3 bg-white rounded-lg shadow-lg'
                                                        style={{
                                                            padding: "16px",
                                                            margin: "8px 0",
                                                            background: "#fff",
                                                            border: "1px solid #ddd",
                                                            borderRadius: "4px",
                                                            color: "black",
                                                            ...provided
                                                                .draggableProps
                                                                .style,
                                                        }}
                                                    >
                                                        <div className='flex justify-between items-center'>
                                                            <span>
                                                                {task.contents}
                                                            </span>
                                                            <div>
                                                                <button
                                                                    onClick={() =>
                                                                        editTask(
                                                                            task.id,
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
                                                                            task.id,
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
        </div>
    )
}

export default MyKanbanBoard
