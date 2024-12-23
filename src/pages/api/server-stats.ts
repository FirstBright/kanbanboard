import { NextApiRequest, NextApiResponse } from "next"
import os from "os"
import osu from "os-utils"
import diskusage from "diskusage"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    osu.cpuUsage((cpuPercent) => {
        const path = os.platform() === "win32" ? "C:" : "/"
        let storage = { free: 0, total: 0 }
        try {
            const { free, total } = diskusage.checkSync(path)
            storage = { free, total }
        } catch (err) {
            console.error("Disk usage error:", err)
        }

        const stats = {
            cpu: (cpuPercent * 100).toFixed(2),
            memory: {
                free: os.freemem(),
                total: os.totalmem(),
                used: os.totalmem() - os.freemem(),
            },
            storage,
        }
        res.status(200).json(stats)
    })
}
