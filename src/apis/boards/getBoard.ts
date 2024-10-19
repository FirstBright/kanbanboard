import { PrismaClient } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

export async function getAllBoards(
    req: NextApiRequest,
    res: NextApiResponse,
    idx: number
) {
    try {
        const posts = await prisma.kanbanBoard.findMany({
            where: { userIdx: idx },
            orderBy: { createdAt: "desc" },
        })
        res.status(200).json(posts)
    } catch (error) {
        console.error("Error fetching posts:", error)
        res.status(500).json({ message: "Error fetching posts" })
    }
}

export const getBoardByIdx = async (idx: number) => {
    return prisma.kanbanBoard.findUnique({
        where: { idx },
        include: {
            tasks: {
                orderBy: { location: "asc" },
            },
        },
    })
}
