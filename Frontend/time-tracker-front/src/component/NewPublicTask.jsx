import * as React from 'react';
import {useState} from "react";
import {Grid} from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import {styled} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import {TaskAlt} from "@mui/icons-material";
import useAxiosPrivate from "../api/useAxiosPrivate";
import Box from "@mui/material/Box";

export const StyledPaper = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    maxWidth: "calc(100% - 20px)", // Adjusted width with a 10px gap from each side
    margin: '0 10px', // Adds 10px gap from each side
    color: theme.palette.text.primary,
}));

const StyledButton = styled(Button)({
    textTransform: "none",
    marginLeft: 'auto', // Adjust the distance from the right
});

export default function NewPublicTask({update, taskWindow}) {

    const axiosPrivate = useAxiosPrivate();
    const [description, setDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [rows, setRows] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [requestResponse, setRequestResponse] = useState([]);

    //This fkin function pass fkin value to fkin parent class and refresh fkin task list!
    const refresh = () => {
        update(success);
        taskWindow(success);
    };


    const addNewPublicTask = async (e) => {
        e.preventDefault()
        if (description === null || description.trim() === "") {
            return setErrorMessage("Task can't be empty")
        }
        setIsLoading(true);
        try {
            const response = await axiosPrivate.post('/api/v1/public-tasks/addPublicTask',
                {
                    taskName: description,
                    assignedUsers: [
                        "asd@asd.asd",
                        "asd@asd.asd",
                        "asd@asd.asd",
                        "user2@example.com",
                        "user3@example.com"
                    ]
                });
            setErrorMessage('');
            setSuccess(true);
            setIsLoading(false);
            const responseArray = response.data.split('\n');
            setRequestResponse(responseArray);
            
        } catch (err) {
            setIsLoading(false);
            if (err.response ) {
                setErrorMessage(err.response.data);
            } else {
                setErrorMessage("An unexpected error occurred. Please try again.");
            }
        }
    }

    return (
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
                        Describe your task
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        autoFocus
                        autoComplete="off"
                        multiline // enable multiline input
                        rows={rows} // number of visible rows
                        sx={{
                            overflowWrap: 'break-word',
                            wordWrap: 'break-word',
                            hyphens: 'auto'
                        }}
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                            const textareaLineHeight = 24;
                            const newRows = e.target.value ? Math.ceil(e.target.scrollHeight / textareaLineHeight) : 1;
                            setRows(newRows);
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    {errorMessage && (
                        <Typography variant="body2" color="error">
                            {errorMessage}
                        </Typography>
                    )}
                    <Box>
                        {requestResponse.map((message, index) => (
                            <Typography
                                key={index}
                                sx={{
                                    color: message.includes("successfully added") ? "green" : "red",
                                    marginBottom: 1
                                }}
                            >
                                {message}
                            </Typography>
                        ))}
                    </Box>
                </Grid>
                <Grid item sx={{mt: 2, display: 'flex', justifyContent: 'flex-end'}}>
                    {!isLoading && !success && (
                        <StyledButton variant="contained" color="primary" onClick={addNewPublicTask}>
                            Add public task
                        </StyledButton>
                    )}
                    {isLoading && !success && (
                        <StyledButton variant="contained" color="primary" disabled>
                            Loading ...
                        </StyledButton>
                    )}
                    {!isLoading && success && (
                        <StyledButton variant="contained" color="primary" onClick={refresh}>
                            Continue
                        </StyledButton>
                    )}
                </Grid>
                {success && (
                    <Grid item sx={{mt: 3, display: 'flex', justifyContent: 'flex-end'}}>
                        <TaskAlt style={{color: 'green'}}/>
                    </Grid>
                )}
            </Grid>
        </StyledPaper>
    );
}