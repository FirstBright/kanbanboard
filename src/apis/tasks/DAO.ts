import { PrismaClient } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

export async function addTask(
    req: NextApiRequest,
    res: NextApiResponse,
    boardIdx: number
) {
    const { contents, status } = req.body

    if (!contents || typeof contents !== "string") {
        return res.status(400).json({ message: "Invalid or missing contents" })
    }

    if (
        !status ||
        !["TODO", "INPROGRESS", "PENDING", "DONE", "CANCEL"].includes(status)
    ) {
        return res.status(400).json({ message: "Invalid or missing status" })
    }

    try {
        const task = await prisma.task.create({
            data: {
                contents,
                status,
                board: {
                    connect: { idx: boardIdx },
                },
            },
        })
        res.status(201).json(task)
    } catch (error) {
        console.error("Error creating task:", error)
        res.status(500).json({ message: "Error creating task" })
    }
}

export async function updateTask(
    req: NextApiRequest,
    res: NextApiResponse,
    taskIdx: number
) {
    const { contents, status, tag } = req.body

    try {
        const updatedTask = await prisma.task.update({
            where: { idx: taskIdx },
            data: {
                contents,
                status,
                tag,
            },
        })

        res.status(201).json(updatedTask)
    } catch (error) {
        console.error("Error updating task:", error)
        res.status(500).json({ message: "Error updating task" })
    }
}
export async function deleteTask(
    req: NextApiRequest,
    res: NextApiResponse,
    taskIdx: number
) {
    try {
        const deletedTask = await prisma.task.delete({
            where: { idx: taskIdx },
        })

        res.status(201).json(deletedTask)
    } catch (error) {
        console.error("Error deleting task:", error)
        res.status(500).json({ message: "Error deleting task" })
    }
}

export async function getTask(
    req: NextApiRequest,
    res: NextApiResponse,
    taskIdx: number
) {
    try {
        const gotTask = await prisma.task.findUnique({
            where: { idx: taskIdx },
        })

        res.status(201).json(gotTask)
        return gotTask
    } catch (error) {
        console.error("Error getting task:", error)
        res.status(500).json({ message: "Error getting task" })
    }
}

export async function getTasks(
    req: NextApiRequest,
    res: NextApiResponse,
    boardIdx: number
) {
    try {
        const gotTask = await prisma.task.findMany({
            where: { boardIdx: boardIdx },
        })

        res.status(201).json(gotTask)
        return gotTask
    } catch (error) {
        console.error("Error getting task:", error)
        res.status(500).json({ message: "Error getting task" })
    }
}
