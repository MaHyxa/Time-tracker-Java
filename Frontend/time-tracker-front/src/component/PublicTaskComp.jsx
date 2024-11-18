import * as React from 'react';
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";

import {theme, formatDate, formatTime} from './PageTemplate';
import Grid from "@mui/material/Grid";
import useAxiosPrivate from "../api/useAxiosPrivate";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Pagination} from "@mui/material";
import Button from "@mui/material/Button";
import {toast} from "react-toastify";


const PublicTaskComp = ({update}) => {

    const axiosPrivate = useAxiosPrivate();
    const [publicTasks, setPublicTasks] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [refresh, setRefresh] = useState(false);
    // const userEmail = getEmailFromToken();
    const [openIndex, setOpenIndex] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);


    const openTask = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleOpenDialog = () => {
        setOpenDialog(!openDialog);
    };

    const handleConfirm = (id, e, index) => {
        deletePublicTask(id, e, index);
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
                    Are you sure you want to delete this task? Doing so will also delete this task for assigned users.
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


    useEffect(() => {
        loadPublicTasks();
    }, [update, refresh]);

    const loadPublicTasks = async (page = currentPage) => {
        try {
            const response = await axiosPrivate.get('/api/v1/public-tasks/my-tasks', {
                params: {
                    page
                },
            });

            const publicTasksData = response.data?.content || [];

            setPublicTasks(publicTasksData);
            setIsEmpty(publicTasksData.length === 0);
            setCurrentPage(response.data?.number);
            setTotalPages(response.data?.totalPages);
        } catch (err) {
            setPublicTasks([]);
            const errorMessage = err.response?.data || "Connection to the servers failed. Please try again in a few moments.";
            toast.error(errorMessage);
        }
    };


    const deletePublicTask = async (id, e, index) => {
        if (e) {
            e.preventDefault();
        }
        try {
            const response = await axiosPrivate.delete('/api/v1/public-tasks/my-tasks/deletePublicTask', {
                data: id.toString()
            });
            if (response.status === 204) {
                setRefresh(!refresh);
                publicTasks.splice(index, 1);
                setPublicTasks([...publicTasks]);
            } else {
                toast.error("Connection to the servers failed. Please try again in a few moments.")
            }
        } catch (err) {
            const errorMessage = err.response?.data || "Connection to the servers failed. Please try again in a few moments.";
            toast.error(errorMessage);
        }
    }

    const handlePageChange = (event, page) => {
        setCurrentPage(page - 1);
        loadPublicTasks(page - 1);
    };

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
                <div>
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
                                        backgroundImage: item.assignedTasks.filter(task => task.taskStatus === 6).length === item.assignedTasks.length
                                            ? `url(${process.env.PUBLIC_URL}/blue.jpg)`
                                            : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {isHovered === index && (
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
                                                handleConfirm={(e) => handleConfirm(item.id, e, index)}
                                            />
                                        </IconButton>
                                    )}

                                    <Grid container onClick={() => openTask(index)}>
                                        <Grid item xs={12} sm={9}
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
                                                        textAlign: {
                                                            xs: 'center',
                                                            sm: 'left'
                                                        },
                                                        fontWeight: 'bold',
                                                        fontSize: '1.2rem'
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}
                                              sx={{
                                                  display: 'flex',
                                                  justifyContent: {
                                                      xs: 'center',
                                                      sm: 'right'
                                                  },
                                                  alignItems: 'center',
                                              }}>

                                            <ListItemText
                                                primary={`Completed: ${item.assignedTasks.filter(task => task.taskStatus === 6).length} / ${item.assignedTasks.length}`}
                                                primaryTypographyProps={{
                                                    sx: {
                                                        hyphens: 'auto',
                                                        whiteSpace: 'pre-wrap',
                                                        textAlign: {
                                                            xs: 'center',
                                                            sm: 'right'
                                                        },
                                                        fontWeight: 'bold',
                                                        fontSize: '1.2rem'
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        {openIndex === index && (
                                            <Grid container
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
                                                        backgroundColor:
                                                            task.taskStatus === 3 ? 'rgba(255,224,70,0.8)' :
                                                                task.taskStatus === 5 ? 'rgba(255,0,0,0.64)' :
                                                                    task.taskStatus === 6 ? '#1976d2' :
                                                                        'rgba(0,255,0,0.64)',
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
                                                                    color: task.taskStatus === 5 || task.taskStatus === 6 ? 'white' : 'black',
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
                                                                    mr: {xs: 0, md: 3},
                                                                    ml: {xs: 3, md: 0},
                                                                    marginBottom: 1,
                                                                    color: task.taskStatus === 5 || task.taskStatus === 6 ? 'white' : 'black',
                                                                }}
                                                            >
                                                                {task.taskStatus === 3 ? 'Waiting for acceptance' :
                                                                    task.taskStatus === 5 ? 'Rejected' :
                                                                        task.taskStatus === 6 ? `Completed ${formatTime(task.completedAt)}` :
                                                                            'In progress'}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        )}
                                    </Grid>
                                </ListItem>
                            </div>
                        ))}
                    </List>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Pagination
                            count={totalPages}
                            page={currentPage + 1}
                            onChange={handlePageChange}
                            variant="outlined"
                            color="primary"
                            showFirstButton
                            showLastButton
                        />
                    </Box>
                </div>
            )}
        </React.Fragment>
    )
        ;
}
export default PublicTaskComp;
