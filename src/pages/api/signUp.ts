import { createUser } from '@/apis/users/createUser'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function signup(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method === 'POST') {
            await createUser(req, res)
        } else {
            res.status(400).json({
                message: '지원하지 않는 메서드입니다.',
            })
        }
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({
                message: e.message,
            })
        } else {
            // 예상치 못한 오류 타입의 경우
            res.status(500).json({
                message: "An unexpected error occurred",
            })
        }
    }
}
