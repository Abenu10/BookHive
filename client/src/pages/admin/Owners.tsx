import React from 'react';

interface AdminOwnersProps {
  owners: any[];
}

const AdminOwners: React.FC<AdminOwnersProps> = ({ owners }) => {
  return (
    <div>
      <h1>Admin Owners</h1>
      <ul>
        {owners.map((owner, index) => (
          <li key={index}>{owner.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminOwners;
