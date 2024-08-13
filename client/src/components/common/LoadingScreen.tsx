import React from 'react';
import {Box, CircularProgress, Typography} from '@mui/material';
import {keyframes} from '@mui/system';


import Logo from '../../assets/Logo.svg';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'primary.main',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 150,
          height: 150,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress
          size={150}
          thickness={2}
          sx={{
            color: 'secondary.main',
            position: 'absolute',
            animation: `${spin} 3s linear infinite`,
          }}
        />
        <img
          src={Logo}
          alt='Logo'
          style={{
            width: '60%',
            height: '60%',
            animation: `${pulse} 2s ease-in-out infinite`,
          }}
        />
      </Box>
      <Typography
        variant='h5'
        sx={{
          color: 'white',
          mt: 3,
          fontWeight: 'bold',
          letterSpacing: 1,
        }}
      >
        Loading...
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
