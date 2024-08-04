import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Container, Grid, Typography} from '@mui/material';
import BookCard from '../../components/user/BookCard';
import { fetchBooks } from '../../redux/actions/bookAction';
// import {fetchBooks} from '../../redux/actions/bookActions';

const Home = () => {
  const dispatch = useDispatch();
  const {books, loading, error} = useSelector((state) => state.books);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <Container>
      <Typography variant='h4' component='h1' gutterBottom>
        Available Books
      </Typography>
      <Grid container spacing={3}>
        {books.map((book) => (
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
