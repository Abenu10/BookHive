import React from 'react';
import { Container, Grid, Typography } from '@mui/material';
import BookCard from '../../components/user/BookCard';

const dummyBooks = [
  { id: 1, title: 'Book 1', author: 'Author 1' },
  { id: 2, title: 'Book 2', author: 'Author 2' },
  { id: 3, title: 'Book 3', author: 'Author 3' },
];

const Home = () => {
  return (
    <Container>
      <Typography variant='h4' component='h1' gutterBottom>
        Available Books
      </Typography>
      <Grid container spacing={3}>
        {dummyBooks.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <BookCard
              book={book}
              onRent={(id) => console.log(`Rent book ${id}`)}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
