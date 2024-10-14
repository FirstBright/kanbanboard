import dynamic from "next/dynamic"
import React from "react"

const YourComponent = dynamic(() => import("@/components/testboard"), {
    ssr: false,
})

function App() {
    return (
        <div>
            <YourComponent />
        </div>
    )
}

export default App
