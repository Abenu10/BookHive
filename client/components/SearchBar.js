import React from 'react';
import { TextField, Button } from '@material-ui/core';

function SearchBar() {
  return (
    <form>
      <TextField label="Search" />
      <Button variant="contained" color="primary">Search</Button>
    </form>
  );
}

export default SearchBar;
