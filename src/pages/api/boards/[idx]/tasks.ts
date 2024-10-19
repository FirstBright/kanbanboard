import { NextApiRequest, NextApiResponse } from "next"
import { parseCookies } from "nookies"
import { verify } from "jsonwebtoken"
import { addTask, getTasks } from "@/apis/tasks/DAO"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const cookies = parseCookies({ req })
        const token = cookies["token"]

        if (!token) {
            return res.status(401).json({ message: "Token not provided" })
        }

        try {
            verify(token, process.env.JWT_SECRET)

            const { idx } = req.query
            const boardIdx = parseInt(idx as string, 10)

            if (isNaN(boardIdx)) {
                return res.status(400).json({ message: "Invalid boardIdx" })
            }

            if (req.method === "POST") {
                await addTask(req, res, boardIdx)
            } else if (req.method === "GET") {
                await getTasks(req, res, boardIdx)
            } else {
                res.status(405).json({ message: "Method not allowed" })
            }
        } catch (error) {
            console.error("Error in API handler:", error)
            return res
                .status(401)
                .json({ status: "fail", message: "Invalid token" })
        }
    } catch (error) {
        console.error("API processing error:", error)
        res.status(500).json({ message: "Server error occurred" })
    }
}
