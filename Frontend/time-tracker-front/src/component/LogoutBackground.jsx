import React from 'react'
import Box from "@mui/material/Box";
import {styled} from "@mui/material/styles";
import TextField from "@mui/material/TextField";

export const StyledTextField = styled(TextField)(({ theme }) => ({
    mt: '10px',
    '& .MuiInputBase-input': {
        height: '36px',
        padding: '5px 15px',
        borderRadius: '9px',
        backgroundColor: 'rgba(95, 175, 255, 0.11)',
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: '9px',
        transition: 'border-color 0.2s',
        '& fieldset': {
            transition: 'border-color 0.2s',
        },
        '&:hover fieldset': {
            borderColor: '#2d8cff',
        },
    },
}));

export const ErrorBox = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '80%',
    '@media (max-width:360px)': {
        top: '82%',
    },
    '@media (max-width:302px)': {
        top: '88%',
    },
    left: '50%',
    transform: 'translateX(-50%)',
    maxWidth: '360px',
    border: '1px solid var(--dark-blue)',
    backgroundColor: '#fdeaea',
    color: 'var(--black)',
    borderRadius: '6px',
    padding: '16px',
    fontSize: '14px',
    lineHeight: '18px',
    textAlign: 'center',
    '&:hover': {
        backgroundColor: 'var(--back-grey)',
    },
}));


function LogoutBackground({ children }) {
    return (
        <Box
            sx={{
                backgroundColor: '#fff',
                backgroundImage: 'radial-gradient(circle at 200% 300%, #2d8cff, #fff 82%), radial-gradient(circle at 50% 0, rgba(239, 152, 207, .2), rgba(0, 0, 0, 0) 57%), radial-gradient(circle at 0 20%, rgba(122, 167, 255, .25), rgba(0, 0, 0, 0) 42%)',
                flexFlow: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '86.7vh',
                padding: '20px',
                textDecoration: 'none',
                display: 'flex',
                position: 'static',
            }}
        >
            {children}
        </Box>
    );
}

export default LogoutBackground