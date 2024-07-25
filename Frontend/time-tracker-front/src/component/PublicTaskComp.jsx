import * as React from 'react';
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";

import {theme, formatDate, formatTime} from './PageTemplate';
import Grid from "@mui/material/Grid";
import useAxiosPrivate from "../api/useAxiosPrivate";
import getEmailFromToken from "../api/getEmailFromToken";
import Divider from "@mui/material/Divider";


const PublicTaskComp = ({update}) => {

    const axiosPrivate = useAxiosPrivate();
    const [publicTasks, setPublicTasks] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const userEmail = getEmailFromToken();
    const [openIndex, setOpenIndex] = useState(null);

    const openTask = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };


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
        loadPublicTasks();
    }, [update, refresh]);
    const loadPublicTasks = async () => {
        try {
            const response = await axiosPrivate.get('/api/v1/public-tasks/my-tasks');
            if (response.data && response.data.length > 0) {
                setPublicTasks(response.data);
                setIsEmpty(false);
            } else {
                setIsEmpty(true);
            }

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
            publicTasks[index] = response.data;
            setPublicTasks([...publicTasks]);

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
                publicTasks.splice(index, 1);
                setPublicTasks([...publicTasks]);
            } else {
                return console.error("Something wrong")
            }

        } catch (err) {
            setRefresh(!refresh);
            console.error('Error:', err);
        }
    }

    return (
        <React.Fragment>
            <Typography variant="h4" color={theme.palette.primary.blue} sx={{textAlign: 'center'}} gutterBottom mt={1}>
                All Public Tasks
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
                    You dont have any public tasks yet. You can assign new task for your connected users by pressing
                    'New public task' button
                </Box>
            )}
            {!isEmpty && (
                <List disablePadding>
                    {publicTasks.map((item, index) => (
                        <div key={index}>
                            <Typography variant="body2" color={theme.palette.secondary.red}
                                        sx={{
                                            mt: 2,
                                            display: 'flex', justifyContent: 'flex-end',
                                        }} gutterBottom>
                                Created on: {formatDate(item.createdAt)}
                            </Typography>
                            <ListItem
                                onMouseEnter={() => setIsHovered(index)}
                                onMouseLeave={() => setIsHovered(null)}
                                onClick={() => openTask(index)}
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
                                    cursor: 'pointer'
                                }}
                            >
                                <Grid container>
                                    <Grid item xs={8}
                                          sx={{
                                              display: 'flex',
                                              justifyContent: 'center',
                                              alignItems: 'center',
                                          }}>
                                        <ListItemText
                                            primary={item.taskName}
                                            primaryTypographyProps={{
                                                sx: {
                                                    overflowWrap: 'break-word',
                                                    wordWrap: 'break-word',
                                                    hyphens: 'auto',
                                                    whiteSpace: 'pre-wrap',
                                                    textAlign: 'left',
                                                    fontWeight: 'bold',
                                                    fontSize: '1.2rem'
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={4}
                                          sx={{
                                              display: 'flex',
                                              justifyContent: 'right',
                                              alignItems: 'center',
                                          }}>
                                        <ListItemText
                                            primary={`Completed: ${item.assignedTasks.filter(task => task.complete).length} / ${item.assignedTasks.length}`}
                                            primaryTypographyProps={{
                                                sx: {
                                                    overflowWrap: 'break-word',
                                                    wordWrap: 'break-word',
                                                    hyphens: 'auto',
                                                    whiteSpace: 'pre-wrap',
                                                    textAlign: 'right',
                                                    fontWeight: 'bold',
                                                    fontSize: '1.2rem'
                                                }
                                            }}
                                        />
                                    </Grid>
                                    {openIndex === index && (
                                        <Grid container xs={12}
                                              sx={{
                                                  mt: 2,
                                                  display: 'flex',
                                                  justifyContent: 'right',
                                                  alignItems: 'center',
                                              }}>
                                            <Grid item xs={12}>
                                            <Divider
                                                sx={{
                                                    borderColor: 'lightgrey',
                                                    borderWidth: '1px',
                                                    width: '85%',
                                                    mx: 'auto',
                                                    borderRadius: '10px'
                                                }}
                                            />
                                            </Grid>
                                            {item.assignedTasks.map((task, index) => (
                                                <Grid container key={index} sx={{
                                                    mt: 1,
                                                    borderRadius: 1,
                                                    border: '1px solid #ccc',
                                                    backgroundColor: task.complete ? 'rgba(5,190,5,0.64)' : 'rgba(255,0,0,0.64)',
                                                }}>
                                                    <Grid item xs={12} md={6}
                                                        sx={{
                                                        display: 'flex',
                                                        justifyContent: 'left',
                                                        alignItems: 'center',
                                                    }}>
                                                        <Typography
                                                            sx={{
                                                                mt: 1,
                                                                ml: 3,
                                                                marginBottom: 1,
                                                                color: task.complete ? 'black' : 'white',
                                                            }}
                                                        >
                                                            {task.userEmail}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}
                                                          sx={{
                                                              display: 'flex',
                                                              justifyContent: {
                                                                  md: 'flex-end',
                                                                  xs: 'flex-start'
                                                              },
                                                              alignItems: 'center',
                                                          }}>
                                                        <Typography
                                                            sx={{
                                                                mt: 1,
                                                                mr: { xs: 0, md: 3 },
                                                                ml: { xs: 3, md: 0 },
                                                                marginBottom: 1,
                                                                color: task.complete ? 'black' : 'white',
                                                            }}
                                                        >
                                                            {task.complete ? `Completed ${formatTime(task.completedAt)}` : 'Not done yet'}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    )}



                                <Grid item xs={6} md={2} sx={{display: 'flex', alignItems: 'center'}}>

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
)
;
}
export default PublicTaskComp;
