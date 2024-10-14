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
            // Verify token here
            // verify(token, process.env.JWT_SECRET)

            const { boardIdx } = req.query
            if (typeof boardIdx !== "string") {
                return res.status(410).json({ message: "Invalid boardIdx" })
            }

            const boardIdxNumber = parseInt(boardIdx, 10)
            if (isNaN(boardIdxNumber)) {
                return res.status(420).json({ message: "Invalid boardIdx" })
            }

            if (req.method === "GET") {
                await getTasks(req, res, boardIdxNumber)
            } else if (req.method === "POST") {
                await addTask(req, res, boardIdxNumber)
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
