import Background from "@/components/Background"
import Navbar from "@/components/Navbar"
import { ToastContainer, toast } from "react-toastify"
import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <ToastContainer
                    position='top-center'
                    limit={1}
                    closeButton={false}
                    autoClose={3000}
                    hideProgressBar
                />
                <Background>
                    <Navbar />
                    <Component {...pageProps} />
                </Background>
            </QueryClientProvider>
        </>
    )
}
