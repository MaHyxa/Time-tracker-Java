import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {
    Avatar,
    Container, createTheme,
    CssBaseline,
    Grid,
    Link,
    ThemeProvider
} from "@mui/material";
import {useState} from "react";
import Button from "@mui/material/Button";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {useNavigate} from "react-router-dom";
import Typography from "@mui/material/Typography";


function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="http://localhost:3000/">
                Time Tracker
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

function timeout(delay) {
    return new Promise( res => setTimeout(res, delay) );
}


const defaultTheme = createTheme();
export default function Sign_In() {

    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [nickname, setNickname] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const [error, setError] = useState(null)

    const handleSubmit=(e)=>{
        e.preventDefault()
        const user = {name, surname, nickname, password}
        if(password.length<1 || name.length<1 || nickname.length<1){
            setError('Please set all required fields')
            return
        }
        fetch("http://localhost:9192/api/user/new", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(user)
        }).then(async res => {
            if (res.status === 201) {
                setError('User successfully created. You will be redirected to Login Page in 3 seconds')
                await timeout(3000);
                navigate('/')
            }
            if (res.status === 302) {
                setError('This user already exist.')
            } else {
                setError('Something went wrong. Please try again.')
            }
        })

    }

    return (


        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="surname"
                                    label="Last Name"
                                    name="surname"
                                    value={surname}
                                    onChange={(e) => setSurname(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="nickname"
                                    label="Nickname"
                                    name="nickname"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="http://localhost:3000/" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <div>
                                {error && <div>{ error }</div>}
                            </div>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    );
}
