import React from 'react';
import {Box, Container} from '@mui/material';
import Header from '../user/Header';
import Footer from '../user/Footer';
import { Analytics } from "@vercel/analytics/react"


interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({children}) => {
  return (
    <>
    <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
      <Header />
      <Box component='main' sx={{flexGrow: 1, overflow: 'auto', py: 4}}>
        <Container maxWidth={false}>{children}</Container>
      </Box>
      <Footer />
    </Box>
    <Analytics />
    </>
  );
};

export default MainLayout;
