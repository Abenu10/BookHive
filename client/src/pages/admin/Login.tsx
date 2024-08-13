import React, {useEffect, useState} from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Grid,
} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import Logo from '../../assets/Logo.svg';
import Logo2 from '../../assets/Logo2.svg';
import {RootState} from '../../redux/store';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {loginStart} from '../../redux/auth/authSlice';
import RoleSelectorLogin from '../../components/common/RoleSelectorLogIn';
import {z} from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('testadmin@gmail.com');
  const [password, setPassword] = useState('123456');
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading, isAuthenticated, error} = useSelector(
    (state: RootState) => state.auth
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      
      loginSchema.parse({email, password});

      
      dispatch(
        loginStart({
          userType: 'ADMIN',
          email,
          password,
        })
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        
        const formattedErrors = error.errors.reduce((acc, curr) => {
          acc[curr.path[0] as 'email' | 'password'] = curr.message;
          return acc;
        }, {} as {email?: string; password?: string});
        setErrors(formattedErrors);
      }
    }
  };
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Grid container sx={{height: '100vh', backgroundColor: '#ffff'}}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          bgcolor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={Logo}
          alt='BookHive logo'
          style={{width: '50%', maxWidth: '300px'}}
        />
      </Grid>

      <Grid
        item
        xs={12}
        md={6}
        sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 500,
            p: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'start',
              mb: 2,
            }}
          >
            <img
              src={Logo2}
              alt='BookHive logo'
              style={{width: '50px', marginRight: '10px'}}
            />
            <Typography variant='h5'>Book Rent</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'start',
              justifyContent: 'start',
              mb: 2,
            }}
          >
            <Typography variant='h6'>Login as Admin</Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label='Email address'
              variant='outlined'
              margin='normal'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{mb: 2}}
              placeholder='testadmin@gmail.com'
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              fullWidth
              label='Password'
              variant='outlined'
              margin='normal'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{mb: 2}}
              placeholder='123456'
              error={!!errors.password}
              helperText={errors.password}
            />
            <FormControlLabel
              control={<Checkbox />}
              label='Remember me'
              sx={{mb: 2}}
            />
            <Button
              fullWidth
              variant='contained'
              color='secondary'
              size='large'
              type='submit'
              disabled={loading}
              sx={{mb: 2, color: 'white'}}
              onClick={handleSubmit}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </Button>
          </form>
          {error && (
            <Typography color='error' sx={{mb: 2}}>
              {error}
            </Typography>
          )}
          <Typography variant='body2' sx={{textAlign: 'center'}}>
            Don't have an account?
            <Link color='secondary' href='/admin/signup' sx={{ml: 2}}>
              Sign up
            </Link>
          </Typography>
          <RoleSelectorLogin />
        </Box>
      </Grid>
    </Grid>
  );
};

export default AdminLoginPage;
