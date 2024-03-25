import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {Container, Paper} from "@mui/material";
import {useState} from "react";
import Button from "@mui/material/Button";
import AppBar from "./AppBar";

export default function Login() {

    const [nickname, setNickname] = useState('')
    const [password, setPassword] = useState('')

    const handleClick=(e)=>{
        e.preventDefault()
        const user = {nickname, password}
        fetch()
    }

    return (
        <Container>
            <AppBar />
            <Paper elevation={6}>
                <h1>Login</h1>
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
        >
            <TextField id="outlined-basic" label="Nickname" variant="outlined"
             value = {nickname}
             onChange={(e) => setNickname(e.target.value)}/>
            <TextField id="outlined-basic" label="Password" variant="outlined"
             value = {password}
             onChange={(e) => setPassword(e.target.value)}/>
        </Box>
                <h1> </h1>
                <Button variant="contained" onClick={handleClick}>Login</Button>
                <h3>Dont have account? </h3>
                <Button href="http://localhost:3000/register">Register</Button>
            </Paper>
        </Container>
    );
}
