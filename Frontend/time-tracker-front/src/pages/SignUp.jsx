import React, {useState} from 'react'
import {useNavigate} from "react-router-dom";
import LogoutBackground from "./LogoutBackground";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "@mui/material";
import {ErrorBox, StyledTextField} from "./LogoutBackground";
import axios from '../api/axios';

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [fullNameError, setFullNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [emailErrorText, setEmailErrorText] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [responseErrorText, setResponseErrorText] = useState('');
    const [successCreate, setSuccessCreate] = useState(false);

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputError = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let hasError = false;

        // Reset errors
        setEmailError(false);
        setPasswordError(false);
        setFullNameError(false);
        setResponseErrorText('');

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

        // Check name validity
        if (fullName.length < 2) {
            setFullNameError(true);
            hasError = true;
        }

        return hasError;
    };

    const handleSubmit= async (e)=>{
        e.preventDefault()
        const user = {email, password, fullName}
        const checkInputError = handleInputError();
        if (checkInputError) {
            return;
        }

        setLoading(true);

        try{
            const response = await axios.post('/api/v1/auth/register',
                JSON.stringify(user), {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
            setSuccessCreate(true);
            console.log(response.data);
        } catch (err) {
            if (!err?.response) {
                setResponseErrorText('Network error: Connection refused');
            }
            else if (err.response?.status === 409){
                setResponseErrorText('This email address is already in use.');
            }
            else {
                setResponseErrorText(`Sign Up failed: ${err.response?.status}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <LogoutBackground>
            {!successCreate && <Box
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
                        Sign up
                    </Typography>
                    <Typography variant="body1" component="p" sx={{
                        opacity: 0.75,
                        color: '#000',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        fontWeight: 500,
                        lineHeight: '1.4em'
                    }}>
                        Fill up all fields below and you are ready to go.
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
                    id="name"
                    type="text"
                    variant="outlined"
                    maxLength="256"
                    fullWidth
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    error={fullNameError}
                    helperText={fullNameError ? 'Full name should be at least 2 symbols' : ' '}
                    placeholder="Your full name"
                    autoComplete="current-password"
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
                    {loading ? 'Loading...' : 'Sign Up'}
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
                    <Typography variant="body1">Already have an account? {' '}
                        <Link href="/login">Log In</Link>
                    </Typography>
                </Box>
            </Box>
            }
            {successCreate && <Box
                sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--dark-blue)',
                    backgroundColor: 'var(--white)',
                    color: 'var(--black)',
                    borderRadius: '12px',
                    width: '100%',
                    maxWidth: '380px',
                    padding: '40px',
                }}
            >
                <img src={`${process.env.PUBLIC_URL}/check.png`} alt="check icon" width="80" height="80" />
                <Box
                    sx={{
                        textAlign: 'center',
                        marginBottom: '32px',
                        mt: 2,
                    }}
                >
                    <Typography variant="h2" component="h2" sx={{
                        mt: '10px',
                        marginBottom: '12px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '34px',
                        lineHeight: '1.2em',
                        fontWeight: 500,
                    }}>
                        Account created!
                    </Typography>
                    <Typography variant="body1" component="p" sx={{
                        opacity: 0.75,
                        color: '#000',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '16px',
                        fontWeight: 400,
                        lineHeight: '1.5em',
                        mb: -1,
                    }}>
                        Your account was created successfully. You can now log in by navigating to the link below.
                    </Typography>
                </Box>
                <Link href="/login">
                    <Button
                        variant="contained"
                        sx={{
                            height: '46px',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '18px',
                            lineHeight: '1.5em',
                            borderRadius: '9px',
                            backgroundColor: '#3898ec',
                            fontWeight: '500',
                            textTransform: 'none',
                            px: 4,
                            py: 2,
                            '@media (max-width:303px)': {
                                py: 4,
                            },
                            '@media (max-width:253px)': {
                                py: 6,
                            },
                        }}
                    >
                        Go to login
                    </Button>
                </Link>
            </Box>
            }
            {responseErrorText.length > 0 &&  <ErrorBox>
                {responseErrorText}
            </ErrorBox>
            }
        </LogoutBackground>
    )
}

export default SignUp
