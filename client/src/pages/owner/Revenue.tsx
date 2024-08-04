import React from 'react';

interface OwnerRevenueProps {
  revenue: number;
}

const OwnerRevenue: React.FC<OwnerRevenueProps> = ({ revenue }) => {
  return (
    <div>
      <h1>Owner Revenue</h1>
      <p>Total Revenue: ${revenue}</p>
    </div>
  );
};

export default OwnerRevenue;
