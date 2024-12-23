import useSWR from "swr"
import * as React from "react"
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Paper,
    Grid,
} from "@mui/material"

interface Stats {
    cpu: number
    memory: {
        free: number
        total: number
        used: number
    }
    storage: {
        free: number
        total: number
    }
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const Dashboard = () => {
    const { data: stats, error } = useSWR<Stats>("/api/server-stats", fetcher, {
        refreshInterval: 1000,
    })

    if (error) return <p>Error: {error}</p>
    if (!stats) return <p>Loading...</p>

    return (
        <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
            <AppBar position='static'>
                <Toolbar>
                    <Typography variant='h6' component='div'>
                        Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant='h5'>CPU Usage</Typography>
                        <Typography variant='body1'>{stats.cpu}%</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant='h5'>Memory Usage</Typography>
                        <Typography variant='body1'>
                            {(
                                (stats.memory.used / stats.memory.total) *
                                100
                            ).toFixed(2)}
                            %
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant='h5'>Free Storage</Typography>
                        <Typography variant='body1'>
                            {(stats.storage.free / 1024 / 1024 / 1024).toFixed(
                                2
                            )}{" "}
                            GB
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Dashboard
