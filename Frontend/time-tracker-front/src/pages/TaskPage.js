import * as React from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import Tasks from '../component/Tasks';
import Button from "@mui/material/Button";
import NewTask from "../component/New Task";
import {useState} from "react";
import {theme} from '../component/PageTemplate';
import PageTemplate from "../component/PageTemplate"


const StyledBox = styled(Box)(({theme}) => ({
    maxWidth: `calc(100% - 20px)`, // Adjusted width with a 10px gap from each side
    margin: '0 10px', // 10px gap on both left and right sides
}));


export default function TaskPage() {

    const [openNewTask, setOpenNewTask] = React.useState(false);
    const toggleNewTask = () => {
        setOpenNewTask(!openNewTask);
    };

    //This fkin function get fkin value from fkin child class and refresh fkin task list!
    const [update, setUpdate] = useState(true);
    const updateTasks = () => {
        setUpdate(!update);
    };

    return (
        <PageTemplate>
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
                top: "6px",
                left: "7px",
                "&:hover": {
                    bgcolor: theme.palette.primary.dark,
                },
            }} variant="contained" onClick={toggleNewTask} startIcon={<AddIcon/>}
            >
                New task
            </Button>
            {openNewTask && (
                <StyledBox sx={{mt: 4}}>
                    <NewTask update={updateTasks} taskWindow={toggleNewTask}/>
                </StyledBox>
            )}
            <Box sx={{ position: "relative", mt: 5 }}>
                <Tasks update={update}/>
            </Box>
        </PageTemplate>
    );
}