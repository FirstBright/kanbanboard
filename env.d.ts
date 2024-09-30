declare global {
    namespace NodeJS {
        interface ProcessEnv {
            JWT_SECRET: string
            DATABASE_URL: string
            NAVER_PW: string
        }
    }
}

export {}
