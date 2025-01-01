import React, { ReactNode } from 'react'

interface BackgroundProps {
    children?: ReactNode
}

const Background: React.FC<BackgroundProps> = ({ children }) => {
    return (
        <div className="bg-[url('/bg.jpg')] min-h-screen md:h-[100vh] relative w-[100vw] bg-cover overflow-hidden text-white">
            {children}
        </div>
    )
}

export default Background
