import React, { useState, ReactElement } from 'react';
import {Box, Container} from '@mui/material';
import Header from '../user/Header';
import Footer from '../user/Footer';
import { Analytics } from "@vercel/analytics/react"
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { searchBooksStart } from '../../redux/user/userSlice';

interface MainLayoutProps {
  children: React.ReactNode;
}

interface ChildProps {
  searchQuery?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({children}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  

  return (
    <>
    <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
      <Header  />
      <Box component='main' sx={{flexGrow: 1, overflow: 'auto', py: 4}}>
        <Container maxWidth={false}>
            {React.Children.map(children, child =>
              React.isValidElement(child)
                ? React.cloneElement(child as ReactElement<ChildProps>, { searchQuery })
                : child
            )}
          </Container>
      </Box>
      <Footer />
    </Box>
    <Analytics />
    </>
  );
};

export default MainLayout;
