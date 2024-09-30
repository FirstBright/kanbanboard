import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"
import { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

export const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
    const { nickname, password, email } = req.body
    if (
        nickname === undefined ||
        password === undefined ||
        email === undefined
    ) {
        return res
            .status(400)
            .json({ message: "Please Check name, password, email" })
    }
    const hashPassword = await hash(password, 10)
    const user = await prisma.user.create({
        data: {
            nickname,
            password: hashPassword,
            email,
        },
    })

    res.status(200).json({
        status: 200,
        message: `${user.nickname} signup success`,
    })
}
