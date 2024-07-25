import * as React from 'react';
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import IconButton from "@mui/material/IconButton";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";

import {theme, formatDate, formatMilliseconds} from './PageTemplate';
import Grid from "@mui/material/Grid";
import useAxiosPrivate from "../api/useAxiosPrivate";
import getEmailFromToken from "../api/getEmailFromToken";


const Friends = ({update}) => {

    const axiosPrivate = useAxiosPrivate();
    const [friends, setFriends] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const userEmail = getEmailFromToken();


    const startButtonStyle = {
        minWidth: '90px',
        maxWidth: '10%',
        maxHeight: 40,
        marginRight: 2,
        borderRadius: 2,
        color: "white",
        textTransform: "none",
        fontSize: "13pt",
        justifyContent: "center",
        fontWeight: "bold",
        position: 'relative',
        "&:hover": {
            bgcolor: theme.palette.primary.dark,
        }
    };

    const completeButtonStyle = {
        minWidth: '90px',
        maxWidth: '10%',
        maxHeight: 40,
        borderRadius: 2,
        bgcolor: theme.palette.primary.blue,
        color: "white",
        textTransform: "none",
        fontSize: "13pt",
        justifyContent: "center",
        fontWeight: "bold",
        position: 'relative',
        "&:hover": {
            bgcolor: theme.palette.primary.darkblue,
        }
    };

    //any changes in "update" will trigger useEffect
    useEffect(() => {
        loadFriends();
    }, [update, refresh]);
    const loadFriends = async () => {
        try {
            const response = await axiosPrivate.get('/api/v1/friends/my-friends');
            if (response.data && response.data.length > 0) {
                setFriends(response.data);
                setIsEmpty(false);
            } else {
                setIsEmpty(true);
            }

        } catch (err) {
            console.error('Error:', err);
        }
    }

    const startTimeCount = async (id, e, index) => {
        if (e) {
            e.preventDefault();
        }
        try {
            const response = await axiosPrivate.patch('/api/v1/tasks/my-tasks/startTask', id.toString());
            friends[index] = response.data;
            setFriends([...friends]);

        } catch (err) {
            console.error('Error:', err);
        }
    }

    const stopTimeCount = async (id, e, index) => {
        if (e) {
            e.preventDefault();
        }
        try {
            const response = await axiosPrivate.patch('/api/v1/tasks/my-tasks/stopTask', id.toString());
            friends[index] = response.data;
            setFriends([...friends]);

        } catch (err) {
            console.error('Error:', err);
        }
    }
    const acceptConnect = async (friend, e, index) => {
        if (e) {
            e.preventDefault();
        }
        try {
            const response = await axiosPrivate.patch('/api/v1/friends/my-friends/acceptConnect', friend.toString());
            friends[index] = response.data;
            setFriends([...friends]);

        } catch (err) {
            setRefresh(!refresh);
            console.error('Error:', err);
        }
    }

    const rejectConnect = async (friend, e, index) => {
        if (e) {
            e.preventDefault();
        }
        try {
            const response = await axiosPrivate.delete('/api/v1/friends/my-friends/rejectConnect', {
                data: friend
            });
            if (response.status === 204) {
                setRefresh(!refresh);
                friends.splice(index, 1);
                setFriends([...friends]);
            } else {
                return console.error("Something wrong")
            }

        } catch (err) {
            setRefresh(!refresh);
            console.error('Error:', err);
        }
    }

    const deleteTask = async (id, e, index) => {
        if (e) {
            e.preventDefault();
        }
        try {
            const response = await axiosPrivate.delete('/api/v1/tasks/my-tasks/deleteTask', {
                data: id
            });
            if (response.status === 204) {
                setRefresh(!refresh);
                friends.splice(index, 1);
                setFriends([...friends]);
            } else {
                return console.error("Something wrong")
            }
        } catch (err) {
            console.error('Error:', err);
        }
    }

    return (
        <React.Fragment>
            <Typography variant="h4" color={theme.palette.primary.blue} sx={{textAlign: 'center'}} gutterBottom mt={1}>
                All connected users
            </Typography>
            {isEmpty && (
                <Box sx={{
                    mt: 4,
                    mb: 4,
                    fontSize: "1.25rem",
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "500",
                    position: "relative"
                }}>
                    You dont have any connected users yet. You can connect to someone by pressing 'Connect with user' button
                </Box>
            )}
            {!isEmpty && (
                <List disablePadding>
                    {friends.map((item, index) => (
                        <div key={index}>
                            <ListItem
                                onMouseEnter={() => setIsHovered(index)}
                                onMouseLeave={() => setIsHovered(null)}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: '#f2f2f2',
                                    },
                                    py: 1,
                                    minHeight: 70,
                                    color: '#000000',
                                    borderRadius: 1,
                                    position: 'relative',
                                    border: '1px solid #ccc',
                                    backgroundImage: item.complete ? `url(${process.env.PUBLIC_URL}/blue.jpg)` : 'none',
                                    backgroundSize: 'cover',
                                }}
                            >
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={6} md={10}>
                                        <ListItemText
                                            primary={item.friendOne === userEmail ? item.friendTwo : item.friendOne}
                                            primaryTypographyProps={{
                                                sx: {
                                                    overflowWrap: 'break-word',
                                                    wordWrap: 'break-word',
                                                    hyphens: 'auto',
                                                    maxWidth: '75%',
                                                    whiteSpace: 'pre-wrap'
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} md={2} sx={{ display: 'flex', alignItems: 'center' }}>

                                        {item.status === 0 && item.friendTwo === userEmail && (
                                            <ListItemButton
                                                sx={{
                                                    ...startButtonStyle,
                                                    bgcolor: theme.palette.primary.main,
                                                }}
                                                variant="contained"
                                                onClick={(e) => acceptConnect(item.friendOne, e, index)}
                                            >
                                                Accept
                                            </ListItemButton>
                                        )}

                                        {item.status === 0 && item.friendTwo === userEmail && (
                                            <ListItemButton
                                                sx={{
                                                    ...completeButtonStyle,
                                                }}
                                                variant="outlined"
                                                onClick={(e) => rejectConnect(item.friendOne, e, index)}
                                            >
                                                Reject
                                            </ListItemButton>
                                        )}

                                        {item.status === 0 && item.friendOne === userEmail && isHovered !== index && (
                                            <ListItemButton
                                                sx={{
                                                    ...completeButtonStyle,
                                                }}
                                                variant="outlined" disabled
                                            >
                                                Pending
                                            </ListItemButton>
                                        )}

                                        {item.status === 0 && item.friendOne === userEmail && isHovered === index && (
                                            <ListItemButton
                                                sx={{
                                                    ...completeButtonStyle,
                                                }}
                                                variant="outlined"
                                                onClick={(e) => rejectConnect(item.friendTwo, e, index)}
                                            >
                                                Cancel
                                            </ListItemButton>
                                        )}

                                        {item.status === 1 && (
                                            <ListItemButton
                                                sx={{
                                                    ...completeButtonStyle,
                                                }}
                                                variant="outlined"
                                                onClick={(e) => rejectConnect(item.friendOne === userEmail ? item.friendTwo : item.friendOne, e, index)}
                                            >
                                                Disconnect
                                            </ListItemButton>
                                        )}

                                    </Grid>
                                </Grid>
                            </ListItem>
                        </div>
                    ))}
                </List>
            )}
        </React.Fragment>
    );
}
export default Friends;
