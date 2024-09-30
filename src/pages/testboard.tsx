import React, { useState, useEffect } from "react"
import {
    DragDropContext,
    Droppable,
    Draggable,
    DraggableProvided,
} from "react-beautiful-dnd"
import { motion, MotionProps } from "framer-motion"

// Define the Task type
type Task = {
    id: string
    contents: string
    status: "TODO" | "INPROGRESS" | "DONE"
}

// Dummy data
const initialTasks: Task[] = [
    { id: "1", contents: "Task 1", status: "TODO" },
    { id: "2", contents: "Task 2", status: "TODO" },
    { id: "3", contents: "Task 3", status: "INPROGRESS" },
    { id: "4", contents: "Task 4", status: "DONE" },
]

// Custom component to combine Draggable and motion.div
const DraggableMotionDiv: React.FC<{
    provided: DraggableProvided
    motionProps: MotionProps
    children: React.ReactNode
}> = ({ provided, motionProps, children }) => {
    return (
        <motion.div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            {...motionProps}
        >
            {children}
        </motion.div>
    )
}

const testboard: React.FC = () => {
    const [tasks, setTasks] = useState<{ [key: string]: Task[] }>({
        TODO: [],
        INPROGRESS: [],
        DONE: [],
    })

    useEffect(() => {
        // Initialize with dummy data
        const tasksByStatus = {
            TODO: initialTasks.filter((task) => task.status === "TODO"),
            INPROGRESS: initialTasks.filter(
                (task) => task.status === "INPROGRESS"
            ),
            DONE: initialTasks.filter((task) => task.status === "DONE"),
        }
        setTasks(tasksByStatus)
    }, [])

    const onDragEnd = (result: any) => {
        const { destination, source, draggableId } = result

        if (!destination) return

        const sourceList = tasks[source.droppableId as keyof typeof tasks]
        const destList = tasks[destination.droppableId as keyof typeof tasks]

        const [movedTask] = sourceList.splice(source.index, 1)
        movedTask.status = destination.droppableId as
            | "TODO"
            | "INPROGRESS"
            | "DONE"
        destList.splice(destination.index, 0, movedTask)

        setTasks({
            ...tasks,
            [source.droppableId]: sourceList,
            [destination.droppableId]: destList,
        })
    }

    const addTask = () => {
        const newTask: Task = {
            id: Date.now().toString(),
            contents: "New Task",
            status: "TODO",
        }
        setTasks({
            ...tasks,
            TODO: [...tasks.TODO, newTask],
        })
    }

    const deleteTask = (
        taskId: string,
        status: "TODO" | "INPROGRESS" | "DONE"
    ) => {
        setTasks({
            ...tasks,
            [status]: tasks[status].filter((task) => task.id !== taskId),
        })
    }

    const editTask = (
        taskId: string,
        newContents: string,
        status: "TODO" | "INPROGRESS" | "DONE"
    ) => {
        setTasks({
            ...tasks,
            [status]: tasks[status].map((task) =>
                task.id === taskId ? { ...task, contents: newContents } : task
            ),
        })
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
                                    className='w-1/3 p-4 bg-gray-100 rounded-lg'
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
                                                    <DraggableMotionDiv
                                                        provided={provided}
                                                        motionProps={{
                                                            className:
                                                                "p-4 mb-3 bg-white rounded-lg shadow-lg",
                                                            initial: {
                                                                opacity: 0,
                                                            },
                                                            animate: {
                                                                opacity: 1,
                                                            },
                                                            exit: {
                                                                opacity: 0,
                                                            },
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
                                                                        )
                                                                    }
                                                                    className='text-red-500 hover:text-red-700'
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </DraggableMotionDiv>
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

export default testboard
