import { PrismaClient } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

export async function createBoard(
    req: NextApiRequest,
    res: NextApiResponse,
    userIdx: number
) {
    const { name } = req.body

    const post = await prisma.kanbanBoard.create({
        data: {
            name,
            userIdx,
        },
    })

    res.status(201).json(post)
}
