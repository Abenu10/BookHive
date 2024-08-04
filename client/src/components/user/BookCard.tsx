import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

interface Book {
  id: number;
  title: string;
  author: string;
}

interface BookCardProps {
  book: Book;
  onRent: (id: number) => void;
}

const BookCard = ({ book, onRent }: BookCardProps) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          {book.title}
        </Typography>
        <Typography variant="body2" component="p">
          {book.author}
        </Typography>
        <Button variant="contained" onClick={() => onRent(book.id)}>Rent</Button>
      </CardContent>
    </Card>
  );
};

export default BookCard;
