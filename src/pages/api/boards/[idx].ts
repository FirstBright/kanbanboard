import { verify } from "jsonwebtoken"
import { NextApiRequest, NextApiResponse } from "next"
import { parseCookies } from "nookies"
import { PrismaClient } from "@prisma/client"
import { JwtPayload } from "jsonwebtoken"
import { deletePost } from "@/apis/boards/deleteBoard"

interface IJwtPayload extends JwtPayload {
    idx: number
}

const prisma = new PrismaClient()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { token } = parseCookies({ req })

    if (!token) {
        return res.status(401).json({ status: "fail", message: "Unauthorized" })
    }

    try {
        const payload = verify(token, process.env.JWT_SECRET!) as IJwtPayload

        if (req.method === "DELETE") {
            const boardIdx = parseInt(req.query.idx as string) // Ensure it's parsed as an integer
            if (!boardIdx) {
                return res.status(400).json({ message: "Invalid board ID" })
            }
            const deletedBoard = await deletePost(req, res, boardIdx)
            return res.status(200).json(deletedBoard)
        } else {
            return res.status(405).json({ message: "Method Not Allowed" })
        }
    } catch (error) {
        console.error("Error in /api/boards:", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}
