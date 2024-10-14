import { NextApiRequest, NextApiResponse } from "next"
import { destroyCookie } from "nookies"

export default function logout(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "POST") {
            destroyCookie({ res }, "token", {
                path: "/",
            })
            res.status(200).json({ message: "Logged out successfully" })
        } else {
            res.status(400).json({
                message: "지원하지 않는 메서드입니다.",
            })
        }
    } catch (e: any) {
        res.status(500).json({
            message: e.message,
        })
    }
}
