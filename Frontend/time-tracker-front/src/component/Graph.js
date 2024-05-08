import * as React from 'react';
import Box from '@mui/material/Box';
import {useEffect, useState} from "react";
import {axisClasses, BarChart} from "@mui/x-charts";
import {useTheme} from "@mui/material";



export default function Graph({getTask, startDate, endDate, createDate, completeDate}) {
    const theme = useTheme();

    const [taskData, setTaskData] = useState([]);
    const [xAxisData, setXAxisData] = useState([]);
    const graphData = [];

    function createGraphTable() {
        xAxisData.forEach(item => {
            const existingRecordIndex = graphData.findIndex(record => record.date === item);

            if (existingRecordIndex === -1) {
                graphData.push({
                    date: item,
                    duration: Number(0)
                });
            }
        })
    }

    function fillGraphTable() {
        taskData.forEach(item => {
            const formattedDate = new Date(item.startTime);
            const existingRecordIndex = graphData.findIndex(record => record.date === formattedDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }));

            if (existingRecordIndex !== -1) {
                graphData[existingRecordIndex].duration += item.duration / 1000;
            }
        });
    }


    useEffect(() => {
        // Check if getTask has changed before updating taskData
        if (JSON.stringify(getTask) !== JSON.stringify(taskData)) {
            setTaskData(getTask);
            let days;
            let beginOn;
            if (startDate < createDate) {
                if(endDate > completeDate)
                {
                    days = Math.floor((completeDate - createDate) / (1000 * 3600 * 24)) + 1;
                }
                else
                    days = Math.floor((endDate - createDate) / (1000 * 3600 * 24)) + 1;

                beginOn = createDate;
            } else {
                if(endDate > completeDate)
                {
                    days = Math.floor((completeDate - startDate) / (1000 * 3600 * 24)) + 1;
                }
                else
                    days = Math.floor((endDate - startDate) / (1000 * 3600 * 24)) + 1;

                beginOn = startDate;
            }

            const xAxisData = Array.from({ length: days }, (_, index) => {
                const currentDate = new Date(beginOn);
                currentDate.setDate(currentDate.getDate() + index);
                return currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
            });

            setXAxisData(xAxisData);
        }
    }, [getTask]);

        createGraphTable();
        fillGraphTable();

    const tooltipFormatter = (value) => {
        if (value > 3600) {
            const hours = Math.floor(value / 3600);
            const minutes = Math.floor((value % 3600) / 60);
            const seconds = Math.round(value % 60);
            return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''} ${seconds} second${seconds > 1 ? 's' : ''}`;
        } else if (value > 60) {
            const minutes = Math.floor(value / 60);
            const seconds = Math.round(value % 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ${seconds} second${seconds > 1 ? 's' : ''}`;
        } else {
            return `${Math.round(value)} second${value !== 1 ? 's' : ''}`;
        }
    };

    const yAxisFormatter = (value) => {
        if (value > 3600) {
            const hours = Math.floor(value / 3600);
            return `${hours} hr${hours > 1 ? 's' : ''}`;
        } else if (value > 60) {
            const minutes = Math.floor(value / 60);
            return `${minutes} min${minutes > 1 ? 's' : ''}`;
        } else if (value === 0) {
            return `0`;
        } else {
            return `${Math.round(value)} sec`;
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <BarChart
                height={300}
                margin={{
                    top: 16,
                    right: 20,
                    left: 70,
                    bottom: 30,
                }}
                dataset={graphData}
                xAxis={[
                    {
                        data: xAxisData,
                        scaleType: 'band',
                        min: 0,
                        max: xAxisData.length - 1,
                    },
                ]}

                yAxis={[
                    {
                        scaleType: 'linear',
                        valueFormatter: yAxisFormatter,
                    },
                ]}

                series={[
                    {
                        dataKey: 'duration',
                        label: 'Time spent',
                        valueFormatter: tooltipFormatter,
                    },
                ]}
                sx={{
                    [`.${axisClasses.root} line`]: { stroke: theme.palette.text.secondary },
                    [`.${axisClasses.root} text`]: { fill: theme.palette.text.secondary },
                    [`& .${axisClasses.left} .${axisClasses.label}`]: {
                        transform: 'translateX(-25px)',
                    },
                }}
            />
        </Box>
    );
}