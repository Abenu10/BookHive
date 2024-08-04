import React from 'react';
import BookList from './BookList';
import BookForm from './BookForm';

const OwnerDashboard = () => {
  return (
    <div>
      <h1>Owner Dashboard</h1>
      <BookList />
      <BookForm />
    </div>
  );
};

export default OwnerDashboard;
