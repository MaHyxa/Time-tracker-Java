import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import Divider from "@mui/material/Divider";
import QueryStatsIcon from '@mui/icons-material/QueryStats';

export const mainListItems = ({ navigate }) => {
    const userInfo = () => {
        navigate('/my-info');
    };
    const userTasks = () => {
        navigate('/my-tasks');
    };
    const reports = () => {
        navigate('/reports')
    }

    const stats = () => {
        navigate('/my-stats')
    }

    return (
  <React.Fragment>
    <ListItemButton onClick={userInfo}>
      <ListItemIcon>
          <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="User Details" />
    </ListItemButton>
      <Divider sx={{ my: 1 }} />
    <ListItemButton onClick={userTasks}>
      <ListItemIcon>
          <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="All Tasks" />
    </ListItemButton>
    <ListItemButton onClick={reports}>
      <ListItemIcon>
          <QueryStatsIcon />
      </ListItemIcon>
      <ListItemText primary="Summary Reports" />
    </ListItemButton>
    <ListItemButton onClick={stats}>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Statistics" />
    </ListItemButton>
  </React.Fragment>
    );
};