import React from 'react';

interface RentHistoryProps {
  rentHistory: any[];
}

const RentHistory: React.FC<RentHistoryProps> = ({ rentHistory }) => {
  return (
    <div>
      <h1>Rent History</h1>
      <ul>
        {rentHistory.map((rent, index) => (
          <li key={index}>{rent.bookTitle}</li>
        ))}
      </ul>
    </div>
  );
};

export default RentHistory;
