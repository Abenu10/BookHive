import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Box,
  Button,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import {useDispatch} from 'react-redux';
import {logoutStart} from '../../redux/auth/authSlice';
import Logo2 from '../../assets/Logo2.svg';

const Header: React.FC = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutStart());
  };

  const iconStyle = {
    fontSize: '1.5rem',
    mx: 1,
    transition: 'transform 0.3s ease-in-out, color 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.2)',
      color: 'primary.main',
    },
  };

  return (
    <AppBar
      position='static'
      color='default'
      elevation={0}
      sx={{borderBottom: '1px solid #e0e0e0'}}
    >
      <Toolbar
        sx={{
          height: 80,
          minHeight: 80,
          px: 2,
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '15%',
            minWidth: '120px',
          }}
        >
          <img
            src={Logo2}
            alt='BookHive logo'
            style={{width: '55px', marginRight: '8px'}}
          />
          <Typography
            variant='h6'
            sx={{fontWeight: 'bold', fontSize: '1.7rem', whiteSpace: 'nowrap'}} 
          >
            BookHive
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            maxWidth: '600px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'background.paper',
              borderRadius: 20,
              px: 0.5,
              py: 0.3,
              width: '100%',
              border: '2px solid',
              borderColor: 'primary.main',
            }}
          >
            <InputBase
              placeholder='Search for anything'
              sx={{ml: 1, flex: 1, fontSize: '0.9rem'}} 
              inputProps={{'aria-label': 'search'}}
            />
            <Box
              sx={{
                bgcolor: 'primary.main',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 42,
                height: 42,
              }}
            >
              <IconButton
                type='submit'
                sx={{
                  p: '6px',
                  color: 'secondary.main',
                  '&:hover': {
                    bgcolor: '#00ABFF',
                    '& .MuiSvgIcon-root': {
                      color: 'black',
                    },
                  },
                }}
                aria-label='search'
              >
                <SearchIcon fontSize='medium' />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '25%',
            minWidth: '250px',
          }}
        >
          <Tooltip title='Favorites' placement='bottom' arrow>
            <IconButton color='inherit' sx={iconStyle}>
              <FavoriteBorderIcon fontSize='inherit' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Gifts' placement='bottom' arrow>
            <IconButton color='inherit' sx={iconStyle}>
              <CardGiftcardOutlinedIcon fontSize='inherit' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Notifications' placement='bottom' arrow>
            <IconButton color='inherit' sx={iconStyle}>
              <NotificationsNoneOutlinedIcon fontSize='inherit' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Cart' placement='bottom' arrow>
            <IconButton color='inherit' sx={iconStyle}>
              <ShoppingCartOutlinedIcon fontSize='inherit' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Profile' placement='bottom' arrow>
            <IconButton color='inherit' sx={iconStyle}>
              <PersonOutlineIcon fontSize='inherit' />
            </IconButton>
          </Tooltip>
        </Box>
        <Button
          variant='contained'
          color='secondary'
          onClick={handleLogout}
          sx={{ml: 2, fontSize: '0.9rem', py: 0.5, px: 1.5}}
        >
          Logout
        </Button>
      </Toolbar>
      <Box sx={{bgcolor: 'white', borderTop: '1px solid #e0e0e0', py: 0.5}}>
        <Box sx={{display: 'flex', justifyContent: 'center', px: 2}}>
          {['Textbooks', 'Audiobooks', 'eBooks', 'Gifts', 'Bestsellers'].map(
            (category) => (
              <Button
                key={category}
                sx={{
                  color: 'black',
                  mx: 1,
                  textTransform: 'none',
                  fontSize: '1rem',
                }}
              >
                {category}
              </Button>
            )
          )}
        </Box>
      </Box>
    </AppBar>
  );
};

export default Header;
