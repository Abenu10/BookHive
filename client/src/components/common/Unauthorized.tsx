import React from 'react';
import {Box, Typography, Button, Container, Paper} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import Logo2 from '../../assets/Logo2.svg';
import BlockIcon from '@mui/icons-material/Block';
import {logoutStart} from '../../redux/auth/authSlice';
import {useDispatch} from 'react-redux';

function Unauthorized() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutStart());
    navigate('/');
  };

  return (
    <Container maxWidth='sm'>
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <img
            src={Logo2}
            alt='BookHive logo'
            style={{width: '50px', marginRight: '10px'}}
          />
          <Typography variant='h5' color='primary'>
            Book Rent
          </Typography>
        </Box>

        <BlockIcon sx={{fontSize: 80, color: 'error.main', mb: 2}} />

        <Typography variant='h4' component='h1' gutterBottom color='error.main'>
          Unauthorized Access
        </Typography>

        <Typography variant='body1' align='center' sx={{mb: 3}}>
          Oops! It seems you don't have permission to access this page. This
          area might be reserved for a different user role.
        </Typography>

      
        <Box sx={{display: 'flex', justifyContent: 'center', gap: 2}}>
          <Button
            variant='contained'
            color='primary'
            sx={{color: 'white'}}
            onClick={handleLogout}
          >
            Go Back
          </Button>
          
        </Box>
      </Paper>
    </Container>
  );
}

export default Unauthorized;
