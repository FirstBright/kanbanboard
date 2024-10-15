import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'

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
            .json({ message: 'Please Check name, password, email' })
    }

    const users = await prisma.user.findMany({
        where: {
            OR: [{ nickname }, { email }],
        },
    })
    if (users.length >= 1) {
        return res
            .status(400)
            .json({ message: '이메일이나 닉네임이 중복입니다.' })
    }

    const hashPassword = await hash(password, 10)
    const result = await prisma.user.create({
        data: {
            nickname,
            password: hashPassword,
            email,
        },
    })

    res.status(200).json({
        status: 200,
        message: `${result.nickname} signup success`,
    })
}
