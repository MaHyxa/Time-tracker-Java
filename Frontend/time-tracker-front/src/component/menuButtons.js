import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import Divider from "@mui/material/Divider";

export const mainListItems = ({ navigate }) => {
    const userInfo = () => {
        navigate('/my-info');
    };
    const userTasks = () => {
        navigate('/my-tasks');
    };

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
    <ListItemButton>
      <ListItemIcon>
          <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Active Tasks" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Statistics" />
    </ListItemButton>
  </React.Fragment>
    );
};