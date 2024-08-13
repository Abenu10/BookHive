import React, {useEffect, useState} from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import {ThemeProvider} from '@mui/material/styles';
import {darkTheme, lightTheme} from './styles/theme';
import CssBaseline from '@mui/material/CssBaseline';
import {BrowserRouter as Router, Routes, Route, Outlet} from 'react-router-dom';

// User pages
import UserHome from './pages/user/Home';

import RentHistory from './pages/user/RentHistory';

// Owner pages
import OwnerBooks from './pages/owner/OwnerBooks';
import OwnerRevenue from './pages/owner/Revenue';

// Admin pages

import AdminOwners from './pages/admin/Owners';
import AdminBooks from './pages/admin/AdminBooks';
import Owners from './pages/admin/Owners';
import Books from './pages/admin/AdminBooks';

// Auth components
import LoginPage from './pages/user/Login';
import SignupPage from './pages/user/Signup';
import AdminLoginPage from './pages/admin/Login';
import AdminSignupPage from './pages/admin/Signup';
import OwnerLoginPage from './pages/owner/Login';
import OwnerSignupPage from './pages/owner/Signup';

// components
import LiveBookStatus from './components/owner/LiveBookStatus';

import RequireAuth from './components/user/RequireAuth';
import Unauthorized from './components/common/Unauthorized';
import {useDispatch} from 'react-redux';
import {restoreAuthState} from './redux/auth/authSlice';
import {RootState} from './redux/store';
import {useSelector} from 'react-redux';
import {buildAbility} from './config/caslAbility';
import {AbilityContext} from './contexts/AbilityContext';
import Dashboard from './components/common/Dashboard';
import Notifications from './components/common/Notifications';
import Settings from './components/common/Settings';
import DashboardLayout from './components/Layout/DashboardLayout';
import UploadBook from './components/owner/UploadBook';
import {Global, css} from '@emotion/react';
import MainLayout from './components/Layout/MainLayout';
import BooksByCategory from './components/user/BookByCategory';
import BookDetailPage from './components/user/BookDetail';

function App() {
  const dispatch = useDispatch();
  const {roles, loading} = useSelector((state: RootState) => state.auth);

  // Create the ability instance
  const userRole = roles.length > 0 ? roles[0] : 'USER';
  const ability = buildAbility(userRole);

  useEffect(() => {
    dispatch(restoreAuthState());
  }, [dispatch]);

  // if (loading) {
  //   return <LoadingScreen />;
  // }

  return (
    <ThemeProvider theme={lightTheme}>
      <Global
        styles={css`
          body {
            margin: 0;
            padding: 0;
            /* overflow: hidden; */
          }
        `}
      />
      <CssBaseline />
      <AbilityContext.Provider value={ability}>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path='/' element={<LoginPage />} />
            <Route path='/signup' element={<SignupPage />} />
            <Route path='/admin' element={<AdminLoginPage />} />
            <Route path='/admin/signup' element={<AdminSignupPage />} />
            <Route path='/owner' element={<OwnerLoginPage />} />
            <Route path='/owner/signup' element={<OwnerSignupPage />} />
            <Route path='/unauthorized' element={<Unauthorized />} />

            <Route
              path='/dashboard'
              element={
                <RequireAuth action='read' subject='Dashboard'>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </RequireAuth>
              }
            />
            <Route
              path='/owners'
              element={
                <RequireAuth action='read' subject='Owners'>
                  <DashboardLayout>
                    <Owners />
                  </DashboardLayout>
                </RequireAuth>
              }
            />

            <Route
              path='/books'
              element={
                <RequireAuth action='read' subject='Books'>
                  <DashboardLayout>
                    {roles.includes('ADMIN') ? <AdminBooks /> : <OwnerBooks />}
                  </DashboardLayout>
                </RequireAuth>
              }
            />

            <Route
              path='/admin/books'
              element={
                <RequireAuth action='read' subject='AdminBooks'>
                  <DashboardLayout>
                    <AdminBooks />
                  </DashboardLayout>
                </RequireAuth>
              }
            />

            <Route
              path='/owner/books'
              element={
                <RequireAuth action='read' subject='OwnerBooks'>
                  <DashboardLayout>
                    <OwnerBooks />
                  </DashboardLayout>
                </RequireAuth>
              }
            />

            <Route
              path='/revenue'
              element={
                <RequireAuth action='read' subject='Revenue'>
                  <DashboardLayout>
                    <OwnerRevenue />
                  </DashboardLayout>
                </RequireAuth>
              }
            />

            <Route
              path='/notifications'
              element={
                <RequireAuth action='read' subject='Notifications'>
                  <DashboardLayout>
                    <Notifications />
                  </DashboardLayout>
                </RequireAuth>
              }
            />
            <Route
              path='/settings'
              element={
                <RequireAuth action='read' subject='Settings'>
                  <DashboardLayout>
                    <Settings />
                  </DashboardLayout>
                </RequireAuth>
              }
            />

            <Route
              path='/upload-book'
              element={
                <RequireAuth action='create' subject='Books'>
                  <DashboardLayout>
                    <UploadBook />
                  </DashboardLayout>
                </RequireAuth>
              }
            />

            {/* User routes */}
            <Route
              path='/home'
              element={
                <RequireAuth action='read' subject='Home'>
                  {/* <MainLayout> */}
                  <UserHome />
                  {/* </MainLayout> */}
                </RequireAuth>
              }
            />
            <Route
              path='/category/:categoryId'
              element={
                <RequireAuth action='read' subject='Home'>
                  <BooksByCategory />
                </RequireAuth>
              }
            />

            <Route
              path='/book/:bookId'
              element={
                <RequireAuth action='read' subject='Home'>
                  <MainLayout>
                    <BookDetailPage />
                  </MainLayout>
                </RequireAuth>
              }
            />

            <Route path='/book-status' element={<LiveBookStatus />} />
          </Routes>
        </Router>
      </AbilityContext.Provider>
    </ThemeProvider>
  );
}

export default App;
