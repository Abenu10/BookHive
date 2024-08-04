import React from 'react';
import { List, ListItem, Typography } from '@material-ui/core';

function RentalHistory() {
  return (
    <List>
      <ListItem>
        <Typography variant="h6">Rental 1</Typography>
      </ListItem>
      <ListItem>
        <Typography variant="h6">Rental 2</Typography>
      </ListItem>
      <ListItem>
        <Typography variant="h6">Rental 3</Typography>
      </ListItem>
    </List>
  );
}

export default RentalHistory;
