import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import BookList from './BookList';
import AddBookForm from './AddBookForm';

function OwnerDashboard() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Owner Dashboard</Typography>
      </Grid>
      <Grid item xs={6}>
        <BookList />
      </Grid>
      <Grid item xs={6}>
        <AddBookForm />
      </Grid>
    </Grid>
  );
}

export default OwnerDashboard;
