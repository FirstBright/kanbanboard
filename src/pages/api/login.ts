import { PrismaClient } from "@prisma/client"
import { compare } from "bcrypt"
import { NextApiRequest, NextApiResponse } from "next"
import { sign } from "jsonwebtoken"
import { setCookie } from "nookies"

const prisma = new PrismaClient()

const loginUser = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method === "POST") {
            const { nickname, password } = req.body
            if (!nickname || !password) {
                return res
                    .status(400)
                    .json({ message: "닉네임, 비밀번호이 필요합니다." })
            }
            const user = await prisma.user.findUnique({
                where: {
                    nickname,
                },
            })
            if (user === null) {
                return res
                    .status(400)
                    .json({ message: "닉네임에 해당하는 유저가 없습니다." })
            }
            const hashedPassword = user.password
            const isCollect = await compare(password, hashedPassword)
            if (!isCollect) {
                return res
                    .status(400)
                    .json({ message: "비밀번호가 일치하지 않습니다." })
            }
            const payload = {
                nickname: user.nickname,
                idx: user.idx,
                createAt: user.createdAt,
                updateAt: user.updatedAt,
            }

            const token = await sign(payload, process.env.JWT_SECRET, {
                expiresIn: "1h",
            })

            setCookie({ res }, "token", token, {
                maxAge: 60 * 60, // 1 hour
                path: "/", // Cookie path
                httpOnly: true, // Cannot be accessed by JavaScript
                secure: false, // Only sent over HTTPS
            })
            res.status(200).json({ status: "success" })
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

export default loginUser
