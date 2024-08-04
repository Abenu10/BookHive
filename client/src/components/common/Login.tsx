import React from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div>
      <h1>Login</h1>
      <button onClick={onLogin}>Login</button>
    </div>
  );
};

export default Login;
