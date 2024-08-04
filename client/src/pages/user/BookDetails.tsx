import React from 'react';

interface BookDetailsProps {
  bookId: string;
}

const BookDetails: React.FC<BookDetailsProps> = ({ bookId }) => {
  return (
    <div>
      <h1>Book Details</h1>
      <p>Book ID: {bookId}</p>
    </div>
  );
};

export default BookDetails;
