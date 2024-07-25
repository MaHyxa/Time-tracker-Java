import React, {useEffect, useState} from 'react'
import {Link} from "react-router-dom";
import PageTemplate, {theme} from "../component/PageTemplate"
import useAxiosPrivate from "../api/useAxiosPrivate";
import {Button, Grid} from "@mui/material";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {TaskAlt} from "@mui/icons-material";
import NewTask, {StyledPaper} from "../component/New Task";
import Friends from "../component/Friends";
import Box from "@mui/material/Box";
import Tasks from "../component/Tasks";
import PublicTaskComp from "../component/PublicTaskComp";
import AddIcon from "@mui/icons-material/Add";
import NewPublicTask from "../component/NewPublicTask";



function PublicTasks() {


    const [openNewPublicTask, setOpenNewPublicTask] = React.useState(false);
    const toggleNewPublicTask = () => {
        setOpenNewPublicTask(!openNewPublicTask);
    };

    //This fkin function get fkin value from fkin child class and refresh fkin task list!
    const [updatePublicTask, setUpdatePublicTask] = useState(true);
    const updatePublicTasks = () => {
        setUpdatePublicTask(!updatePublicTask);
    };

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

    // useEffect(() => {
    //     getStats();
    // }, []);

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
                    mx: 'auto',
                    p: 2,
                }}
            >
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                            Please enter an email address of the user you wish to connect with.
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
            <Box sx={{ position: "relative", mt: 5 }}>
                <Friends update={updateFriends}/>
            </Box>
            {/*<img*/}
            {/*    src="https://assets-global.website-files.com/664cb48da27c78324389e462/664cb48da27c78324389e502_Page%20Not%20Found%20Icon.svg"*/}
            {/*    loading="lazy" alt="" className="icon large"/>*/}
            {/*<h1 className="heading h1">Under Construction</h1>*/}
            {/*<p className="paragraph">Current page is in development. In future this page will allow you to assign tasks*/}
            {/*    for another people!</p>*/}
            {/*<div className="spacer _24"></div>*/}
            {/*<Link to="/" className="button w-button">*/}
            {/*    Go to Home*/}
            {/*</Link>*/}
            <Button sx={{
                width: 140,
                height: 50,
                borderRadius: 4,
                bgcolor: theme.palette.primary.main,
                color: "white",
                textTransform: "none",
                fontSize: "11pt",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                position: "relative",
                top: "6px",
                left: "7px",
                "&:hover": {
                    bgcolor: theme.palette.primary.dark,
                },
            }} variant="contained" onClick={toggleNewPublicTask} startIcon={<AddIcon/>}
            >
                New Public task
            </Button>
            {openNewPublicTask && (
                <Box sx={{mt: 4,
                    maxWidth: `calc(100% - 20px)`, // Adjusted width with a 10px gap from each side
                    margin: '0 10px', // 10px gap on both left and right sides
                    }}>
                    <NewPublicTask update={updateFriendsList} taskWindow={toggleNewPublicTask}/>
                </Box>
            )}
            <Box sx={{ position: "relative", mt: 5 }}>
                <PublicTaskComp update={updateFriends}/>
            </Box>
        </PageTemplate>

    )
}

export default PublicTasks
