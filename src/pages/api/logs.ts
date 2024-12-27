import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { message, context, stack } = req.body

        console.log(`[${context}] ${message}`)
        if (stack) {
            console.log(stack)
        }

        // 필요시 파일, 데이터베이스 또는 로그 관리 시스템에 기록
        res.status(200).send({ success: true })
    } else {
        res.setHeader("Allow", ["POST"])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
