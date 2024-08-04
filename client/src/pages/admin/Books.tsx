import React from 'react';

interface AdminBooksProps {
  books: any[];
}

const AdminBooks: React.FC<AdminBooksProps> = ({ books }) => {
  return (
    <div>
      <h1>Admin Books</h1>
      <ul>
        {books.map((book, index) => (
          <li key={index}>{book.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminBooks;
