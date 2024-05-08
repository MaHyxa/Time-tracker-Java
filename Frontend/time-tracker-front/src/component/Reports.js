import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import {useNavigate} from "react-router-dom";
import {Container} from "@mui/material";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/de';
import dayjs from "dayjs";
import {StaticDateRangePicker} from "@mui/x-date-pickers-pro";
import Button from "@mui/material/Button";
import Graph from "./Graph";
import {useEffect, useState} from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {theme, formatDate, formatMilliseconds, isTokenExpired} from './PageTemplate';
import PageTemplate from "./PageTemplate"


const shortcutsItems = [
    {label: 'Today', getValue: () => [dayjs(), dayjs()]},
    {
        label: 'This Week',
        getValue: () => {
            const today = dayjs();
            return [today.startOf('week'), today];
        },
    },
    {
        label: 'Last Week',
        getValue: () => {
            const today = dayjs();
            const prevWeek = today.subtract(7, 'day');
            return [prevWeek.startOf('week'), prevWeek.endOf('week')];
        },
    },
    {
        label: 'Last 7 Days',
        getValue: () => {
            const today = dayjs();
            return [today.subtract(7, 'day'), today];
        },
    },
    {
        label: 'Current Month',
        getValue: () => {
            const today = dayjs();
            return [today.startOf('month'), today];
        },
    },
    {
        label: 'Previous Month',
        getValue: () => {
            const today = dayjs();
            const endOfNextMonth = today.startOf('month').subtract(1, 'day');
            return [endOfNextMonth.startOf('month'), endOfNextMonth.endOf('month')];
        },
    },
];

export default function Reports() {

    const [tasks, setTasks] = useState([]);
    const [isEmpty, setIsEmpty] = useState(true);
    const [isSelected, setIsSelected] = useState(false);
    const navigate = useNavigate();
    const currentDay = dayjs().endOf('day');

    const [selectedDate, setSelectedDate] = React.useState([currentDay, currentDay]);

    const [openCalendar, setOpenCalendar] = React.useState(true);

    useEffect(() => {

    }, [isSelected]);

    const toggleCalendar = () => {
        setOpenCalendar(!openCalendar);
    };

    const handleDateChange = (date) => {
        if (date.some(d => d === null)) {
            setSelectedDate([currentDay, currentDay]);
        } else {
            const adjustedDate = date.map(d => dayjs(d).endOf('day'));
            setSelectedDate(adjustedDate);
        }
    }

    function selected() {
        const dayStart = selectedDate[0].date().toString().padStart(2, '0');
        const monthStart = (selectedDate[0].month() + 1).toString().padStart(2, '0');
        const dayEnd = selectedDate[1].date().toString().padStart(2, '0');
        const monthEnd = (selectedDate[1].month() + 1).toString().padStart(2, '0');
        return `${dayStart}/${monthStart} - ${dayEnd}/${monthEnd}`
    }


    const submitRequest = (e, startDate, endDate) => {
        e.preventDefault();
        if (isTokenExpired(localStorage.getItem('jwtToken'))) {
            localStorage.removeItem('jwtToken');
            navigate('/');
            return;
        }

        const data = {
            startDate: startDate.toDate(),
            endDate: endDate.toDate()
        }

        fetch("http://localhost:9192/api/v1/tasks/my-tasks/findByDates", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (response.ok) {
                    setIsSelected(true);
                    return response.json();
                } else {
                    return console.error("Something wrong")
                }
            })
            .then(response => {
                if (response && response.length > 0) {
                    setTasks(response);
                    setIsEmpty(false);
                } else {
                    setIsEmpty(true);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <PageTemplate>
            <Container maxWidth="xl" sx={{mt: 4, mb: 4}}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Button sx={{
                            height: 50,
                            borderRadius: 4,
                            textTransform: "none",
                            fontSize: "13pt",
                            display: "flex",
                            alignItems: "left",
                            justifyContent: "center",
                            fontWeight: "bold",
                            position: "relative",
                        }}
                                onClick={toggleCalendar}>
                            {`Currently selected date(s) ${selected()}`}
                        </Button>
                        {openCalendar && (
                            <div>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-GB">
                                    <StaticDateRangePicker
                                        displayWeekNumber
                                        showDaysOutsideCurrentMonth
                                        disableAutoMonthSwitching
                                        defaultValue={selectedDate}
                                        disableFuture
                                        onChange={handleDateChange}
                                        slotProps={{
                                            shortcuts: {
                                                items: shortcutsItems,
                                            },
                                            actionBar: {
                                                actions: [],
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                                <Button sx={{
                                    width: 140,
                                    height: 50,
                                    borderRadius: 4,
                                    bgcolor: theme.palette.primary.main,
                                    color: "white",
                                    textTransform: "none",
                                    fontSize: "13pt",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: "bold",
                                    position: "relative",
                                    left: "13%",
                                    "&:hover": {
                                        bgcolor: theme.palette.primary.dark,
                                    },
                                }} variant="contained" onClick={(e) => {
                                    submitRequest(e, selectedDate[0], selectedDate[1]);
                                    toggleCalendar();
                                }}
                                >
                                    Submit
                                </Button>
                            </div>
                        )}
                        {!isSelected && (
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
                                Please select desired period for report
                            </Box>
                        )}
                        {isEmpty && isSelected && (
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
                                You didn't perform any tasks in selected period.
                            </Box>
                        )}
                        {!isEmpty && isSelected && (
                            <div>
                                <Typography variant="h4" color={theme.palette.primary.blue} gutterBottom
                                            sx={{ textAlign: 'center' }}
                                            mt={1}>
                                    Performed Tasks
                                </Typography>
                                <List disablePadding>
                                    {tasks.map((item) => (
                                        <div key={item.task.id}>
                                            <Typography variant="body2"
                                                        color={theme.palette.secondary.red}
                                                        sx={{
                                                            mt: 2,
                                                            ml: '85%'
                                                        }} gutterBottom>
                                                Created on: {formatDate(item.task.createdAt)}
                                            </Typography>
                                            <ListItem
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
                                                    backgroundImage: item.task.complete ? `url(${process.env.PUBLIC_URL}/blue.jpg)` : 'none',
                                                    backgroundSize: 'cover',
                                                }}
                                            >
                                                <ListItemText primary={item.task.taskName}
                                                              primaryTypographyProps={{
                                                                  sx: {
                                                                      overflowWrap: 'break-word',
                                                                      wordWrap: 'break-word',
                                                                      hyphens: 'auto',
                                                                      maxWidth: item.task.complete ? `75%` : '100&',
                                                                  }
                                                              }}/>
                                                <ListItemText
                                                    primary={!item.task.active && item.task.complete ? "COMPLETED!" : ""}
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
                                                {!item.task.active && item.task.complete &&
                                                    <CheckCircleIcon sx={{
                                                        position: "relative",
                                                        right: "2%",
                                                        color: "white",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center"
                                                    }}/>}
                                            </ListItem>
                                            <Grid container spacing={1} mb={3}>
                                                <Grid item xs={6}>
                                                {!item.task.active && (
                                                    <ListItemText primary={
                                                        <>
                                                            <Typography component="span">
                                                                {"You've spent "}
                                                            </Typography>
                                                            <Typography component="span" sx={{
                                                                color: "#fd5454",
                                                                fontWeight: "bold"
                                                            }}>
                                                                {formatMilliseconds(item.task.spentTime)}
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
                                                {item.task.active && (
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
                                                    {!item.task.active && item.task.complete && (
                                                        <Typography component="span" variant="body2" color={theme.palette.primary.dark}
                                                                    sx={{
                                                                        position: "relative",
                                                                        mt: 5,
                                                                        left: "68%"
                                                                    }} >
                                                            Completed on: {formatDate(item.task.completedAt)}
                                                        </Typography>
                                                    )}
                                                </Grid>
                                            </Grid>
                                            {selectedDate[0] && selectedDate[1] && (
                                                <Graph
                                                    getTask={item.taskSessionList}
                                                    startDate={selectedDate[0].toDate()}
                                                    endDate={selectedDate[1].toDate()}
                                                    createDate={new dayjs(item.task.createdAt).endOf('day')}
                                                    completeDate={new dayjs(item.task.completedAt).endOf('day')}
                                                />
                                            )}
                                            <Box sx={{ height: 4, bgcolor: theme.palette.primary.blue }} />
                                        </div>
                                    ))}
                                </List>
                            </div>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </PageTemplate>
    );
}