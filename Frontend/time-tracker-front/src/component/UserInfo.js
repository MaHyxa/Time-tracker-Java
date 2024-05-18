import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {theme, isTokenExpired} from "./PageTemplate";
import PageTemplate from "./PageTemplate"

export default function UserInfo() {

    const handleUserChange = (property) => (e) => {
        setUser({...user, [property]: e.target.value});
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
        <PageTemplate>
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
        </PageTemplate>
    );
}