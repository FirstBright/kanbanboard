import { NextApiRequest, NextApiResponse } from "next"
import { parseCookies } from "nookies"
import { verify } from "jsonwebtoken"
import { updateTask, deleteTask, getTask } from "@/apis/tasks/DAO"

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
            const taskIdx = parseInt(idx as string, 10)

            if (isNaN(taskIdx)) {
                return res.status(400).json({ message: "Invalid taskIdx" })
            }

            if (req.method === "PUT") {
                await updateTask(req, res, taskIdx)
            } else if (req.method === "DELETE") {
                await deleteTask(req, res, taskIdx)
            } else if (req.method === "GET") {
                await getTask(req, res, taskIdx)
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
