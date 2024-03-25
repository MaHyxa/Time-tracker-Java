import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function Appbar() {
    return (
        <Box sx={{ flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <AccessTimeIcon />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Time Tracker
                    </Typography>
                    <Button color="inherit" href="http://localhost:3000/register">Sign In</Button>
                    <Button color="inherit" href="http://localhost:3000/">Login</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
