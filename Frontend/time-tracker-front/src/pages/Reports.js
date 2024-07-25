import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import {Chip, Container} from "@mui/material";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/de';
import dayjs from "dayjs";
import {StaticDateRangePicker} from "@mui/x-date-pickers-pro";
import Button from "@mui/material/Button";
import Graph from "../component/Graph";
import {useEffect, useState} from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import {theme, formatDate, formatMilliseconds} from '../component/PageTemplate';
import PageTemplate from "../component/PageTemplate"
import Divider from "@mui/material/Divider";
import useAxiosPrivate from "../api/useAxiosPrivate";


function CustomRangeShortcuts(props) {
    const { items, onChange, isValid, changeImportance = 'accept' } = props;

    if (items == null || items.length === 0) {
        return null;
    }

    const resolvedItems = items.map((item) => {
        const newValue = item.getValue({ isValid });

        return {
            label: item.label,
            onClick: () => {
                onChange(newValue, changeImportance, item);
            },
            disabled: !isValid(newValue),
        };
    });

    return (
        <Box
            sx={{
                mt: 2,
                gridRow: 1,
                gridColumn: 2,
                display: 'grid', // Set display to grid
                gridTemplateColumns: 'repeat(2, 1fr)', // Maximum 2 columns
                width: 325,
            }}
        >
            <List
                dense
                sx={{
                    display: 'contents', // Ensures ListItems follow the grid layout
                }}
            >
                {resolvedItems.map((item) => (
                    <ListItem
                        key={item.label}
                        sx={{
                            display: 'flex', // Ensure each ListItem uses flex layout
                            justifyContent: 'left', // Center the Chip in each ListItem
                        }}
                    >
                        <Chip {...item} />
                    </ListItem>
                ))}
            </List>
            <Divider sx={{ gridColumn: 'span 2' }} /> {/* Divider spans 2 columns */}
        </Box>

    );
}

const shortcutsItems = [
    {label: 'Today', getValue: () => [dayjs(), dayjs()]},
    {
        label: 'Last 7 Days',
        getValue: () => {
            const today = dayjs();
            return [today.subtract(7, 'day'), today];
        },
    },
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
    const currentDay = dayjs().endOf('day');
    const axiosPrivate = useAxiosPrivate();

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


    const submitRequest = async (e, startDate, endDate) => {
        e.preventDefault();

        try {
            const response = await axiosPrivate.post('/api/v1/tasks/my-tasks/findByDates',
                {
                    startDate: startDate.toDate(),
                    endDate: endDate.toDate()
                });
            if (response.data && response.data.length > 0) {
                setTasks(response.data);
                setIsEmpty(false);
            } else {
                setIsEmpty(true);
            }
            setIsSelected(true);

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <PageTemplate>
            <Container maxWidth="xl" sx={{mt: 4, mb: 4}}>
                <Grid container spacing={3}>
                    <Grid item xs={12}
                          sx={{
                              padding: '5px !important',
                          }}
                    >
                        <Typography sx={{
                            fontSize: "13pt",
                            display: "flex",
                            alignItems: "left",
                            justifyContent: "center",
                            fontWeight: "bold",
                            position: "relative",
                            color: theme.palette.primary.blue,
                        }}>
                            Currently selected date(s) {selected()}
                        </Typography>
                        <Button sx={{
                            height: 45,
                            borderRadius: 4,
                            textTransform: "none",
                            fontSize: "13pt",
                            display: "flex",
                            alignItems: "left",
                            justifyContent: "center",
                            position: "relative",
                            color: "black",
                            bgcolor: '#cedffd',
                        }}
                                onClick={toggleCalendar}>
                            {openCalendar ? 'Hide Calendar' : 'Open Calendar'}
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
                                        slots={{
                                            shortcuts: CustomRangeShortcuts,
                                        }}
                                        slotProps={{
                                            shortcuts: {
                                                items: shortcutsItems,
                                            },
                                            toolbar: {
                                                hidden: true,
                                            },
                                            actionBar: {
                                                actions: [],
                                            },
                                        }}
                                        // sx={{
                                        //     '& .MuiDayCalendar-root': {
                                        //         maxHeight: 265,
                                        //     },
                                        // }}
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
                                    left: "7%",
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
                                                            display: 'flex', justifyContent: 'flex-end',
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
                                            </ListItem>
                                            <Grid container spacing={1} mb={3}>
                                                <Grid item xs={12} sm={6}>
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
                                                <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                                                    {!item.task.active && item.task.complete && (
                                                        <Typography component="span" variant="body2" color={theme.palette.primary.dark}>
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