import React, { useState } from 'react';
import { registerUser, extractApiError } from '../services/api';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { useSnackbar } from 'notistack';

// Register page wrapper
export default function RegisterPage({ onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(username, password);
      setLoading(false);
      enqueueSnackbar('Registration successful! You are now logged in.', { variant: 'success' });
      if (onRegister) onRegister();
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(extractApiError(err), { variant: 'error' });
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="background.default">
      <Paper elevation={3} sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" fontWeight={700} mb={2} align="center">Register</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            disabled={loading}
            autoFocus
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            disabled={loading}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading || !username || !password}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
