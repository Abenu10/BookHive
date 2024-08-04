import React from 'react';

interface SignupProps {
  onSignup: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup }) => {
  return (
    <div>
      <h1>Signup</h1>
      <button onClick={onSignup}>Signup</button>
    </div>
  );
};

export default Signup;
