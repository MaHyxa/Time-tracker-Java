import React from 'react';
import {AppBar, Toolbar, IconButton, Typography, Button, Box, Backdrop} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {Link, useNavigate} from 'react-router-dom';
import {useOpen} from "../component/useOpen";
import {useKeycloak} from "@react-keycloak/web";
import {mainListItems} from "../component/menuButtons";
import List from "@mui/material/List";
import MuiDrawer from "@mui/material/Drawer";


const Navbar = () => {

    const { keycloak} = useKeycloak();
    const { setOpenStatus, getOpenStatus } = useOpen();
    const loggedIn = keycloak.authenticated;
    const navigate = useNavigate();

    const handleOpen = () => {
        setOpenStatus(!getOpenStatus());
    };

    const login = async () => {
        await keycloak.login();
    }

    const logout = async () => {
        await keycloak.logout();
    }

    return (
        <AppBar position="static">
            <Toolbar sx={{ boxShadow: '0px 5px 7px rgba(0, 0, 0, 0.34)', }}>
                {loggedIn && (
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleOpen}
                        sx={{
                            marginRight: '20px',
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}
                <MuiDrawer
                    variant="temporary"
                    open={getOpenStatus()}
                    onClose={handleOpen}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                        BackdropComponent: (props) => <Backdrop {...props} style={{ backgroundColor: 'transparent' }} />,
                    }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            top: '74px',
                        },
                    }}
                >
                    <List component="nav">
                        {mainListItems({ navigate })}
                    </List>
                </MuiDrawer>
                <Box component={Link} to="/" sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    mt: '15px',
                    mb: '15px',
                    marginLeft: {
                        md: '6%',  // 992px and above
                    },
                }}>
                    <img
                        alt="Time Tracker Logo"
                        src="https://assets-global.website-files.com/664cb48da27c78324389e462/664cb4da4a01a3b42aed2a9f_image.png"
                        width="48"
                    />
                    <Typography
                        variant="h1"
                        sx={{
                            marginLeft: '10px',
                            fontFamily: 'Arial, Helvetica Neue, Helvetica, sans-serif',
                            fontWeight: 700,
                            lineHeight: '32px',
                            letterSpacing: '0.25px',
                            fontSize: {
                                xs: '25px',  // 0px to 479px screen width
                                sm: '28px',  // 480px to 991px screen width
                                md: '38px',  // 992px and above
                            },
                        }}
                    >
                        Time Tracker
                    </Typography>
                </Box>
                <div style={{flexGrow: 1}}></div>
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        loggedIn ? logout() : login();
                    }}
                    sx={{
                        color: '#fff',
                        letterSpacing: '0.25px',
                        marginRight: {
                            sm: '4%',  // 480px to 991px screen width
                            md: '6%',  // 992px and above
                        },
                        fontSize: {
                            xs: '18px',  // 0px to 479px screen width
                            sm: '20px',  // 480px to 991px screen width
                            md: '22px',  // 992px and above
                        },
                        fontWeight: 700,
                        lineHeight: '24px',
                        textDecoration: 'none',
                        textTransform: 'none',
                        '&:hover': {
                            color: 'black',
                        },
                    }}
                >
                    {loggedIn ? 'Log Out' : 'Log In'}
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
