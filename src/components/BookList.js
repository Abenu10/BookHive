import React from 'react';
import { useSelector } from 'react-redux';

const BookList = () => {
  const books = useSelector((state) => state.books);

  return (
    <div>
      <h1>Book List</h1>
      <ul>
        {books.map((book) => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
