import React from 'react';

interface AdminOwnersProps {
  owners: any[];
}

const AdminOwners: React.FC<AdminOwnersProps> = ({ owners }) => {
  const dummyOwners = [
    { name: 'John Doe' },
    { name: 'Jane Doe' },
    { name: 'Bob Smith' },
  ];

  return (
    <div>
      <h1>Admin Owners</h1>
      <ul>
        {dummyOwners.map((owner, index) => (
          <li key={index}>{owner.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminOwners;
