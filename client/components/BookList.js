import React from 'react';
import { List, ListItem, Typography } from '@material-ui/core';

function BookList() {
  return (
    <List>
      <ListItem>
        <Typography variant="h6">Book 1</Typography>
      </ListItem>
      <ListItem>
        <Typography variant="h6">Book 2</Typography>
      </ListItem>
      <ListItem>
        <Typography variant="h6">Book 3</Typography>
      </ListItem>
    </List>
  );
}

export default BookList;
