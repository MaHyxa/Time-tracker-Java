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
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tab, Tabs} from "@mui/material";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";


const Tasks = ({update}) => {

    const axiosPrivate = useAxiosPrivate();
    const [tasks, setTasks] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);

    const privateTasks = Array.isArray(tasks)
        ? tasks.map((task, index) => ({task, index})).filter(({task}) => task.taskType === 1)
        : [];
    const assignedTasks = Array.isArray(tasks)
        ? tasks.map((task, index) => ({task, index})).filter(({task}) => task.taskType !== 1)
        : [];
    const [openDialog, setOpenDialog] = useState(false);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleOpenDialog = () => {
        setOpenDialog(!openDialog);
    };

    const handleConfirmDeletion = (id, e, index) => {
        deleteTask(id, e, index);
        setOpenDialog(false);
    };

    const handleConfirmRejection = (id, e, index) => {
        rejectTask(id, e, index);
        setOpenDialog(false);
    };

    const DeleteConfirmationDialog = ({openDialog, handleClose, handleConfirm}) => (
        <Dialog
            open={openDialog}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete this task? Once deleted, it cannot be restored.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleConfirm} color="primary">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );

    const RejectConfirmationDialog = ({openDialog, handleClose, handleConfirm}) => (
        <Dialog
            open={openDialog}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Confirm Rejection"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to reject current assigned task?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleConfirm} color="primary">
                    Reject
                </Button>
            </DialogActions>
        </Dialog>
    );


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

    //any changes in "update" will trigger useEffect
    useEffect(() => {
        loadTasks();
    }, [update, refresh]);
    const loadTasks = async () => {
        try {
            const response = await axiosPrivate.get('/api/v1/tasks/my-tasks');
            if (response.data && response.data.length > 0) {
                setTasks(response.data || []);
                setIsEmpty(false);
            } else {
                setIsEmpty(true);
            }

        } catch (err) {
            console.error('Error:', err);
            setTasks([]);
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

    const acceptTask = async (id, e, index) => {
        if (e) {
            e.preventDefault();
        }
        try {
            const response = await axiosPrivate.patch('/api/v1/tasks/my-tasks/acceptTask', id.toString());
            tasks[index] = response.data;
            setTasks([...tasks]);

        } catch (err) {
            console.error('Error:', err);
        }
    }

    const rejectTask = async (id, e, index) => {
        if (e) {
            e.preventDefault();
        }
        try {
            const response = await axiosPrivate.patch('/api/v1/tasks/my-tasks/rejectTask', id.toString());
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
            <Tabs value={selectedTab} onChange={handleTabChange} centered>
                <Tab label="Personal Tasks"/>
                <Tab label="Assigned Tasks"/>
            </Tabs>
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
                    You dont have any tasks yet. You can create a new one by pressing 'New Task' button.
                </Box>
            )}

            {/* Private list */}

            {!isEmpty && selectedTab === 0 && (
                <div>
                    {privateTasks.length === 0 && (
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
                            You dont have any assigned task yet. A new task will appear once one of your connected users
                            assigns it to you.
                        </Box>
                    )
                    }
                    {privateTasks.length > 0 && (
                        <List disablePadding>
                            {privateTasks.map((item) => (
                                <div key={item.index}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            mt: 1,
                                            display: 'flex',
                                            justifyContent: {
                                                xs: 'center',
                                                sm: 'flex-end'
                                            },
                                        }}
                                        gutterBottom
                                    >
                                        <Typography component="span" sx={{color: 'darkcyan'}}>
                                            Created on:
                                        </Typography>
                                        <Typography component="span" sx={{
                                            color: theme.palette.secondary.red,
                                            ml: 1,
                                            fontWeight: "bold"
                                        }}>
                                            {formatDate(item.task.createdAt)}
                                        </Typography>
                                    </Typography>
                                    <ListItem
                                        onMouseEnter={() => setIsHovered(item.index)}
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
                                            backgroundImage: item.task.taskStatus === 6 ? `url(${process.env.PUBLIC_URL}/blue.jpg)` : 'none',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat',
                                        }}
                                    >

                                        <Grid container spacing={1}>
                                            <Grid item xs={12} sm={9} md={9}
                                                  sx={{
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                      justifyContent: 'flex-end'
                                                  }}>
                                                <ListItemText
                                                    primary={item.task.taskName}
                                                    primaryTypographyProps={{
                                                        sx: {
                                                            overflowWrap: 'break-word',
                                                            wordWrap: 'break-word',
                                                            hyphens: 'auto',
                                                            maxWidth: '100%',
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

                                                    {isHovered === item.index && (
                                                        <IconButton
                                                            sx={{
                                                                position: 'absolute',
                                                                top: -20,
                                                                right: -20,
                                                                color: 'red',
                                                            }}
                                                            onClick={handleOpenDialog}
                                                        >
                                                            <RemoveCircleIcon style={{fontSize: '115%'}}/>
                                                            <DeleteConfirmationDialog
                                                                openDialog={openDialog}
                                                                handleClose={handleOpenDialog}
                                                                handleConfirm={(e) => handleConfirmDeletion(item.task.id, e, item.index)}
                                                            />

                                                        </IconButton>
                                                    )}

                                                    <Grid item sx={{display: 'flex', alignItems: 'center'}}>
                                                        {item.task.spentTime === 0 && item.task.taskStatus !== 1 && item.task.taskStatus !== 6 && (
                                                            <ListItemButton
                                                                sx={{
                                                                    ...startButtonStyle,
                                                                    bgcolor: theme.palette.primary.main,
                                                                }}
                                                                variant="contained"
                                                                onClick={(e) => startTimeCount(item.task.id, e, item.index)}
                                                            >
                                                                Start
                                                            </ListItemButton>
                                                        )}

                                                        {item.task.spentTime > 0 && item.task.taskStatus !== 1 && item.task.taskStatus !== 6 && (
                                                            <ListItemButton
                                                                sx={{
                                                                    ...startButtonStyle,
                                                                    bgcolor: theme.palette.primary.main,
                                                                }}
                                                                variant="contained"
                                                                onClick={(e) => startTimeCount(item.task.id, e, item.index)}
                                                            >
                                                                Continue
                                                            </ListItemButton>
                                                        )}

                                                        {item.task.taskStatus === 1 && item.task.taskStatus !== 6 && (
                                                            <ListItemButton
                                                                sx={{
                                                                    ...startButtonStyle,
                                                                    bgcolor: theme.palette.secondary.main,
                                                                    "&:hover": {
                                                                        bgcolor: theme.palette.secondary.red,
                                                                    },
                                                                }}
                                                                variant="contained"
                                                                onClick={(e) => stopTimeCount(item.task.id, e, item.index)}
                                                            >
                                                                Stop
                                                            </ListItemButton>
                                                        )}
                                                    </Grid>
                                                    <Grid item sx={{display: 'flex', alignItems: 'center'}}>
                                                        {item.task.taskStatus !== 1 && item.task.taskStatus !== 6 && (
                                                            <ListItemButton
                                                                sx={{
                                                                    ...completeButtonStyle,
                                                                }}
                                                                variant="outlined"
                                                                onClick={(e) => completeTask(item.task.id, e, item.index)}
                                                            >
                                                                Complete
                                                            </ListItemButton>
                                                        )}

                                                        {item.task.taskStatus === 1 && item.task.taskStatus !== 6 && (
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
                                                            primary={item.task.taskStatus === 6 ? "COMPLETED!" : ""}
                                                            primaryTypographyProps={{
                                                                sx: {
                                                                    color: "black",
                                                                    textTransform: "none",
                                                                    fontSize: {
                                                                        xs: '14px',  // 0px to 479px screen width
                                                                        sm: '16px',  // 480px to 991px screen width
                                                                        md: '18px',  // 992px and above
                                                                    },
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    fontWeight: "bold",
                                                                    [theme.breakpoints.up('sm')]: {
                                                                        position: "absolute",
                                                                        right: "8%",
                                                                        top: "50%",
                                                                        transform: "translate(13%, -50%)"
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                    <Grid container spacing={1}
                                          sx={{mb: 1, justifyContent: {xs: 'center', sm: 'flex-end'}}}>
                                        <Grid item xs={12} sm={6} sx={{
                                            display: 'flex',
                                            justifyContent: {xs: 'center', sm: 'flex-start'},
                                            textAlign: {xs: 'center', sm: 'left'}
                                        }}>
                                            {item.task.taskStatus !== 1 ? (
                                                <ListItemText primary={
                                                    <>
                                                        <Typography component="span">{"You've spent "}</Typography>
                                                        <Typography component="span"
                                                                    sx={{color: "#fd5454", fontWeight: "bold"}}>
                                                            {formatMilliseconds(item.task.spentTime)}
                                                        </Typography>
                                                        <Typography component="span">{" on this task."}</Typography>
                                                    </>
                                                }/>
                                            ) : (
                                                <ListItemText primary={`Task is in progress. Good luck!`}/>
                                            )}
                                        </Grid>

                                        <Grid item xs={12} sm={6} sx={{
                                            display: 'flex',
                                            justifyContent: {xs: 'center', sm: 'flex-end'},
                                            textAlign: {xs: 'center', sm: 'right'},
                                            mt: {sm: 0.5},
                                        }}>
                                            {item.task.taskStatus === 6 && (
                                                <Typography variant="body2" gutterBottom>
                                                    <Typography component="span"
                                                                sx={{color: theme.palette.primary.dark}}>
                                                        Completed on:
                                                    </Typography>
                                                    <Typography component="span" sx={{
                                                        color: theme.palette.secondary.red,
                                                        ml: 1,
                                                        fontWeight: "bold"
                                                    }}>
                                                        {formatDate(item.task.completedAt)}
                                                    </Typography>
                                                </Typography>
                                            )}
                                        </Grid>
                                    </Grid>

                                    <Divider sx={{
                                        mb: 2,
                                        width: '95%',
                                        mx: 'auto',
                                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                                        borderRadius: '4px'
                                    }}/>

                                </div>
                            ))}
                        </List>
                    )}
                </div>
            )}

            {/* Assigned list */}

            {!isEmpty && selectedTab === 1 && (
                <div>
                    {assignedTasks.length === 0 && (
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
                            You dont have any assigned task yet. A new task will appear once one of your connected users
                            assigns it to you.
                        </Box>
                    )
                    }
                    {assignedTasks.length > 0 && (
                        <List sx={{
                            padding: '10px',
                        }}>
                            {assignedTasks.map((item) => (
                                <div key={item.index}>
                                    <Grid container>
                                        <Grid item xs={12} sm={6}>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    mt: 1,
                                                    display: 'flex',
                                                    justifyContent: {
                                                        xs: 'center',
                                                        sm: 'flex-start'
                                                    },
                                                }}
                                                gutterBottom
                                            >
                                                <Typography component="span" sx={{color: 'darkcyan'}}>
                                                    Assigned by:
                                                </Typography>
                                                <Typography component="span"
                                                            sx={{
                                                                color: theme.palette.secondary.red,
                                                                ml: 1,
                                                                fontWeight: "bold"
                                                            }}>
                                                    {item.task.createdBy}
                                                </Typography>
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    mt: 1,
                                                    display: 'flex',
                                                    justifyContent: {
                                                        xs: 'center',
                                                        sm: 'flex-end'
                                                    },
                                                }}
                                                gutterBottom
                                            >
                                                <Typography component="span" sx={{color: 'darkcyan'}}>
                                                    Created on:
                                                </Typography>
                                                <Typography component="span"
                                                            sx={{
                                                                color: theme.palette.secondary.red,
                                                                ml: 1,
                                                                fontWeight: "bold"
                                                            }}>
                                                    {formatDate(item.task.createdAt)}
                                                </Typography>
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    <ListItem
                                        onMouseEnter={() => setIsHovered(item.index)}
                                        onMouseLeave={() => setIsHovered(null)}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: item.task.taskStatus === 3 ? 'rgba(225,219,0,0.3)' : '#f2f2f2',
                                            },
                                            py: 1,
                                            minHeight: 70,
                                            color: '#000000',
                                            borderRadius: 1,
                                            position: 'relative',
                                            border: '1px solid #ccc',
                                            backgroundColor: item.task.taskStatus === 3 ? 'rgba(255,249,0,0.3)' : 'none',
                                            backgroundImage: item.task.taskStatus === 6 ? `url(${process.env.PUBLIC_URL}/blue.jpg)` : 'none',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat',
                                        }}
                                    >

                                        <Grid container spacing={1}>
                                            <Grid item xs={12} sm={9} md={9}
                                                  sx={{
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                      justifyContent: 'flex-end'
                                                  }}>
                                                <ListItemText
                                                    primary={item.task.taskName}
                                                    primaryTypographyProps={{
                                                        sx: {
                                                            overflowWrap: 'break-word',
                                                            wordWrap: 'break-word',
                                                            hyphens: 'auto',
                                                            maxWidth: '100%',
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


                                            {item.task.taskStatus === 3 && (
                                                <Grid item xs={12} sm={3} md={3}>
                                                    <Grid container spacing={{ xs: 1, sm: 2 }} sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: {
                                                            xs: 'center',
                                                            sm: 'flex-end'
                                                        }
                                                    }}>
                                                        <Grid item
                                                              sx={{display: 'flex', alignItems: 'center'}}>
                                                            <ListItemButton
                                                                sx={{
                                                                    ...startButtonStyle,
                                                                    bgcolor: theme.palette.primary.main,
                                                                }}
                                                                variant="contained"
                                                                onClick={(e) => acceptTask(item.task.id, e, item.index)}
                                                            >
                                                                Accept
                                                            </ListItemButton>
                                                        </Grid>
                                                        <Grid item sx={{display: 'flex', alignItems: 'center'}}>
                                                            <ListItemButton
                                                                sx={{
                                                                    ...completeButtonStyle,
                                                                    bgcolor: "#ec1212",
                                                                    "&:hover": {
                                                                        bgcolor: "#d30000",
                                                                    }
                                                                }}
                                                                variant="outlined"
                                                                onClick={handleOpenDialog}
                                                            >
                                                                Reject
                                                                {isHovered === item.index && (
                                                                    <RejectConfirmationDialog
                                                                        openDialog={openDialog}
                                                                        handleClose={handleOpenDialog}
                                                                        handleConfirm={(e) => handleConfirmRejection(item.task.id, e, item.index)}
                                                                    />
                                                                )}
                                                            </ListItemButton>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            )}

                                            {item.task.taskStatus !== 3 && (
                                                <Grid item xs={12} sm={3} md={3}>
                                                    <Grid container spacing={{ xs: 1, sm: 2 }} sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: {
                                                            xs: 'center',
                                                            sm: 'flex-end'
                                                        }
                                                    }}>

                                                        {isHovered === item.index && (
                                                            <IconButton
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: -20,
                                                                    right: -20,
                                                                    color: 'red',
                                                                }}
                                                                onClick={handleOpenDialog}
                                                            >
                                                                <RemoveCircleIcon style={{fontSize: '115%'}}/>
                                                                <RejectConfirmationDialog
                                                                    openDialog={openDialog}
                                                                    handleClose={handleOpenDialog}
                                                                    handleConfirm={(e) => handleConfirmRejection(item.task.id, e, item.index)}
                                                                />

                                                            </IconButton>
                                                        )}

                                                        <Grid item sx={{display: 'flex', alignItems: 'center'}}>
                                                            {item.task.spentTime === 0 && item.task.taskStatus !== 1 && item.task.taskStatus !== 6 && (
                                                                <ListItemButton
                                                                    sx={{
                                                                        ...startButtonStyle,
                                                                        bgcolor: theme.palette.primary.main,
                                                                    }}
                                                                    variant="contained"
                                                                    onClick={(e) => startTimeCount(item.task.id, e, item.index)}
                                                                >
                                                                    Start
                                                                </ListItemButton>
                                                            )}

                                                            {item.task.spentTime > 0 && item.task.taskStatus !== 1 && item.task.taskStatus !== 6 && (
                                                                <ListItemButton
                                                                    sx={{
                                                                        ...startButtonStyle,
                                                                        bgcolor: theme.palette.primary.main,
                                                                    }}
                                                                    variant="contained"
                                                                    onClick={(e) => startTimeCount(item.task.id, e, item.index)}
                                                                >
                                                                    Continue
                                                                </ListItemButton>
                                                            )}

                                                            {item.task.taskStatus === 1 && item.task.taskStatus !== 6 && (
                                                                <ListItemButton
                                                                    sx={{
                                                                        ...startButtonStyle,
                                                                        bgcolor: theme.palette.secondary.main,
                                                                        "&:hover": {
                                                                            bgcolor: theme.palette.secondary.red,
                                                                        },
                                                                    }}
                                                                    variant="contained"
                                                                    onClick={(e) => stopTimeCount(item.task.id, e, item.index)}
                                                                >
                                                                    Stop
                                                                </ListItemButton>
                                                            )}
                                                        </Grid>
                                                        <Grid item sx={{display: 'flex', alignItems: 'center'}}>
                                                            {item.task.taskStatus !== 1 && item.task.taskStatus !== 6 && (
                                                                <ListItemButton
                                                                    sx={{
                                                                        ...completeButtonStyle,
                                                                    }}
                                                                    variant="outlined"
                                                                    onClick={(e) => completeTask(item.task.id, e, item.index)}
                                                                >
                                                                    Complete
                                                                </ListItemButton>
                                                            )}

                                                            {item.task.taskStatus === 1 && item.task.taskStatus !== 6 && (
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
                                                                primary={item.task.taskStatus === 6 ? "COMPLETED!" : ""}
                                                                primaryTypographyProps={{
                                                                    sx: {
                                                                        color: "black",
                                                                        textTransform: "none",
                                                                        fontSize: {
                                                                            xs: '14px',  // 0px to 479px screen width
                                                                            sm: '16px',  // 480px to 991px screen width
                                                                            md: '18px',  // 992px and above
                                                                        },
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "center",
                                                                        fontWeight: "bold",
                                                                        [theme.breakpoints.up('sm')]: {
                                                                            position: "absolute",
                                                                            right: "8%",
                                                                            top: "50%",
                                                                            transform: "translate(13%, -50%)"
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </ListItem>

                                    {item.task.taskStatus !== 3 && (
                                        <Grid container spacing={1}
                                              sx={{mb: 1, justifyContent: {xs: 'center', sm: 'flex-end'}}}>
                                            <Grid item xs={12} sm={6} sx={{
                                                display: 'flex',
                                                justifyContent: {xs: 'center', sm: 'flex-start'},
                                                textAlign: {xs: 'center', sm: 'left'}
                                            }}>
                                                {item.task.taskStatus !== 1 ? (
                                                    <ListItemText primary={
                                                        <>
                                                            <Typography component="span">{"You've spent "}</Typography>
                                                            <Typography component="span"
                                                                        sx={{color: "#fd5454", fontWeight: "bold"}}>
                                                                {formatMilliseconds(item.task.spentTime)}
                                                            </Typography>
                                                            <Typography component="span">{" on this task."}</Typography>
                                                        </>
                                                    }/>
                                                ) : (
                                                    <ListItemText primary={`Task is in progress. Good luck!`}/>
                                                )}
                                            </Grid>

                                            <Grid item xs={12} sm={6} sx={{
                                                display: 'flex',
                                                justifyContent: {xs: 'center', sm: 'flex-end'},
                                                textAlign: {xs: 'center', sm: 'right'},
                                                mt: {sm: 0.5},
                                            }}>
                                                {item.task.taskStatus === 6 && (
                                                    <Typography variant="body2" gutterBottom>
                                                        <Typography component="span"
                                                                    sx={{color: theme.palette.primary.dark}}>
                                                            Completed on:
                                                        </Typography>
                                                        <Typography component="span" sx={{
                                                            color: theme.palette.secondary.red,
                                                            ml: 1,
                                                            fontWeight: "bold"
                                                        }}>
                                                            {formatDate(item.task.completedAt)}
                                                        </Typography>
                                                    </Typography>
                                                )}
                                            </Grid>
                                        </Grid>
                                    )}

                                    <Divider sx={{
                                        mb: 2,
                                        width: '95%',
                                        mx: 'auto',
                                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                                        borderRadius: '4px'
                                    }}/>

                                </div>
                            ))}
                        </List>
                    )}
                </div>
            )}
        </React.Fragment>
    );
}
export default Tasks;
