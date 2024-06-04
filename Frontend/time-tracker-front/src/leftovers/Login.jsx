import React, {useState} from 'react'
import Box from "@mui/material/Box";
import {Link} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutBackground from "../component/LogoutBackground";
import {ErrorBox, StyledTextField} from "../component/LogoutBackground";
import axios from '../api/axios';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailErrorText, setEmailErrorText] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [responseErrorText, setResponseErrorText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputError = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let hasError = false;

        // Reset errors
        setEmailError(false);
        setPasswordError(false);

        // Check email validity
        if (email.length < 1) {
            setEmailError(true);
            setEmailErrorText('Please enter email');
            hasError = true;
        } else if (!emailRegex.test(email)) {
            setEmailError(true);
            setEmailErrorText('Invalid email format');
            hasError = true;
        }

        // Check password validity
        if (password.length < 6) {
            setPasswordError(true);
            hasError = true;
        }

        return hasError;
    };

    const handleSubmit= async (e)=>{
        e.preventDefault()
        const user = {email, password}
        const checkInputError = handleInputError();
        if (checkInputError) {
            return;
        }

        setLoading(true);

        try{
            const response = await axios.post('/api/v1/auth/authenticate',
                JSON.stringify(user), {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
            const accessToken = response?.data?.accessToken;
            console.log(response.data);
            navigate('/my-tasks');
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setResponseErrorText('Network error: Connection refused');
            }
            else if (err.response?.status === 401){
                setResponseErrorText('Invalid email or password. Please try again.');
            }
            else {
                setResponseErrorText(`Login failed: ${err.response?.status}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <LogoutBackground>
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{
                    marginBottom: 0,
                    paddingLeft: '20px',
                    paddingRight: '20px',
                    position: 'relative',
                    border: '1px solid var(--dark-blue)',
                    backgroundColor: 'var(--white)',
                    color: 'var(--black)',
                    borderRadius: '12px',
                    width: '100%',
                    maxWidth: '380px',
                    padding: '40px',
                }}
            >
                <Box
                    sx={{
                        textAlign: 'center',
                        marginBottom: '32px',
                    }}
                >
                    <Typography variant="h2" component="h2" sx={{
                        mt: '10px',
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '26px',
                        lineHeight: '1.4em',
                        fontWeight: 'bold'
                    }}>
                        Log in
                    </Typography>
                    <Typography variant="body1" component="p" sx={{
                        opacity: 0.75,
                        color: '#000',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        fontWeight: 500,
                        lineHeight: '1.4em'
                    }}>
                        Fill in your log in details below.
                    </Typography>
                </Box>

                <StyledTextField
                    id="email"
                    type="email"
                    variant="outlined"
                    maxLength="256"
                    fullWidth
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={emailError}
                    helperText={emailError ? emailErrorText : ' '}
                    placeholder="Your email"
                    autoComplete="email"
                />
                <StyledTextField
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    maxLength="256"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={passwordError}
                    helperText={passwordError ? 'Password should be at least 6 symbols' : ' '}
                    placeholder="Your password"
                    autoComplete="current-password"
                    onMouseEnter={() => setShowPassword(true)}
                    onMouseLeave={() => setShowPassword(false)}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 1,
                        mb: 1,
                        height: '46px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '20px',
                        borderRadius: '9px',
                        backgroundColor: '#3898ec',
                        fontWeight: 'bold',
                        textTransform: 'none',
                    }}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Log In'}
                </Button>
                <Box
                    sx={{
                        justifyContent: 'center',
                        marginTop: '12px',
                        display: 'flex',
                        gridColumnGap: '8px',
                        flexWrap: 'wrap',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                    }}
                >
                    <Typography variant="body1">Don't have an account? {' '}
                        <Link href="/register">Sign Up</Link>
                    </Typography>
                </Box>
            </Box>
            <Link
                href="/reset-password"
                sx={{
                    color: 'grey.600',
                    marginTop: '24px',
                    fontSize: '14px',
                    display: 'inline-block',
                    textDecoration: 'none',
                    '&:hover': {
                        textDecoration: 'underline',
                    },
                }}
            >
                <Typography component="span">
                    Forgot your password?
                </Typography>
            </Link>
            {responseErrorText.length > 0 &&  <ErrorBox>
                {responseErrorText}
            </ErrorBox>
            }
        </LogoutBackground>
    )
}

export default Login
