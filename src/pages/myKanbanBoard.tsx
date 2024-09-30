import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DropResult, DragDropContext } from "@hello-pangea/dnd"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Task } from "@prisma/client"

const MyKanbanBoard = ({ boardIdx }: { boardIdx: number }) => {
    const [task, setTask] = useState<Task[] | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (board) {
            setTask(board.tasks)
            setLoading(false)
        } else {
            router.push("/boarding")
        }
    }, [board])
}

export default MyKanbanBoard
