import React from 'react';
import LoginForm from '../components/LoginForm';

// Login page wrapper
export default function LoginPage({ onLogin }) {
  return <LoginForm onLogin={onLogin} />;
}
