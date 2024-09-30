import React, { ReactNode } from "react"

interface BackgroundProps {
    children?: ReactNode
}

const Background: React.FC<BackgroundProps> = ({ children }) => {
    return (
        <div className="bg-[url('/bg.jpg')] h-[102vh] relative w-full bg-cover mt-[-75px] overflow-hidden text-white pt-20">
            {children}
        </div>
    )
}

export default Background
