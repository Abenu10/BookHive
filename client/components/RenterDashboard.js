import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import BookList from './BookList';
import RentalHistory from './RentalHistory';

function RenterDashboard() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Renter Dashboard</Typography>
      </Grid>
      <Grid item xs={6}>
        <BookList />
      </Grid>
      <Grid item xs={6}>
        <RentalHistory />
      </Grid>
    </Grid>
  );
}

export default RenterDashboard;
