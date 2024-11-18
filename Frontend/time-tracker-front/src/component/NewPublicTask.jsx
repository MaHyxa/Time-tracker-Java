import * as React from 'react';
import {useState} from "react";
import {
    Autocomplete,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    Grid,
    useMediaQuery
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import {styled} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import {TaskAlt} from "@mui/icons-material";
import useAxiosPrivate from "../api/useAxiosPrivate";
import Box from "@mui/material/Box";
import useFriends from "../api/useFriends";
import {toast} from "react-toastify";

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
    marginLeft: 'auto',
});

export default function NewPublicTask({update, taskWindow}) {

    const axiosPrivate = useAxiosPrivate();
    const { activeFriends, isEmpty, loadFriends} = useFriends();
    const [description, setDescription] = useState('');
    const [success, setSuccess] = useState(false);
    const [rows, setRows] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [requestResponse, setRequestResponse] = useState([]);
    const [loadingFriends, setLoadingFriends] = useState(false);
    const [selectedFriends, setSelectedFriends] = useState([]);

    const refresh = () => {
        update(success);
        taskWindow(success);
    };

    const fetchFriendsIfEmpty = async () => {
        if (isEmpty) {
            setLoadingFriends(true);
            await loadFriends();
            setLoadingFriends(false);
        }
    };

    const handleAutocompleteChange = (event, newValue) => {
        setSelectedFriends(newValue);
    };

    const handleSelectAllChange = (event) => {
        fetchFriendsIfEmpty();
        if (event.target.checked) {
            setSelectedFriends(activeFriends);
        } else {
            setSelectedFriends([]);
        }
    };

    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    const addNewPublicTask = async (e) => {
        e.preventDefault()
        if (description === null || description.trim() === "") {
            toast.error("Task can't be empty");
            return;
        }

        if (selectedFriends.length <= 0) {
            toast.error("You must assign at least one participant");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axiosPrivate.post('/api/v1/public-tasks/addPublicTask',
                {
                    taskName: description,
                    assignedUsers: selectedFriends.map(friend => friend.friend)
                });
            setSuccess(true);
            setIsLoading(false);
            const responseArray = response.data.split('\n');
            setRequestResponse(responseArray);

        } catch (err) {
            setIsLoading(false);
            const errorMessage = err.response?.data || "Connection to the servers failed. Please try again in a few moments.";
            toast.error(errorMessage);
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
                <Grid item xs={12} md={6} sx={{
                    mt:2
                }}>
                    <Autocomplete
                        multiple
                        limitTags={2}
                        id="friend-autocomplete"
                        options={activeFriends}
                        disableCloseOnSelect
                        getOptionLabel={(option) => option.friend}
                        loading={loadingFriends}
                        onChange={handleAutocompleteChange}
                        onOpen={fetchFriendsIfEmpty}
                        value={selectedFriends}
                        renderOption={(props, option, {selected}) => {
                            const {key, ...optionProps} = props;
                            return (
                                <Box component="li" key={key} {...optionProps} >
                                    {isSmallScreen ? (
                                        <>
                                            <Typography variant="body2" noWrap>
                                                {option.friend}
                                            </Typography>
                                            <Checkbox checked={selected}/>
                                        </>
                                    ) : (
                                        <>
                                            <Checkbox checked={selected}/>
                                            <Typography variant="body2" noWrap>
                                                {option.friend}
                                            </Typography>
                                        </>
                                    )}
                                </Box>

                            );
                        }}
                        renderInput={(params) => (
                            <div>
                                <TextField
                                    {...params}
                                    label="Select participant(s)"
                                    variant="outlined"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {loadingFriends ? <CircularProgress color="inherit" size={20}/> : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                                <FormControlLabel
                                    sx={{
                                        display: 'flex', alignItems: 'center', padding: '8px'
                                    }}
                                    control={
                                        <Checkbox
                                            onChange={handleSelectAllChange}
                                            checked={selectedFriends.length === activeFriends.length && activeFriends.length > 0}
                                        />
                                    }
                                    label="Select All"
                                />
                            </div>
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
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