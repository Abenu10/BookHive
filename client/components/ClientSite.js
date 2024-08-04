import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import BookList from './BookList';
import SearchBar from './SearchBar';

function ClientSite() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Client Site</Typography>
      </Grid>
      <Grid item xs={12}>
        <SearchBar />
      </Grid>
      <Grid item xs={12}>
        <BookList />
      </Grid>
    </Grid>
  );
}

export default ClientSite;
