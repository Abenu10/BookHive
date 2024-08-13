import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  Divider,
  Tooltip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {RootState} from '../../redux/store';
import {buildAbility} from '../../config/caslAbility';
import {Can} from '../../contexts/AbilityContext';
import {logoutStart} from '../../redux/auth/authSlice';
import Logo3 from '../../assets/Logo3.svg';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({isOpen}) => {
  const {roles} = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const userRole = roles.length > 0 ? roles[0] : 'USER';
  const ability = buildAbility(userRole);

  const handleLogout = () => {
    dispatch(logoutStart());
  };
  const mainMenuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      subject: 'Dashboard',
    },
    {
      text: 'Books',
      icon: <MenuBookIcon />,
      path: roles.includes('ADMIN') ? '/admin/books' : '/owner/books',
      subject: 'Books',
    },
    {
      text: 'Upload Book',
      icon: <CloudUploadIcon />,
      path: '/upload-book',
      subject: 'CreateBooks',
      role: 'OWNER',
    },
    {
      text: 'Owners',
      icon: <PeopleIcon />,
      path: '/owners',
      subject: 'Owners',
      role: 'ADMIN',
    },
  ];

  const secondaryMenuItems = [
    {
      text: 'Notifications',
      icon: <NotificationsIcon />,
      path: '/notifications',
      ability: 'Notifications',
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings',
      ability: 'Settings',
    },
    {
      text: 'Login as Book Owner',
      icon: <PersonIcon />,
      path: '/owner',
      ability: 'LoginAsOwner',
      role: 'ADMIN',
      onClick: handleLogout,
    },
    {
      text: 'Login as Admin',
      icon: <PersonIcon />,
      path: '/admin',
      ability: 'LoginAsAdmin',
      role: 'OWNER',
      onClick: handleLogout,
    },
  ];

  return (
    <Box
      sx={{
        width: isOpen ? 280 : 80,
        height: '100vh',
        backgroundColor: '#171B36',
        color: 'white',
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        margin: 1,
        borderRadius: 2,
        overflowY: 'auto',
        transition: 'width 0.3s ease',
        '&::-webkit-scrollbar': {display: 'none'},
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}
    >
      <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
        <img
          src={Logo3}
          alt='BookHive logo'
          style={{width: '40px', marginRight: '8px'}}
        />
        {isOpen && (
          <Typography variant='h6' sx={{fontWeight: 'bold'}}>
            Book Rent
          </Typography>
        )}
      </Box>
      <List sx={{flexGrow: 1}}>
        <Divider sx={{bgcolor: '#656575', mb: 2, mt: 2}} />
        {mainMenuItems.map((item) => (
          <Can I='read' a={item.subject} ability={ability} key={item.text}>
            {(allowed) =>
              allowed &&
              (!item.role || item.role === userRole) && (
                <Tooltip title={isOpen ? '' : item.text} placement='right'>
                  <ListItem
                    button
                    component={Link}
                    to={item.path}
                    onClick={item.onClick || undefined}
                    selected={location.pathname === item.path}
                    sx={{
                      color: 'white',
                      borderRadius: '10px',
                      mb: 1,
                      transition: 'all 0.3s ease',
                      '&.Mui-selected': {
                        backgroundColor: 'secondary.main',
                        '&:hover': {
                          backgroundColor: 'secondary.dark',
                        },
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'scale(1.02)',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{color: 'white', minWidth: isOpen ? 56 : 'auto'}}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {isOpen && <ListItemText primary={item.text} />}
                  </ListItem>
                </Tooltip>
              )
            }
          </Can>
        ))}

        <Divider sx={{bgcolor: '#656575', my: 2}} />

        {secondaryMenuItems.map((item) => (
          <Can I='read' a={item.ability} ability={ability} key={item.text}>
            {(!item.role || item.role === userRole) && (
              <Tooltip title={isOpen ? '' : item.text} placement='right'>
                <ListItem
                  button
                  component={Link}
                  to={item.path}
                  onClick={item.onClick || undefined}
                  selected={location.pathname === item.path}
                  sx={{
                    color: 'white',
                    borderRadius: '10px',
                    mb: 1,
                    transition: 'all 0.3s ease',
                    '&.Mui-selected': {
                      backgroundColor: 'secondary.main',
                      '&:hover': {
                        backgroundColor: 'secondary.dark',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'scale(1.02)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{color: 'white', minWidth: isOpen ? 56 : 'auto'}}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {isOpen && <ListItemText primary={item.text} />}
                </ListItem>
              </Tooltip>
            )}
          </Can>
        ))}
        <Divider sx={{bgcolor: '#656575', my: 2}} />
      </List>
      <Tooltip title={isOpen ? '' : 'Logout'} placement='right'>
        <Button
          variant='contained'
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            color: 'white',
            borderRadius: '10px',
            mb: 1,
            transition: 'background-color 0.3s ease',
            backgroundColor: '#656575',
            '&:hover': {
              backgroundColor: 'secondary.main',
              transform: 'scale(1.02)',
            },
            justifyContent: isOpen ? 'flex-start' : 'center',
            minWidth: 'auto',
          }}
        >
          {isOpen && 'Logout'}
        </Button>
      </Tooltip>
    </Box>
  );
};

export default Sidebar;
