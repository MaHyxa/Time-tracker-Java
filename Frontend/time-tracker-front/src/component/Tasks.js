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


const Tasks = ({update}) => {

    const axiosPrivate = useAxiosPrivate();
    const [tasks, setTasks] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [refresh, setRefresh] = useState(false);


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
        loadTasks();
    }, [update, refresh]);
    const loadTasks = async () => {
        try {
            const response = await axiosPrivate.get('/api/v1/tasks/my-tasks');
            if (response.data && response.data.length > 0) {
                setTasks(response.data);
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
            tasks[index] = response.data;
            setTasks([...tasks]);

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
            tasks[index] = response.data;
            setTasks([...tasks]);

        } catch (err) {
            console.error('Error:', err);
        }
    }
    const completeTask = async (id, e, index) => {
        if (e) {
            e.preventDefault();
        }
        try {
            const response = await axiosPrivate.patch('/api/v1/tasks/my-tasks/completeTask', id.toString());
            tasks[index] = response.data;
            setTasks([...tasks]);

        } catch (err) {
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
                tasks.splice(index, 1);
                setTasks([...tasks]);
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
                All Tasks
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
                    You dont have any tasks yet. You can create a new one by pressing 'New Task' button
                </Box>
            )}
            {!isEmpty && (
                <List disablePadding>
                    {tasks.map((item, index) => (
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
                                            primary={item.taskName}
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
                                        {isHovered === index && (
                                            <IconButton
                                                sx={{
                                                    position: 'absolute',
                                                    top: -20,
                                                    right: -20,
                                                    color: 'red',
                                                }}
                                                onClick={(e) => deleteTask(item.id, e, index)}
                                            >
                                                <RemoveCircleIcon style={{ fontSize: '115%' }} />
                                            </IconButton>
                                        )}

                                        {item.spentTime === 0 && !item.active && !item.complete && (
                                            <ListItemButton
                                                sx={{
                                                    ...startButtonStyle,
                                                    bgcolor: theme.palette.primary.main,
                                                }}
                                                variant="contained"
                                                onClick={(e) => startTimeCount(item.id, e, index)}
                                            >
                                                Start
                                            </ListItemButton>
                                        )}

                                        {item.spentTime > 0 && !item.active && !item.complete && (
                                            <ListItemButton
                                                sx={{
                                                    ...startButtonStyle,
                                                    bgcolor: theme.palette.primary.main,
                                                }}
                                                variant="contained"
                                                onClick={(e) => startTimeCount(item.id, e, index)}
                                            >
                                                Continue
                                            </ListItemButton>
                                        )}

                                        {item.active && !item.complete && (
                                            <ListItemButton
                                                sx={{
                                                    ...startButtonStyle,
                                                    bgcolor: theme.palette.secondary.main,
                                                    "&:hover": {
                                                        bgcolor: theme.palette.secondary.red,
                                                    },
                                                }}
                                                variant="contained"
                                                onClick={(e) => stopTimeCount(item.id, e, index)}
                                            >
                                                Stop
                                            </ListItemButton>
                                        )}

                                        {!item.active && !item.complete && (
                                            <ListItemButton
                                                sx={{
                                                    ...completeButtonStyle,
                                                }}
                                                variant="outlined"
                                                onClick={(e) => completeTask(item.id, e, index)}
                                            >
                                                Complete
                                            </ListItemButton>
                                        )}

                                        {item.active && !item.complete && (
                                            <ListItemButton
                                                sx={{
                                                    ...completeButtonStyle,
                                                }}
                                                variant="outlined"
                                                disabled
                                            >
                                                Complete
                                            </ListItemButton>
                                        )}

                                        <ListItemText
                                            primary={!item.active && item.complete ? "COMPLETED!" : ""}
                                            primaryTypographyProps={{
                                                sx: {
                                                    color: "black",
                                                    textTransform: "none",
                                                    fontSize: {
                                                        xs: '12px',  // 0px to 479px screen width
                                                        sm: '16px',  // 480px to 991px screen width
                                                        md: '18px',  // 992px and above
                                                    },
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontWeight: "bold",
                                                    position: "absolute",
                                                    right: "8%",
                                                    top: "50%",
                                                    transform: "translate(13%, -50%)"
                                                }
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <Grid container spacing={1} mb={3}>
                                <Grid item xs={6}>
                                    {!item.active && (
                                        <ListItemText primary={
                                            <>
                                                <Typography component="span">
                                                    {"You've spent "}
                                                </Typography>
                                                <Typography component="span" sx={{
                                                    color: "#fd5454",
                                                    fontWeight: "bold"
                                                }}>
                                                    {formatMilliseconds(item.spentTime)}
                                                </Typography>
                                                <Typography component="span">
                                                    {" on this task."}
                                                </Typography>
                                            </>
                                        } primaryTypographyProps={{
                                            sx: {
                                                position: "relative",
                                                mt: 1,
                                                left: "6%"
                                            }
                                        }}>
                                        </ListItemText>
                                    )}
                                    {item.active && (
                                        <ListItemText
                                            primary={`Task is in progress. Good luck!`}
                                            primaryTypographyProps={{
                                                sx: {
                                                    position: "relative",
                                                    mt: 1,
                                                    left: "6%"
                                                }
                                            }}>
                                        </ListItemText>
                                    )}
                                </Grid>
                                <Grid item xs={6}>
                                    {!item.active && item.complete && (
                                        <Typography component="span" variant="body2" color={theme.palette.primary.dark}
                                                    sx={{
                                                        display: 'flex', justifyContent: 'flex-end',
                                                    }}>
                                            Completed on: {formatDate(item.completedAt)}
                                        </Typography>
                                    )}
                                </Grid>
                            </Grid>
                        </div>
                    ))}
                </List>
            )}
        </React.Fragment>
    );
}
export default Tasks;
