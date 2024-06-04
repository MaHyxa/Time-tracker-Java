import * as React from 'react';
import Box from '@mui/material/Box';
import LogoutBackground from "../component/LogoutBackground";


export default function TaskPage() {


    return (
        <LogoutBackground>
            <Box sx={{ position: "relative", mt: 5 }}>
                <div>Loading...</div>
            </Box>
        </LogoutBackground>
    );
}