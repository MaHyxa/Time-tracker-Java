import React, {useState} from 'react'
import PageTemplate from "../component/PageTemplate"
import useAxiosPrivate from "../api/useAxiosPrivate";
import {Button, Grid} from "@mui/material";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {TaskAlt} from "@mui/icons-material";
import {StyledPaper} from "../component/New Task";
import Friends from "../component/Friends";
import Box from "@mui/material/Box";


function ConnectedUsers() {

    const axiosPrivate = useAxiosPrivate();
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [emailErrorText, setEmailErrorText] = useState('');
    const [updateFriends, setUpdateFriends] = useState(true);
    const updateFriendsList = () => {
        setUpdateFriends(!updateFriends);
    };

    const handleInputError = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let hasError = false;

        // Reset errors
        setEmailError(false);

        // Check email validity
        if (email.length < 1) {
            setEmailError(true);
            setEmailErrorText('Please enter email');
            hasError = true;
        } else if (!emailRegex.test(email)) {
            setEmailError(true);
            setEmailErrorText('Invalid email format');
            hasError = true;
        }

        return hasError;
    };

    const addFriend = async (e) => {
        e.preventDefault();
        const checkInputError = handleInputError();
        if (checkInputError) {
            return;
        }

        try {
            const response = await axiosPrivate.post('/api/v1/friends/addFriend',
                {
                    email: email
                });
            if (response.data) {
                setSuccess(true);
                setErrorMessage(response.data);
                updateFriendsList();
            } else {
                setSuccess(false);
                setErrorMessage('An error occurred. Please try again.');
            }
        } catch (err) {
            if (err.response && err.response.data) {
                setErrorMessage(err.response.data);
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
        }
    }


    return (
        <PageTemplate>
            <StyledPaper
                sx={{
                    my: 1,
                    mx: {
                        xs : 0,
                        sm: 5
                    },
                    p: 2,
                }}
            >
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom sx={{ color: 'black' }}>
                            Please enter an email address of the user you wish to connect with
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="email"
                            type="email"
                            variant="outlined"
                            maxLength="256"
                            fullWidth
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={emailError}
                            helperText={emailError ? emailErrorText : ' '}
                            placeholder="User email"
                            autoComplete="email"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {errorMessage && (
                            <Typography variant="body2" color="error">
                                {errorMessage}
                            </Typography>
                        )}
                    </Grid>
                    <Grid item sx={{mt: 2, display: 'flex', justifyContent: 'flex-end'}}>
                        <Button variant="contained" color="primary" onClick={addFriend}>
                            Connect with user
                        </Button>
                    </Grid>
                    {success && (
                        <Grid item sx={{mt: 3, display: 'flex', justifyContent: 'flex-end'}}>
                            <TaskAlt style={{color: 'green'}}/>
                        </Grid>
                    )}
                </Grid>
            </StyledPaper>
            <Box sx={{position: "relative", mt: 5}}>
                <Friends update={updateFriends}/>
            </Box>
        </PageTemplate>

    )
}

export default ConnectedUsers
