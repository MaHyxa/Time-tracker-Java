import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import * as React from "react";
import {createTheme, styled} from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import {useNavigate} from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import List from "@mui/material/List";
import {mainListItems} from "./menuButtons";
import {Container, ThemeProvider} from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";


export function isTokenExpired(token) {
    if (!token) {
        // Token is missing
        return true;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000;

    const currentTime = Date.now();
    return expirationTime < currentTime;
}

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

export function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="http://localhost:3000/my-tasks">
                Time Tracker
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const drawerWidth = 210;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
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

    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    const navigate = useNavigate();

    const handleLogout=(e)=>{
        e.preventDefault()
        fetch("http://localhost:9192/api/v1/auth/logout", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
            .then(response => {
                if (response.ok) {
                    localStorage.removeItem('jwtToken');
                    navigate('/');
                } else {
                    throw new Error('Logout failed');
                }
            })
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: '24px', // keep right padding when drawer closed
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            Time Tracker
                        </Typography>
                        <Link color="inherit" href="#" onClick={handleLogout}>
                            Logout
                        </Link>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={!open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    />
                    <List component="nav">
                        {mainListItems({ navigate })}
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />
                    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                    {children}
                                </Paper>
                            </Grid>
                        </Grid>
                        <Copyright sx={{ pt: 4 }} />
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}