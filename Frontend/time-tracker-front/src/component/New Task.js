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

const StyledPaper = styled(Paper)(({theme}) => ({
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

export default function NewTask({update, taskWindow}) {

    const axiosPrivate = useAxiosPrivate();
    const [description, setDescription] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [success, setSuccess] = React.useState(false);
    const [rows, setRows] = useState(1);

    //This fkin function pass fkin value to fkin parent class and refresh fkin task list!
    const refresh = () => {
        update(success);
        taskWindow(success);
    };


    const addNewTask = async (e) => {
        e.preventDefault()
        if (description === null || description.trim() === "") {
            return setErrorMessage("Task can't be empty")
        }
        try {
            const response = await axiosPrivate.post('/api/v1/tasks/new',
                {
                    description: description
                });
            setErrorMessage('');
            setSuccess(true);
            setTimeout(() => {
                refresh();
            }, 500);
            console.log(response.data);

        } catch (err) {
            if (err.response && err.response.status === 400) {
                setErrorMessage("Too many requests. Please try again after 3 seconds");
            } else {
                // Handle other errors if necessary
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
                </Grid>
                <Grid item sx={{mt: 2, display: 'flex', justifyContent: 'flex-end'}}>
                    <StyledButton variant="contained" color="primary" onClick={addNewTask}>
                        Add task
                    </StyledButton>
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