import React, {useState} from 'react'
import PageTemplate, {theme} from "../component/PageTemplate"
import {Button} from "@mui/material";
import Box from "@mui/material/Box";
import PublicTaskComp from "../component/PublicTaskComp";
import AddIcon from "@mui/icons-material/Add";
import NewPublicTask from "../component/NewPublicTask";


function PublicTasks() {


    const [openNewPublicTask, setOpenNewPublicTask] = React.useState(false);
    const toggleNewPublicTask = () => {
        setOpenNewPublicTask(!openNewPublicTask);
    };

    const [updatePublicTask, setUpdatePublicTask] = useState(true);
    const updatePublicTasks = () => {
        setUpdatePublicTask(!updatePublicTask);
    };

    const [updateFriends, setUpdateFriends] = useState(true);
    const updateFriendsList = () => {
        setUpdateFriends(!updateFriends);
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
                fontSize: "11pt",
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
            }} variant="contained" onClick={toggleNewPublicTask} startIcon={<AddIcon/>}
            >
                New Public task
            </Button>
            {openNewPublicTask && (
                <Box sx={{
                    mt: 4,
                    maxWidth: `calc(100% - 20px)`,
                    margin: '4 10px',
                }}>
                    <NewPublicTask update={updateFriendsList} taskWindow={toggleNewPublicTask}/>
                </Box>
            )}
            <Box sx={{position: "relative", mt: 5}}>
                <PublicTaskComp update={updateFriends}/>
            </Box>
        </PageTemplate>

    )
}

export default PublicTasks
