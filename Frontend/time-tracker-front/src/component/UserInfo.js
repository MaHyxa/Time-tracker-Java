import * as React from 'react';
import {styled, createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {mainListItems} from './menuButtons';
import {useNavigate} from "react-router-dom";
import {Container} from "@mui/material";
import {useEffect, useState} from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {isTokenExpired} from "./PageTemplate";

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="http://localhost:3000/">
                Time Tracker
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
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
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const theme = createTheme({
    palette: {
        primary: {
            main: "#06be06",
            dark: "#14ae17",
        },
        secondary: {
            main: "#f44336",
        },
    },
});

const defaultTheme = createTheme();

export default function UserInfo() {

    const handleUserChange = (property) => (e) => {
        setUser({...user, [property]: e.target.value});
    };

    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    const [passwordChangeSuccess, setPasswordChangeSuccess] = React.useState(false);
    const [userChangeSuccess, setUserChangeSuccess] = React.useState(false);

    const [displayPasswordFields, setDisplayPasswordFields] = React.useState(false);
    const togglePassword = () => {
        setDisplayPasswordFields(!displayPasswordFields);
    };

    const navigate = useNavigate()

    const [user, setUser] = useState(null);
    const [oldUser, setOldUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [userErrorMessage, setUserErrorMessage] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmationPassword, setConfirmationPassword] = useState('');
    const handleChange = (setter) => (event) => {
        setter(event.target.value);
    };

    const handleLogout = (e) => {
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

    useEffect(() => {
        getUser();
    }, []);
    const getUser = async () => {
        const result = await fetch("http://localhost:9192/api/v1/users/info", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    navigate('/');
                    throw new Error('Please Login');
                }
            })
            .then(data => {
                setUser(data);
                setOldUser(data);
            })
            .catch(error => console.error(error));
    }

    function isEqual(user1, user2) {

        if (!user1 && !user2) {
            return true;
        }

        if (!user1 || !user2) {
            return false;
        }

        return (
            user1.firstname === user2.firstname &&
            user1.lastname === user2.lastname &&
            user1.email === user2.email
        );
    }

    const changeUserDetails = (e) => {
        e.preventDefault();
        if (isTokenExpired(localStorage.getItem('jwtToken'))) {
            localStorage.removeItem('jwtToken');
            navigate('/');
            return;
        }
        const data = {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email
        };
        fetch("http://localhost:9192/api/v1/users/changeUserDetails", {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (response.ok) {
                    setUserChangeSuccess(true);
                    setUserErrorMessage("Changes saved successfully.");
                    return response.json();
                } else {
                    setUserChangeSuccess(false);
                    throw new Error('This Email already exist. Please use another email address.');
                }
            })
            .then(response => {
                if(response.email === oldUser.email)
                {
                    setUser(response);
                    setOldUser(response);
                }
                else {
                    setUserErrorMessage("Email changed successfully. You will be redirected to Login Page in 3 seconds.");
                    setTimeout(() => {
                        handleLogout(e);
                    }, 3000);
                }
            })
            .catch(error => setUserErrorMessage(error.message));
    }

    const changePassword = (e) => {
        e.preventDefault();
        if (isTokenExpired(localStorage.getItem('jwtToken'))) {
            localStorage.removeItem('jwtToken');
            navigate('/');
            return;
        }
        const password = {currentPassword, newPassword, confirmationPassword}
        if (currentPassword.length < 1 || newPassword.length < 1 || confirmationPassword.length < 1) {
            return
        }
        fetch("http://localhost:9192/api/v1/users/changePassword", {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(password)
        })
            .then(response => {
                if (response.ok) {
                    togglePassword();
                    setPasswordChangeSuccess(true);
                    return setErrorMessage("Password changed successfully.")
                } else {
                    setPasswordChangeSuccess(false);
                    return setErrorMessage("Current password you've entered is incorrect. Please try again.")
                }
            })
            .catch(error => console.error(error));
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{display: 'flex'}}>
                <CssBaseline/>
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
                                ...(open && {display: 'none'}),
                            }}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{flexGrow: 1}}
                        >
                            Time Tracker
                        </Typography>
                        <Link color="inherit" href="#" onClick={handleLogout}>
                            Logout
                        </Link>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                px: [7],
                            }}
                        >
                            Menu
                        </Typography>
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon/>
                        </IconButton>
                    </Toolbar>
                    <Divider/>
                    <List component="nav">
                        {mainListItems({navigate})}
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
                    <Toolbar/>
                    <Container maxWidth="xl" sx={{mt: 4, mb: 4}}>
                        <Grid item xs={12}>
                            <Paper sx={{p: 2, display: 'flex', flexDirection: 'column'}}>
                                {user ? (
                                    <div>
                                        <Typography variant="h3" gutterBottom>
                                            Welcome, {user.firstname}.
                                        </Typography>
                                        <Typography variant="h6" gutterBottom sx={{marginBottom: 2}}>
                                            General information:
                                        </Typography>
                                        <Grid container spacing={10} direction="row">
                                            <Grid item>
                                                <TextField
                                                    id="firstname"
                                                    defaultValue={user.firstname}
                                                    label="Firstname"
                                                    InputLabelProps={{
                                                        style: {textAlign: 'center', fontSize: '1.3rem'},
                                                    }}
                                                    inputProps={{style: {fontSize: '1.5rem'}}}
                                                    helperText="Click if you want to change it"
                                                    variant="standard"
                                                    fullWidth
                                                    onChange={(e) => {
                                                        handleUserChange('firstname')(e);
                                                        setUserErrorMessage('');
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    id="lastname"
                                                    defaultValue={user.lastname}
                                                    label="Lastname"
                                                    InputLabelProps={{
                                                        style: {textAlign: 'center', fontSize: '1.3rem'},
                                                    }}
                                                    inputProps={{style: {fontSize: '1.5rem'}}}
                                                    helperText="Click if you want to change it"
                                                    variant="standard"
                                                    fullWidth
                                                    onChange={(e) => {
                                                        handleUserChange('lastname')(e);
                                                        setUserErrorMessage('');
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    id="email"
                                                    defaultValue={user.email}
                                                    label="Email"
                                                    InputLabelProps={{
                                                        style: {textAlign: 'center', fontSize: '1.3rem'},
                                                    }}
                                                    inputProps={{style: {fontSize: '1.5rem'}}}
                                                    helperText="Click if you want to change it"
                                                    variant="standard"
                                                    fullWidth
                                                    onChange={(e) => {
                                                        handleUserChange('email')(e);
                                                        setUserErrorMessage('');
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                        {userChangeSuccess && (
                                            <Typography variant="body2" color={theme.palette.primary.dark}
                                                        sx={{mt: 2}} gutterBottom>
                                                {userErrorMessage}
                                            </Typography>
                                        )}
                                        {!userChangeSuccess && (
                                            <Typography variant="body2" color={theme.palette.secondary.main}
                                                        sx={{mt: 2}} gutterBottom>
                                                {userErrorMessage}
                                            </Typography>
                                        )}
                                        <Button sx={{
                                            mb: 2,
                                            mt: 2,
                                            width: 'auto',
                                            height: 50,
                                            borderRadius: 4,
                                            bgcolor: "#eeb844",
                                            color: "white",
                                            textTransform: "none",
                                            fontSize: "13pt",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: "bold",
                                            position: "relative",
                                            top: '50%',
                                            left: '10%',
                                            transform: 'translate(-50%, 0%)',
                                            "&:hover": {
                                                bgcolor: "#e9a616",
                                            },
                                        }} variant="contained" onClick={changeUserDetails}
                                                disabled={isEqual(user, oldUser)}
                                        >
                                            Save Changes
                                        </Button>
                                        {!displayPasswordFields && (
                                            <Button sx={{
                                                width: 'auto',
                                                height: 50,
                                                borderRadius: 4,
                                                bgcolor: "#eeb844",
                                                color: "white",
                                                textTransform: "none",
                                                fontSize: "13pt",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: "bold",
                                                position: "relative",
                                                top: '50%',
                                                left: '10%',
                                                transform: 'translate(-50%, 0%)',
                                                "&:hover": {
                                                    bgcolor: "#e9a616",
                                                },
                                            }} variant="contained" onClick={togglePassword}
                                            >
                                                Change Password
                                            </Button>
                                        )}
                                        {displayPasswordFields && (
                                            <div>
                                                <Grid container spacing={10} direction="row">
                                                    <Grid item xs={12} md={"auto"}>
                                                        <TextField
                                                            id="current-password"
                                                            label="Current Password"
                                                            autoComplete="off"
                                                            InputLabelProps={{
                                                                style: {textAlign: 'center', fontSize: '1.3rem'},
                                                            }}
                                                            inputProps={{style: {fontSize: '1.5rem'}}}
                                                            helperText="Enter current password"
                                                            variant="standard"
                                                            fullWidth
                                                            value={currentPassword}
                                                            onChange={handleChange(setCurrentPassword)}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={"auto"}>
                                                        <TextField
                                                            id="new-password"
                                                            label="New Password"
                                                            autoComplete="off"
                                                            InputLabelProps={{
                                                                style: {textAlign: 'center', fontSize: '1.3rem'},
                                                            }}
                                                            inputProps={{style: {fontSize: '1.5rem'}}}
                                                            helperText="Enter new password"
                                                            variant="standard"
                                                            fullWidth
                                                            value={newPassword}
                                                            onChange={handleChange(setNewPassword)}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={"auto"}>
                                                        <TextField
                                                            id="confirm-password"
                                                            label="Confirm Password"
                                                            autoComplete="off"
                                                            InputLabelProps={{
                                                                style: {textAlign: 'center', fontSize: '1.3rem'},
                                                            }}
                                                            inputProps={{style: {fontSize: '1.5rem'}}}
                                                            helperText="Confirm new password"
                                                            variant="standard"
                                                            fullWidth
                                                            value={confirmationPassword}
                                                            onChange={handleChange(setConfirmationPassword)}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={"auto"}>
                                                    </Grid>
                                                </Grid>
                                                <Button sx={{
                                                    mt: 2,
                                                    width: 'auto',
                                                    height: 50,
                                                    borderRadius: 4,
                                                    bgcolor: "#eeb844",
                                                    color: "white",
                                                    textTransform: "none",
                                                    fontSize: "13pt",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontWeight: "bold",
                                                    position: "relative",
                                                    top: '50%',
                                                    left: '10%',
                                                    transform: 'translate(-50%, 0%)',
                                                    "&:hover": {
                                                        bgcolor: "#e9a616",
                                                    },
                                                }} variant="contained" onClick={changePassword}
                                                        disabled={
                                                            newPassword !== confirmationPassword ||
                                                            newPassword === '' ||
                                                            confirmationPassword === '' ||
                                                            newPassword === null ||
                                                            confirmationPassword === null
                                                        }
                                                >
                                                    Change Password
                                                </Button>
                                            </div>
                                        )}
                                        {passwordChangeSuccess && (
                                            <Typography variant="body2" color={theme.palette.primary.dark}
                                                        sx={{mt: 2}} gutterBottom>
                                                {errorMessage}
                                            </Typography>
                                        )}
                                        {!passwordChangeSuccess && (
                                            <Typography variant="body2" color={theme.palette.secondary.main}
                                                        sx={{mt: 2}} gutterBottom>
                                                {errorMessage}
                                            </Typography>
                                        )}
                                    </div>
                                ) : (
                                    <div>Loading...</div>
                                )}
                            </Paper>
                        </Grid>
                        <Copyright sx={{pt: 4}}/>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}