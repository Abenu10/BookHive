import React from 'react';
import {useLocation} from 'react-router-dom';
import {Box, Typography, Paper, IconButton} from '@mui/material';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import MenuIcon from '@mui/icons-material/Menu';

const AdminOwnerHeader: React.FC<AdminOwnerHeaderProps> = ({onMenuToggle}) => {
  const location = useLocation();
  const {user} = useSelector((state: RootState) => state.auth);

  const getPageTitle = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 1) {
      return pathSegments[1].charAt(0).toUpperCase() + pathSegments[1].slice(1);
    }
    return pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        borderRadius: 2,
        boxShadow: '0 8px 16px rgba(92, 92, 92, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          px: 2,
        }}
      >
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <IconButton onClick={onMenuToggle} edge='start' sx={{mr: 2}}>
            <MenuIcon />
          </IconButton>
          <Typography variant='h5'>
            <strong>{user?.role === 'ADMIN' ? 'Admin' : 'Owner'} </strong>
            <Typography
              component='span'
              color='text.secondary'
              variant='h6'
              sx={{fontWeight: 'bold'}}
            >
              / {getPageTitle()}
            </Typography>
          </Typography>
        </Box>
        <Typography variant='h6'>Welcome, {user?.name}</Typography>
      </Box>
    </Paper>
  );
};
export default AdminOwnerHeader;
