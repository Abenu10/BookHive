import React from 'react';

interface OwnerDashboardProps {
  ownerName: string;
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ ownerName }) => {
  return (
    <div>
      <h1>Owner Dashboard</h1>
      <p>Welcome, {ownerName}!</p>
    </div>
  );
};

export default OwnerDashboard;
