import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Divider from "@mui/material/Divider";
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import {Tooltip} from "@mui/material";

export const mainListItems = ({navigate}) => {
    const userInfo = () => {
        navigate('/my-info');
    };
    const connectedUsers = () => {
        navigate('/connected-users');
    };
    const userTasks = () => {
        navigate('/my-tasks');
    };
    const reports = () => {
        navigate('/reports')
    }

    const publicTask = () => {
        navigate('/public-tasks')
    }

    return (
        <React.Fragment>
            <Tooltip title="User Details" placement="right">
                <ListItemButton onClick={userInfo}>
                    <ListItemIcon>
                        <PersonIcon/>
                    </ListItemIcon>
                    <ListItemText primary="User Details" sx={{
                        ml: -2,
                    }}/>
                </ListItemButton>
            </Tooltip>
            <Tooltip title="Connected Users" placement="right">
                <ListItemButton onClick={connectedUsers}>
                    <ListItemIcon>
                        <GroupAddIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Connected Users" sx={{
                        ml: -2,
                    }}/>
                </ListItemButton>
            </Tooltip>
            <Divider sx={{my: 1}}/>
            <Tooltip title="My Tasks" placement="right">
                <ListItemButton onClick={userTasks}>
                    <ListItemIcon>
                        <FormatListNumberedIcon/>
                    </ListItemIcon>
                    <ListItemText primary="My Tasks" sx={{
                        ml: -2,
                    }}/>
                </ListItemButton>
            </Tooltip>
            <Tooltip title="Public Tasks" placement="right">
                <ListItemButton onClick={publicTask}>
                    <ListItemIcon>
                        <AssignmentIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Public Tasks" sx={{
                        ml: -2,
                    }}/>
                </ListItemButton>
            </Tooltip>
            <Tooltip title="Summary Reports" placement="right">
                <ListItemButton onClick={reports}>
                    <ListItemIcon>
                        <QueryStatsIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Summary Reports" sx={{
                        ml: -2,
                    }}/>
                </ListItemButton>
            </Tooltip>
        </React.Fragment>
    );
};