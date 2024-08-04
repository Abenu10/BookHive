import React from 'react';
import { List, ListItem, Typography } from '@material-ui/core';

function UserList() {
  return (
    <List>
      <ListItem>
        <Typography variant="h6">User 1</Typography>
      </ListItem>
      <ListItem>
        <Typography variant="h6">User 2</Typography>
      </ListItem>
      <ListItem>
        <Typography variant="h6">User 3</Typography>
      </ListItem>
    </List>
  );
}

export default UserList;
