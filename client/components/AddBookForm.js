import React from 'react';
import { Form, TextField, Button } from '@material-ui/core';

function AddBookForm() {
  return (
    <Form>
      <TextField label="Book Title" />
      <TextField label="Book Author" />
      <Button variant="contained" color="primary">Add Book</Button>
    </Form>
  );
}

export default AddBookForm;
