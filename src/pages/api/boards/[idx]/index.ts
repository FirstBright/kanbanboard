import { NextApiRequest, NextApiResponse } from "next"
import { parseCookies } from "nookies"
import { deletePost } from "@/apis/boards/deleteBoard"
import { getBoardByIdx } from "@/apis/boards/getBoard"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { token } = parseCookies({ req })

    if (!token) {
        return res.status(401).json({ status: "fail", message: "Unauthorized" })
    }

    try {
        const { idx } = req.query

        if (!idx || Array.isArray(idx)) {
            return res.status(400).json({ message: "Invalid board ID" })
        }

        const boardIdx = parseInt(idx, 10)

        if (req.method === "GET") {
            const board = await getBoardByIdx(boardIdx)
            if (!board) {
                return res.status(404).json({ message: "Board not found" })
            }
            return res.status(200).json(board)
        } else if (req.method === "DELETE") {
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
