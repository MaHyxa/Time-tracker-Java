import * as React from 'react';
import {useEffect, useState} from "react";
import {theme} from './PageTemplate';
import Typography from "@mui/material/Typography";
import useAxiosPrivate from "../api/useAxiosPrivate";
import Button from "@mui/material/Button";
import UpdateIcon from '@mui/icons-material/Update';
import {CircularProgress} from "@mui/material";
import {toast} from "react-toastify";


export const formatTime = (milliseconds) => {
    // Convert milliseconds to seconds
    let totalSeconds = milliseconds / 1000;

    // Calculate days
    const days = Math.floor(totalSeconds / (3600 * 24));
    totalSeconds -= days * 3600 * 24;

    // Calculate hours
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds -= hours * 3600;

    // Calculate minutes
    const minutes = Math.floor(totalSeconds / 60);
    totalSeconds -= minutes * 60;

    // The remaining seconds
    const seconds = Math.floor(totalSeconds);

    return {days, hours, minutes, seconds};
};


export default function StatsPage() {

    const axiosPrivate = useAxiosPrivate();
    const [data, setData] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        loadStatsOnPageLoad();
    }, []);

    const loadStatsOnPageLoad = async () => {
        setLoading(true);
        try {
            const response = await axiosPrivate.get('/api/v1/tasks/userStatistics');
            if (response.data && response.data.totalUserTasks > 0) {
                setData(response.data || []);
                setIsEmpty(false);
            } else {
                setIsEmpty(true);
            }
        } catch (err) {
            const errorMessage = err.response?.data || "Connection to the servers failed. Please try again in a few moments.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const updateStatsOnButtonClick = async () => {
        setUpdating(true);
        try {
            const response = await axiosPrivate.get('/api/v1/tasks/updateUserStatistics');
            if (response.data && response.data.totalUserTasks > 0) {
                setData(response.data || []);
                setIsEmpty(false);
            } else {
                setIsEmpty(true);
            }
        } catch (err) {
            const errorMessage = err.response?.data || "Connection to the servers failed. Please try again in a few moments.";
            toast.error(errorMessage);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div>
            {isEmpty && (
                <Typography variant="h5"
                            sx={{
                                mt: 3,
                            }} gutterBottom>
                    Unfortunately You didn't create any task yet. Feel free to create a new task and start tracking your
                    progress with our service!
                </Typography>
            )}
            {!isEmpty && (
                <div>
                    <Typography variant="h5"
                                sx={{
                                    mt: 3,
                                    textAlign: 'center'
                                }} gutterBottom>
                        Here is some summary about your work:
                    </Typography>
                    <Typography variant="body1" sx={{mt: 2}} gutterBottom>
                        {data.totalUserTasks === 0 ? (
                            "You've not created any task yet."
                        ) : (
                            <>
                                You've created{' '}
                                <Typography
                                    variant="body1"
                                    component="span"
                                    sx={{
                                        color: theme.palette.primary.dark,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {data.totalUserTasks}
                                </Typography>{' '}
                                task{data.totalUserTasks > 1 ? 's' : ''} total.
                            </>
                        )}
                    </Typography>
                    <Typography variant="body1" sx={{mt: 3}} gutterBottom>
                        {data.completeUserTasks > 0 ? (
                            <>
                                <Typography variant="body1" component="span"
                                            sx={{color: theme.palette.primary.dark, fontWeight: "bold"}}>
                                    {data.completeUserTasks}
                                </Typography>{' '}
                                of them are successfully completed.
                            </>
                        ) : (
                            "No tasks have been completed successfully yet."
                        )}
                    </Typography>
                    <Typography variant="body1"
                                sx={{
                                    mt: 3,
                                }} gutterBottom>
                        Presently you are working on
                        {' '}
                        <Typography
                            variant="body1"
                            component="span"
                            sx={{
                                color: theme.palette.primary.dark,
                                fontWeight: "bold"
                            }}
                        >
                            {data.activeUserTasks}
                        </Typography>{' '} task.
                    </Typography>
                    <Typography variant="body1"
                                sx={{
                                    mt: 3,
                                }} gutterBottom>
                        The longest task you've been working on took
                        {' '}
                        <Typography
                            variant="body1"
                            component="span"
                            sx={{
                                color: theme.palette.primary.dark,
                                fontWeight: "bold"
                            }}
                        >
                            {formatTime(data.longestTask).days > 0 && `${formatTime(data.longestTask).days} ${formatTime(data.longestTask).days === 1 ? 'day' : 'days'}, `}
                            {formatTime(data.longestTask).hours > 0 && `${formatTime(data.longestTask).hours} ${formatTime(data.longestTask).hours === 1 ? 'hour' : 'hours'}, `}
                            {formatTime(data.longestTask).minutes > 0 && `${formatTime(data.longestTask).minutes} ${formatTime(data.longestTask).minutes === 1 ? 'minute' : 'minutes'} and `}
                            {formatTime(data.longestTask).seconds > 0 && `${formatTime(data.longestTask).seconds} ${formatTime(data.longestTask).seconds === 1 ? 'second' : 'seconds'}`}
                        </Typography>{'.'}
                    </Typography>
                    <Typography variant="body1" sx={{mt: 3}} gutterBottom>
                        Overall you've been working for{' '}
                        <Typography
                            variant="body1"
                            component="span"
                            sx={{color: theme.palette.primary.dark, fontWeight: "bold"}}
                        >
                            {formatTime(data.totalTimeSpent).days > 0 && `${formatTime(data.totalTimeSpent).days} ${formatTime(data.totalTimeSpent).days === 1 ? 'day' : 'days'}, `}
                            {formatTime(data.totalTimeSpent).hours > 0 && `${formatTime(data.totalTimeSpent).hours} ${formatTime(data.totalTimeSpent).hours === 1 ? 'hour' : 'hours'}, `}
                            {formatTime(data.totalTimeSpent).minutes > 0 && `${formatTime(data.totalTimeSpent).minutes} ${formatTime(data.totalTimeSpent).minutes === 1 ? 'minute' : 'minutes'} and `}
                            {formatTime(data.totalTimeSpent).seconds > 0 && `${formatTime(data.totalTimeSpent).seconds} ${formatTime(data.totalTimeSpent).seconds === 1 ? 'second' : 'seconds'}`}
                        </Typography>
                        .
                    </Typography>
                    <Button
                        onClick={updateStatsOnButtonClick}
                        sx={{ mt: 5, textAlign: 'center', fontWeight: 'bold', textDecoration: 'underline' }}
                        startIcon={<UpdateIcon />}
                        disabled={updating}
                    >
                        {updating ? <CircularProgress size={24} /> : "Update my stats"}
                    </Button>
                    <Typography variant="h4"
                                sx={{
                                    mt: 10,
                                    textAlign: 'center'
                                }} gutterBottom>
                        Thanks for using our service!
                    </Typography>
                </div>
            )}
        </div>
    );
}