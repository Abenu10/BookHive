import React from 'react';

interface AdminDashboardProps {
  adminName: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ adminName }) => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {adminName}!</p>
    </div>
  );
};

export default AdminDashboard;
