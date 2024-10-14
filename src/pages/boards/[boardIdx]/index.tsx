import { GetServerSideProps } from "next"
import MyKanbanBoard from "@/pages/myKanbanBoard" // Adjust the import based on your file structure
import axios from "axios"
import { parseCookies } from "nookies"
import { verify } from "jsonwebtoken"

const BoardTasksPage = ({ boardIdx }: { boardIdx: number }) => {
    return <MyKanbanBoard boardIdx={boardIdx} />
}

// Fetch the board ID from the URL parameters
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { boardIdx } = context.params as { boardIdx: string }
    const boardIdxNumber = parseInt(boardIdx, 10)

    if (isNaN(boardIdxNumber)) {
        return {
            notFound: true, // This will render the 404 page
        }
    }

    const cookies = parseCookies(context)
    const token = cookies.token

    if (!token) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        }
    }

    // Verify token and fetch data if needed here

    return {
        props: {
            boardIdx: boardIdxNumber,
        },
    }
}

export default BoardTasksPage