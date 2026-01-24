import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../../general_component/shared-theme/AppTheme';
import ColorModeSelect from '../../general_component/shared-theme/ColorModeSelect';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './components/CustomIcons';
import icon from '../../general_component/images/Lockedin_Icon only.png'
import { Link, useNavigate } from 'react-router-dom';
import { LoginData } from '../../general_component/data';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

// Login component — validates credentials against locally stored signup data.
export default function Login(props) {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('')
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [loginError, setLoginError] = React.useState('');

  const validateInputs = () => { //authenticating input
    // Validate only email and password for login form
    const emailEl = document.getElementById('email');
    const passwordEl = document.getElementById('password');
    let isValid = true;
    if (!emailEl?.value || !/\S+@\S+\.\S+/.test(emailEl.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }
    if (!passwordEl?.value || passwordEl.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }
    return isValid;
  };

  // Handle login submit: validate against stored signup data in localStorage
  const handleSubmit = (event) => {
    event.preventDefault();
    // Basic input validation
    if (!validateInputs()) return;
    const form = new FormData(event.currentTarget);
    const email = form.get('email');
    const password = form.get('password');

    // Read stored signup user from localStorage
    const raw = localStorage.getItem('lockedin_user') || localStorage.getItem('sozo_user');
    let stored = null;
    try {
      stored = raw ? JSON.parse(raw) : null;
    } catch (e) {
      stored = null;
    }

    // If no stored user or credentials mismatch -> show error
    if (!stored || !stored.email || !stored.password || stored.email !== email || stored.password !== password) {
      setLoginError('invalid email or password');
      setEmailError(true);
      setPasswordError(true);
      setEmailErrorMessage('');
      setPasswordErrorMessage('');
      return;
    }

    // Successful login — persist the active user and navigate
    localStorage.setItem('lockedin_user', JSON.stringify(stored));
    setLoginError('');

    // Track login streak
    const today = new Date().toDateString();
    const lastLogin = localStorage.getItem('lastLoginDate');
    let streak = parseInt(localStorage.getItem('loginStreak') || '0', 10);

    if (lastLogin !== today) {
      // New day: increment streak if consecutive or start new
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastLogin === yesterday.toDateString()) {
        streak += 1;
      } else {
        streak = 1; // Reset if not consecutive
      }
      localStorage.setItem('lastLoginDate', today);
      localStorage.setItem('loginStreak', streak.toString());
    }
    // If same day, do nothing (already counted)

    navigate('/dashboard');
  };

  return (
    <AppTheme {...props} >
      <CssBaseline enableColorScheme />
      {/* <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} /> */}
      <SignUpContainer direction="column" justifyContent="space-between" style={{ height:'120vh', backgroundColor:localStorage.theme}} >
        <Card variant="outlined" style = {{overflowY: 'scroll', scrollbarWidth: 'none'}}>
        <img src={icon} alt ='company logo' width={'10%'}  />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign In
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError || !!loginError}
                helperText={loginError || passwordErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <Button 
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              LockIn
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>or</Typography>
          </Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ textAlign: 'center' }}>
            Don't have an account?{' '}
              <Link
              to = '/signup'
                variant="body2"
                sx={{ alignSelf: 'center' }}
              >
                SignUp
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
