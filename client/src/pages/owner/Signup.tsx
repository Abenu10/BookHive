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
import Logo from '../../assets/Logo.svg';
import Logo2 from '../../assets/Logo2.svg';
import {signupStart} from '../../redux/auth/authSlice';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {RootState} from '../../redux/store';
import RoleSelectorSignUp from '../../components/common/RoleSelectorSignUp';

const OwnerSignupPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading, isAuthenticated, error} = useSelector(
    (state: RootState) => state.auth
  );

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    location: '',
    name: '',
    acceptTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value, checked} = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === 'acceptTerms' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    if (!formData.acceptTerms) {
      alert('Please accept the Terms and Conditions');
      return;
    }
    const {confirmPassword, acceptTerms, ...ownerData} = formData;
    dispatch(
      signupStart({
        userType: 'OWNER',
        ...ownerData,
      })
    );
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
          style={{width: '40%', maxWidth: '250px'}}
        />
      </Grid>

      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundColor: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 400,
            p: 3,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'start',
              mb: 1,
            }}
          >
            <img
              src={Logo2}
              alt='BookHive logo'
              style={{width: '40px', marginRight: '8px'}}
            />
            <Typography variant='h6' sx={{fontSize: '1.1rem'}}>
              Book Rent
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'start',
              justifyContent: 'start',
              mb: 1,
            }}
          >
            <Typography variant='subtitle1' sx={{fontSize: '0.9rem'}}>
              Signup as Owner
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            {[
              'name',
              'email',
              'password',
              'confirmPassword',
              'location',
              'phoneNumber',
            ].map((field) => (
              <TextField
                key={field}
                fullWidth
                label={
                  field.charAt(0).toUpperCase() +
                  field.slice(1).replace(/([A-Z])/g, ' $1')
                }
                variant='outlined'
                margin='normal'
                name={field}
                type={
                  field === 'password' || field === 'confirmPassword'
                    ? 'password'
                    : field === 'email'
                    ? 'email'
                    : 'text'
                }
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                required
                sx={{
                  mb: 1.5,
                  '& .MuiInputBase-root': {fontSize: '0.9rem'},
                  '& .MuiInputLabel-root': {fontSize: '0.9rem'},
                }}
              />
            ))}
            <FormControlLabel
              control={
                <Checkbox
                  name='acceptTerms'
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  size='small'
                />
              }
              label={
                <Typography sx={{fontSize: '0.8rem'}}>
                  I accept the Terms and Conditions
                </Typography>
              }
              sx={{mb: 1.5}}
            />
            <Button
              fullWidth
              variant='contained'
              color='secondary'
              size='medium'
              type='submit'
              disabled={loading}
              sx={{mb: 1.5, color: 'white', fontSize: '0.9rem', py: 1}}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </form>
          {error && (
            <Typography color='error' sx={{mb: 1.5, fontSize: '0.8rem'}}>
              {error}
            </Typography>
          )}
          <Typography
            variant='body2'
            sx={{textAlign: 'center', fontSize: '0.8rem'}}
          >
            Already have an account?
            <Link
              color='secondary'
              href='/owner'
              sx={{ml: 1, fontSize: '0.8rem'}}
            >
              Login
            </Link>
          </Typography>
          <RoleSelectorSignUp />
        </Box>
      </Grid>
    </Grid>
  );
};

export default OwnerSignupPage;
