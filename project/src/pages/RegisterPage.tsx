import React from 'react';
import { Navigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  // Redirect to login page since we're handling both login and register there
  return <Navigate to="/login" replace />;
};

export default RegisterPage;