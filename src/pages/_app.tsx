import Background from "@/components/Background"
import Navbar from "@/components/Navbar"
import ToasterContext from "@/context/ToasterContext"
import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <ToasterContext />
                <Navbar />
                <Background>
                    <Component {...pageProps} />
                </Background>
            </QueryClientProvider>
        </>
    )
}
