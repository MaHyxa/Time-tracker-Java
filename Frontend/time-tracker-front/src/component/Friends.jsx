import * as React from 'react';
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";

import {theme} from './PageTemplate';
import Grid from "@mui/material/Grid";
import useAxiosPrivate from "../api/useAxiosPrivate";
import useFriends from '../api/useFriends';
import {toast} from "react-toastify";


const Friends = ({update}) => {

    const axiosPrivate = useAxiosPrivate();
    const { friends, isEmpty, loadFriends, setFriends } = useFriends();
    const [isHovered, setIsHovered] = useState(false);
    const [refresh, setRefresh] = useState(false);
    // const userEmail = getEmailFromToken();


    const startButtonStyle = {
        minWidth: '90px',
        maxWidth: '90px',
        maxHeight: 40,
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
        maxWidth: '90px',
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

    useEffect(() => {
        loadFriends();
    }, [loadFriends, update, refresh]);

    const acceptConnect = async (friend, e, index) => {
        if (e) {
            e.preventDefault();
        }
        try {
            const response = await axiosPrivate.patch('/api/v1/friends/my-friends/acceptConnect', friend.toString());
            const updatedFriend = response.data;

            setFriends(prevFriends =>
                prevFriends.map((f, i) => (i === index ? updatedFriend : f))
            );

        }
        catch (err) {
            setRefresh(!refresh);
            const errorMessage = err.response?.data || "Connection to the servers failed. Please try again in a few moments.";
            toast.error(errorMessage);
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
                setFriends(prevFriends =>
                    prevFriends.filter((_, i) => i !== index)
                );
            } else {
                toast.error("Connection to the servers failed. Please try again in a few moments.")
            }

        }
        catch (err) {
            const errorMessage = err.response?.data || "Connection to the servers failed. Please try again in a few moments.";
            toast.error(errorMessage);
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
                                }}
                            >
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={9} md={9}>
                                        <ListItemText
                                            primary={item.friend}
                                            primaryTypographyProps={{
                                                sx: {
                                                    overflowWrap: 'break-word',
                                                    wordWrap: 'break-word',
                                                    hyphens: 'auto',
                                                    maxWidth: '75%',
                                                    whiteSpace: 'pre-wrap'
                                                }
                                            }}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: {
                                                    xs: 'center',
                                                    sm: 'flex-start'
                                                }
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={3} md={3}>
                                        <Grid container spacing={{ xs: 1, sm: 2 }} sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: {
                                                xs: 'center',
                                                sm: 'flex-end'
                                            }
                                        }}>

                                            <Grid item sx={{display: 'flex', alignItems: 'center'}}>
                                                {item.status === 1 && (
                                                    <ListItemButton
                                                        sx={{
                                                            ...startButtonStyle,
                                                            bgcolor: theme.palette.primary.main,
                                                        }}
                                                        variant="contained"
                                                        onClick={(e) => acceptConnect(item.friend, e, index)}
                                                    >
                                                        Accept
                                                    </ListItemButton>
                                                )}
                                            </Grid>
                                            <Grid item sx={{display: 'flex', alignItems: 'center'}}>
                                                {item.status === 1 && (
                                                    <ListItemButton
                                                        sx={{
                                                            ...completeButtonStyle,
                                                            bgcolor: theme.palette.secondary.main,
                                                            "&:hover": {
                                                                bgcolor: theme.palette.secondary.red,
                                                            },
                                                        }}
                                                        variant="outlined"
                                                        onClick={(e) => rejectConnect(item.friend, e, index)}
                                                    >
                                                        Reject
                                                    </ListItemButton>
                                                )}

                                                {item.status === 0 && isHovered !== index && (
                                                    <ListItemButton
                                                        sx={{
                                                            ...completeButtonStyle,
                                                        }}
                                                        variant="outlined" disabled
                                                    >
                                                        Pending
                                                    </ListItemButton>
                                                )}

                                                {item.status === 0 && isHovered === index && (
                                                    <ListItemButton
                                                        sx={{
                                                            ...completeButtonStyle,
                                                            bgcolor: theme.palette.secondary.main,
                                                            "&:hover": {
                                                                bgcolor: theme.palette.secondary.red,
                                                            },
                                                        }}
                                                        variant="outlined"
                                                        onClick={(e) => rejectConnect(item.friend, e, index)}
                                                    >
                                                        Cancel
                                                    </ListItemButton>
                                                )}

                                                {item.status === 2 && (
                                                    <ListItemButton
                                                        sx={{
                                                            ...completeButtonStyle,
                                                            bgcolor: theme.palette.secondary.main,
                                                            "&:hover": {
                                                                bgcolor: theme.palette.secondary.red,
                                                            },
                                                            fontSize: "12pt",
                                                        }}
                                                        variant="outlined"
                                                        onClick={(e) => rejectConnect(item.friend, e, index)}
                                                    >
                                                        Disconnect
                                                    </ListItemButton>
                                                )}
                                            </Grid>
                                        </Grid>
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
