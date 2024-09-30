import { PrismaClient } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

export async function deletePost(
    req: NextApiRequest,
    res: NextApiResponse,
    idx: number
) {
    await prisma.kanbanBoard.delete({
        where: { idx },
    })

    res.status(200).json({ message: "KanbanBoard deleted successfully" })
}
