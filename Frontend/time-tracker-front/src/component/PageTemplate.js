import * as React from "react";
import {createTheme, styled} from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import {useNavigate} from "react-router-dom";
import List from "@mui/material/List";
import {mainListItems} from "./menuButtons";
import {Container, ThemeProvider} from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

export function formatMilliseconds(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(seconds / (3600 * 24));
    const remainingHours = Math.floor((seconds % (3600 * 24)) / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedDays = String(days);
    const formattedHours = String(remainingHours).padStart(2, '0');
    const formattedMinutes = String(remainingMinutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    if (milliseconds < 86400000) {
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}s`;
    } else {
        return `${formattedDays} Days ${formattedHours}:${formattedMinutes}:${formattedSeconds}s`;
    }
}

export function formatDate(inputDate) {

    const date = new Date(inputDate);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${day}/${month}/${year}`;
}

export function formatTime(inputTime) {
    const date = new Date(inputTime);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `at ${hours}:${minutes} on ${day}/${month}/${year}`;
}

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: 210,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(7),
                },
            }),
        },
    }),
);

export const theme = createTheme({
    palette: {
        primary: {
            main: "#06be06",
            dark: "#14ae17",
            blue: "#1976d2",
            darkblue: "#1664b0",
        },
        secondary: {
            main: "#ed4135",
            red: "#d23a2e",
        },
    },
});

export const defaultTheme = createTheme();

export default function Template({ children }) {

    ///const { getOpenStatus } = useOpen();

    const navigate = useNavigate();

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: 'flex' }}>
                <Drawer variant="permanent" open={false}>
                    <List component="nav">
                        {mainListItems({ navigate })}
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: '#fff',
                        backgroundImage: 'radial-gradient(circle at 200% 300%, #2d8cff, #fff 82%), radial-gradient(circle at 50% 0, rgba(239, 152, 207, .2), rgba(0, 0, 0, 0) 57%), radial-gradient(circle at 0 20%, rgba(122, 167, 255, .25), rgba(0, 0, 0, 0) 42%)',
                        flexGrow: 1,
                        height: '86.7vh',
                        overflow: 'auto',
                    }}
                >
                    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', border: '1px solid #e7e7e789' }}>
                                    {children}
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}