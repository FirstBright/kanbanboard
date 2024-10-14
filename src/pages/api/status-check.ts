import { NextApiRequest, NextApiResponse } from "next"

export default function statusCheck(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json({ status: "OK" })
}
