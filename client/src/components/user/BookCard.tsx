import React from 'react';
import {Card, CardContent, CardMedia, Typography, Button} from '@mui/material';

const BookCard = ({book, onRent}) => {
  return (
    <Card sx={{maxWidth: 345, m: 2}}>
      <CardMedia
        component='img'
        height='140'
        image={book.coverImage}
        alt={book.title}
      />
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          {book.title}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Author: {book.author}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Category: {book.category}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Price: ${book.price}
        </Typography>
        <Button
          variant='contained'
          color='primary'
          onClick={() => onRent(book.id)}
        >
          Rent Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookCard;
