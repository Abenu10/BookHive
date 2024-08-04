import React from 'react';

interface OwnerBooksProps {
  books: any[];
}

const OwnerBooks: React.FC<OwnerBooksProps> = ({ books }) => {
  if (!books) return null;

  return (
    <div>
      <h1>Owner Books</h1>
      <ul>
        {books.map((book, index) => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default OwnerBooks;
