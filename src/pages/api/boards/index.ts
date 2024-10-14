import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"
import { parseCookies } from "nookies"
import { verify } from "jsonwebtoken"

const prisma = new PrismaClient()

interface IJwtPayload {
    idx: number
}

// Fetch all boards for a specific user
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { token } = parseCookies({ req })

    // Check if the token is available
    if (!token) {
        return res.status(401).json({ status: "fail", message: "Unauthorized" })
    }

    try {
        // Verify the JWT token and extract the payload (user idx)
        const payload = verify(token, process.env.JWT_SECRET!) as IJwtPayload

        if (req.method === "GET") {
            // Fetch the boards for the user
            const boards = await prisma.kanbanBoard.findMany({
                where: { userIdx: payload.idx },
                orderBy: { createdAt: "desc" },
            })

            return res.status(200).json({ boards })
        } else if (req.method === "POST") {
            const { name } = req.body

            // Create a new board for the user
            const newBoard = await prisma.kanbanBoard.create({
                data: {
                    name,
                    userIdx: payload.idx,
                },
            })

            return res.status(201).json(newBoard)
        } else {
            return res.status(405).json({ message: "Method Not Allowed" })
        }
    } catch (error) {
        console.error("Error handling request:", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}
