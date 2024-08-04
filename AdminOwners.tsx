import React from 'react';

interface Owner {
  id: number;
  name: string;
}

interface AdminOwnersProps {
  owners: Owner[];
}

const AdminOwners: React.FC<AdminOwnersProps> = ({ owners }) => {
  const dummyOwners: Owner[] = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Doe' },
    { id: 3, name: 'Bob Smith' },
  ];

  return (
    <div>
      <h2>Admin Owners</h2>
      <ul>
        {dummyOwners.map((owner) => (
          <li key={owner.id}>{owner.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminOwners;
