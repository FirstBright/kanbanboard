import { NextApiRequest, NextApiResponse } from "next"
import { parseCookies } from "nookies"
import { updateTask, deleteTask, getTask } from "@/apis/tasks/DAO"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { taskIdx } = req.query
    const idxStr = Array.isArray(taskIdx) ? taskIdx[0] : taskIdx

    // Validate the taskIdx query parameter
    if (
        !idxStr ||
        isNaN(parseInt(idxStr, 10)) ||
        parseInt(idxStr, 10).toString() !== idxStr
    ) {
        return res.status(400).json({ message: "유효하지 않은 idx입니다." })
    }

    const taskIdxNumber = parseInt(idxStr, 10)

    try {
        // Parse cookies to check for the token
        const cookies = parseCookies({ req })
        const token = cookies["token"]

        if (!token) {
            return res
                .status(401)
                .json({ message: "토큰이 제공되지 않았습니다." })
        }

        // Perform the task operation based on the request method
        switch (req.method) {
            case "GET":
                const task = await getTask(req, res, taskIdxNumber)
                if (!task) {
                    return res
                        .status(404)
                        .json({ message: "Task를 찾을 수 없습니다." })
                }
                return res.status(200).json(task)

            case "PUT":
                await updateTask(req, res, taskIdxNumber)
                return res
                    .status(200)
                    .json({ message: "Task가 업데이트되었습니다." })

            case "DELETE":
                await deleteTask(req, res, taskIdxNumber)
                return res
                    .status(200)
                    .json({ message: "Task가 삭제되었습니다." })

            default:
                return res
                    .status(405)
                    .json({ message: "지원하지 않는 메서드입니다." })
        }
    } catch (error) {
        // Return detailed error information for debugging
        console.error("API 처리 중 오류 발생:", error)
        return res.status(500).json({
            message: "서버 오류가 발생했습니다.",
        })
    }
}

export default handler
