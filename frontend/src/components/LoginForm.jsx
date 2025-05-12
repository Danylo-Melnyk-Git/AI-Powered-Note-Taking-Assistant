import React, { useState } from 'react';
import { login } from '../services/api';

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      setLoading(false);
      if (data.access_token) onLogin(data.access_token);
      else setError(data.msg || data.error || 'Login failed');
    } catch {
      setLoading(false);
      setError('Network/server error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 bg-white rounded shadow mb-6">
      <h2 className="text-lg font-bold mb-2">Login</h2>
      <input
        className="w-full p-2 border rounded mb-2"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        disabled={loading}
      />
      <input
        className="w-full p-2 border rounded mb-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        disabled={loading}
      />
      <button className="w-full px-3 py-2 bg-blue-600 text-white rounded" disabled={loading || !username || !password}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {loading && <div className="spinner">Loading...</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
}