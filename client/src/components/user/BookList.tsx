import React from 'react';
import { Grid, Typography } from '@mui/material';
import BookCard from './BookCard';
import { Book } from '../../types/Book';

interface BookListProps {
  books: Book[];
  loading: boolean;
}

const BookList: React.FC<BookListProps> = React.memo(({ books, loading }) => {
  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (books.length === 0) {
    return (
      <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
        No books found. Try a different search or category.
      </Typography>
    );
  }

  return (
    <Grid container spacing={4}>
      {books.map((book) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
          <BookCard
            id={book.id}
            title={book.title}
            author={book.author}
            price={book.price}
            rating={book.rating}
            reviewCount={book.reviewCount}
            image={book.coverImage}
            availableQuantity={book.availableQuantity}
          />
        </Grid>
      ))}
    </Grid>
  );
});

export default BookList;