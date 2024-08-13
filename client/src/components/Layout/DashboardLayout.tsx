import React, {useState} from 'react';
import {Box, IconButton} from '@mui/material';
import AdminOwnerHeader from './AdminOwnerHeader';
import Sidebar from '../common/Sidebar';
import MenuIcon from '@mui/icons-material/Menu';
import {Global, css} from '@emotion/react';
import { Analytics } from "@vercel/analytics/react"

interface DashboardLayoutProps {
  children: React.ReactNode;
}
const DashboardLayout: React.FC<DashboardLayoutProps> = ({children}) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
     <Global
        styles={css`
          body {
            margin: 0;
            padding: 0;
             overflow: hidden; 
          }
        `}
      />
    
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      <Sidebar isOpen={isOpen} />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <AdminOwnerHeader onMenuToggle={toggleDrawer} />
        <Box
          component='main'
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            p: 3,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
    <Analytics />
    </>
  );
};
export default DashboardLayout;
