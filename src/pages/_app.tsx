import Background from "@/components/Background"
import Navbar from "@/components/Navbar"
import ToasterContext from "@/context/ToasterContext"
import "@/styles/globals.css"
import type { AppProps } from "next/app"

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
        <ToasterContext/>
            <Navbar />
            <Background>
                <Component {...pageProps} />
            </Background>
        </>
    )
}
