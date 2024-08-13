import React from 'react';
import {Box, Typography, Button} from '@mui/material';
import {Person, Business, AdminPanelSettings} from '@mui/icons-material';
import {useLocation, useNavigate} from 'react-router-dom';

const RoleSelectorSignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const roles = [
    {
      name: 'User',
      icon: Person,
      color: '#4CAF50',
      selectedColor: '#45a049',
      path: '/signup',
    },
    {
      name: 'Owner',
      icon: Business,

      color: '#FF9800',
      selectedColor: '#f57c00',
      path: '/owner/signup',
    },
    {
      name: 'Admin',
      icon: AdminPanelSettings,
      color: '#2196F3',
      selectedColor: '#1e88e5',
      path: '/admin/signup',
    },
  ];

  const handleRoleSelect = (role) => {
    setTimeout(() => navigate(role.path), 300); // Delay navigation for visual feedback
  };

  const isSelected = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/login';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Box sx={{mt: 2, textAlign: 'center'}}>
      <Typography variant='body1' sx={{mb: 1, fontSize: '0.9rem'}}>
        Choose your role to login
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        {roles.map((role) => (
          <Button
            key={role.name}
            variant='contained'
            startIcon={<role.icon sx={{fontSize: 16}} />}
            onClick={() => handleRoleSelect(role)}
            sx={{
              backgroundColor: isSelected(role.path)
                ? role.selectedColor
                : 'rgba(0, 0, 0, 0.08)',
              color: isSelected(role.path) ? 'white' : 'rgba(0, 0, 0, 0.87)',
              borderRadius: '15px',
              padding: '6px 12px',
              fontSize: '0.75rem',
              minWidth: '80px',
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: role.color,
                color: 'white',
                transform: 'scale(1.05)',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            {role.name}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default RoleSelectorSignUp;
