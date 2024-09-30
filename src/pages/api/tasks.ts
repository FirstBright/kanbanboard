import { PrismaClient, Task as PrismaTask } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

// Fetch tasks by boardId
export default async function Taskhandler(
    req: NextApiRequest,
    res: NextApiResponse,
    boardIdx: number
) {
    if (req.method === "GET") {
        const tasks = await prisma.task.findMany({
            where: { boardIdx },
        })
        res.status(200).json(tasks)
    } else if (req.method === "PUT") {
        const { taskId, status } = req.body

        const updatedTask = await prisma.task.update({
            where: { idx: parseInt(taskId) },
            data: { status },
        })

        res.status(200).json(updatedTask)
    }
}
