import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {Container, Paper} from "@mui/material";
import {useState} from "react";
import Button from "@mui/material/Button";
import AppBar from "./AppBar";
import {useNavigate} from "react-router-dom";

export default function Sign_In() {

    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [nickname, setNickname] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    const handleClick=(e)=>{
        e.preventDefault()
        const user = {name, surname, nickname, password}
        fetch("http://localhost:9192/api/user/new", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(user)
        }).then(res => navigate('/'))
    }


    return (

        <Container>
            <AppBar />
            <h1>Welcome to your personal Time Tracker</h1>
            <Paper elevation={6}>
                <h1>Sign In</h1>
                <h2></h2>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': {m: 1, width: '25ch'},
                    }}
                    noValidate
                    autoComplete="off"
                >
                        <TextField id="Name" label="Name" variant="outlined"
                                   value={name}
                                   onChange={(e) => setName(e.target.value)}/>
                        <TextField id="Surname" label="Surname" variant="outlined"
                                   value={surname}
                                   onChange={(e) => setSurname(e.target.value)}/>
                        <TextField id="Nickname" label="Nickname" variant="outlined"
                                   value={nickname}
                                   onChange={(e) => setNickname(e.target.value)}/>
                        <TextField id="Password" label="Password" variant="outlined"
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}/>
                </Box>
                <div><h1/></div>
                <Button variant="contained" onClick={handleClick}>Create Account</Button>
                <h3>Already have account? </h3>
                <Button href="http://localhost:3000/">Login</Button>
            </Paper>
        </Container>
    );
}
