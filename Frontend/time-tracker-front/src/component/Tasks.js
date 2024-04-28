import * as React from 'react';
import Title from './Title';
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import {createTheme} from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";

function formatMilliseconds(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(seconds / (3600 * 24));
    const remainingHours = Math.floor((seconds % (3600 * 24)) / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedDays = String(days);
    const formattedHours = String(remainingHours).padStart(2, '0');
    const formattedMinutes = String(remainingMinutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    if (milliseconds < 86400000) {
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}s`;
    } else {
        return `${formattedDays} Days ${formattedHours}:${formattedMinutes}:${formattedSeconds}s`;
    }
}

function formatDate(inputDate) {

    const date = new Date(inputDate);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${day}/${month}/${year}`;
}

const Tasks = ({update}) => {

    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate()
    const [isEmpty, setIsEmpty] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const theme = createTheme({
        palette: {
            primary: {
                main: "#06be06",
                dark: "#14ae17",
                blue: "#1976d2",
                darkblue: "#1664b0",
            },
            secondary: {
                main: "#ed4135",
                red: "#d23a2e",
            },
        },
    });

    const startButtonStyle = {
        minWidth: '7%',
        maxWidth: '10%',
        maxHeight: 40,
        marginRight: 5,
        borderRadius: 2,
        color: "white",
        textTransform: "none",
        fontSize: "13pt",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        position: "absolute",
        right: "10%",
        bottom: "15px",
        "&:hover": {
            bgcolor: theme.palette.primary.dark,
        }
    };

    const completeButtonStyle = {
        minWidth: '7%',
        maxWidth: '10%',
        maxHeight: 40,
        borderRadius: 2,
        bgcolor: theme.palette.primary.blue,
        color: "white",
        textTransform: "none",
        fontSize: "13pt",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        position: "absolute",
        right: "2%",
        bottom: "15px",
        "&:hover": {
            bgcolor: theme.palette.primary.darkblue,
        }
    };

    //any changes in "update" will trigger useEffect
    useEffect(() => {
        loadTasks();
    }, [update]);
    const loadTasks = async () => {
        const result = await fetch("http://localhost:9192/api/v1/tasks/my-tasks", {
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
                if (data && data.length > 0) {
                    setTasks(data);
                    setIsEmpty(false);
                } else {
                    setIsEmpty(true);
                }
            })
            .catch(error => console.error(error));
    }

    const startTimeCount = (id, e, index) => {
        if (e) {
            e.preventDefault();
        }
        fetch("http://localhost:9192/api/v1/tasks/my-tasks/startTask", {
            method: "PATCH",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(id)
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return console.error("Something wrong")
            }
        })
            .then(res => {
                tasks[index] = res;
                setTasks([...tasks]);
            })
            .catch(error => {
                console.error(error);
            });
    }
    const stopTimeCount = (id, e, index) => {
        if (e) {
            e.preventDefault();
        }
        fetch("http://localhost:9192/api/v1/tasks/my-tasks/stopTask", {
            method: "PATCH",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(id)
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return console.error("Something wrong")
            }
        })
            .then(res => {
                tasks[index] = res;
                setTasks([...tasks]);
            })
            .catch(error => {
                console.error(error);
            });
    }
    const completeTask = (id, e, index) => {
        if (e) {
            e.preventDefault();
        }
        fetch("http://localhost:9192/api/v1/tasks/my-tasks/completeTask", {
            method: "PATCH",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(id)
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return console.error("Something wrong")
            }
        })
            .then(res => {
                tasks[index] = res;
                setTasks([...tasks]);
            })
            .catch(error => {
                console.error(error);
            });
    }

    const deleteTask = (id, e, index) => {
        if (e) {
            e.preventDefault();
        }
        fetch("http://localhost:9192/api/v1/tasks/my-tasks/deleteTask", {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(id)
        }).then(response => {
            if (response.status === 204) {
                tasks.splice(index, 1);
                setTasks([...tasks]);
            } else {
                return console.error("Something wrong")
            }
        })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <React.Fragment>
            <Typography variant="h4" color={theme.palette.primary.blue} gutterBottom mt={1}>
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
                        <div key={item.id}>
                            <Typography variant="body2" color={theme.palette.secondary.red}
                                        sx={{
                                            mt: 2,
                                            ml: '85%'
                                        }} gutterBottom>
                                Created on: {formatDate(item.createdAt)}
                            </Typography>
                            <ListItem
                                onMouseEnter={() => setIsHovered(index)}
                                onMouseLeave={() => setIsHovered(null)}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: '#f2f2f2', // Change the background color on hover
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
                                <ListItemText primary={item.taskName} primaryTypographyProps={{
                                    sx: {
                                        overflowWrap: 'break-word',
                                        wordWrap: 'break-word',
                                        hyphens: 'auto',
                                        maxWidth: '75%'
                                    }
                                }}/>
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
                                        <RemoveCircleIcon style={{fontSize: '115%'}}/>
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
                                    <ListItemButton sx={{
                                        ...completeButtonStyle
                                    }} variant="outlined" onClick={(e) => completeTask(item.id, e, index)}
                                    >
                                        Complete
                                    </ListItemButton>
                                )}
                                {item.active && !item.complete && (
                                    <ListItemButton sx={{
                                        ...completeButtonStyle
                                    }} variant="outlined" disabled
                                    >
                                        Complete
                                    </ListItemButton>
                                )}
                                <ListItemText
                                    primary={!item.active && item.complete ? "COMPLETED!" : ""}
                                    primaryTypographyProps={{
                                        sx: {
                                            color: "white",
                                            textTransform: "none",
                                            fontSize: "17pt",
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
                                {!item.active && item.complete && <CheckCircleIcon sx={{
                                    position: "relative",
                                    right: "2%",
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}/>}
                            </ListItem>
                            {!item.active && (
                                <ListItemText primary={
                                    <>
                                        <Typography component="span">
                                            {"You've spent "}
                                        </Typography>
                                        <Typography component="span" sx={{color: "#fd5454", fontWeight: "bold"}}>
                                            {formatMilliseconds(item.spentTime)}
                                        </Typography>
                                        <Typography component="span">
                                            {" on this task."}
                                        </Typography>
                                    </>
                                } primaryTypographyProps={{
                                    sx: {
                                        position: "relative",
                                        marginBottom: 2,
                                        left: "6%"
                                    }
                                }}>
                                </ListItemText>
                            )}
                            {item.active && (
                                <ListItemText primary={`Task is in progress. Good luck!`} primaryTypographyProps={{
                                    sx: {
                                        position: "relative",
                                        marginBottom: 2,
                                        left: "6%"
                                    }
                                }}>
                                </ListItemText>
                            )}
                        </div>
                    ))}
                </List>
            )}
        </React.Fragment>
    );
}
export default Tasks;
