import React, { useState } from "react"
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "react-beautiful-dnd"

// Define the types for tasks
interface Task {
    id: string
    content: string
}

interface TaskState {
    todo: Task[]
    inProgress: Task[]
    done: Task[]
}

// Initial task data with explicit types
const initialTasks: TaskState = {
    todo: [
        { id: "1", content: "할 일 1" },
        { id: "2", content: "할 일 2" },
    ],
    inProgress: [{ id: "3", content: "진행 중 1" }],
    done: [{ id: "4", content: "완료된 일 1" }],
}

const App: React.FC = () => {
    const [tasks, setTasks] = useState<TaskState>(initialTasks)

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result

        // If dropped outside any droppable or no destination
        if (!destination) return

        // If dropped in the same place, no change
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return
        }

        // Move the task within the same list or to another list
        const startList = tasks[source.droppableId as keyof TaskState]
        const endList = tasks[destination.droppableId as keyof TaskState]

        // If moving within the same list
        if (source.droppableId === destination.droppableId) {
            const newList = Array.from(startList)
            const [movedTask] = newList.splice(source.index, 1)
            newList.splice(destination.index, 0, movedTask)

            setTasks((prevTasks) => ({
                ...prevTasks,
                [source.droppableId]: newList,
            }))
        } else {
            // Moving between lists
            const startListCopy = Array.from(startList)
            const endListCopy = Array.from(endList)
            const [movedTask] = startListCopy.splice(source.index, 1)

            endListCopy.splice(destination.index, 0, movedTask)

            setTasks((prevTasks) => ({
                ...prevTasks,
                [source.droppableId]: startListCopy,
                [destination.droppableId]: endListCopy,
            }))
        }
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                {Object.keys(tasks).map((listId) => (
                    <Droppable key={listId} droppableId={listId}>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                style={{
                                    width: "300px",
                                    margin: "8px",
                                    background: "#f0f0f0",
                                    padding: "8px",
                                }}
                            >
                                <h3>{listId}</h3>
                                {tasks[listId as keyof TaskState].map(
                                    (task, index) => (
                                        <Draggable
                                            key={task.id}
                                            draggableId={task.id}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{
                                                        padding: "16px",
                                                        margin: "8px 0",
                                                        background: "#fff",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "4px",
                                                        ...provided
                                                            .draggableProps
                                                            .style,
                                                    }}
                                                >
                                                    {task.content}
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

export default App
