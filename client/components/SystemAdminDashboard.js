import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import UserList from './UserList';
import BookList from './BookList';

function SystemAdminDashboard() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">System Admin Dashboard</Typography>
      </Grid>
      <Grid item xs={6}>
        <UserList />
      </Grid>
      <Grid item xs={6}>
        <BookList />
      </Grid>
    </Grid>
  );
}

export default SystemAdminDashboard;
