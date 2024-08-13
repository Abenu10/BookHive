import React from 'react';
import {Box, Button, Grid, Paper, Typography} from '@mui/material';
import {useAbility} from '../../hooks/useAbility';
import Sidebar from './Sidebar';
import ThisMonthStatistics from './ThisMonthStatistics';
import AvailableBooksPieChart from './AvailableBooksPieChart';
import LiveBookStatus from '../owner/LiveBookStatus';
import EarningSummaryChart from './EarningSummaryChart';
import {logoutStart} from '../../redux/auth/authSlice';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';

const Dashboard: React.FC = () => {
  const ability = useAbility();
  const dispatch = useDispatch();
  const {user, isAuthenticated} = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logoutStart());
  };

  if (!user) return null;

  return (
    <Box sx={{flexGrow: 1}}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          {ability.can('read', 'Statistics') && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: 'rgba(131, 150, 170, 0.08) 0px 4px 30px',
              }}
            >
              <ThisMonthStatistics />
              <Box sx={{mt: 2}}>
                <AvailableBooksPieChart />
              </Box>
            </Paper>
          )}
        </Grid>
        <Grid item xs={12} md={8}>
          {ability.can('read', 'Books') && (
            <Paper
              elevation={0}
              sx={{
                mb: 3,
                borderRadius: 2,
                boxShadow: 'rgba(131, 150, 170, 0.08) 0px 4px 30px',
              }}
            >
              <LiveBookStatus />
            </Paper>
          )}
          {ability.can('read', 'Revenue') && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: 'rgba(131, 150, 170, 0.08) 0px 4px 30px',
              }}
            >
              <EarningSummaryChart />
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
