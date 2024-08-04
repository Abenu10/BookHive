import React from 'react';

interface AdminOwnersProps {
  owners: any[];
}

const AdminOwners: React.FC<AdminOwnersProps> = ({ owners }) => {
  const dummyOwners = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Doe' },
    { id: 3, name: 'Bob Smith' },
  ];

  return (
    <div>
      <h1>Admin Owners</h1>
      <ul>
        {dummyOwners.map((owner) => (
          <li key={owner.id}>{owner.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminOwners;
