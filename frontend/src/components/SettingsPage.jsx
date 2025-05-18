import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, TextField, Button, FormControlLabel, Switch, MenuItem, Select } from '@mui/material';
import { useUser } from '../context/UserContext';
import { useSnackbar } from 'notistack';

// Settings page for user prefs
export default function SettingsPage() {
  const { settings, saveSettings, loading } = useUser();
  const [form, setForm] = useState({ theme_preference: 'light', notification_level: 'all', email: '', name: '' });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? (checked ? 'dark' : 'light') : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveSettings(form);
    enqueueSnackbar('Settings saved', { variant: 'success' });
  };

  return (
    <Paper elevation={2} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" mb={2}>User Settings</Typography>
      <form onSubmit={handleSubmit}>
        <FormControlLabel
          control={<Switch checked={form.theme_preference === 'dark'} onChange={handleChange} name="theme_preference" />}
          label="Dark Mode"
        />
        <Box mt={2}>
          <Typography variant="subtitle1">Notification Level</Typography>
          <Select
            name="notification_level"
            value={form.notification_level}
            onChange={handleChange}
            fullWidth
            sx={{ mt: 1 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="important">Important Only</MenuItem>
            <MenuItem value="none">None</MenuItem>
          </Select>
        </Box>
        <TextField
          label="Email"
          name="email"
          value={form.email || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Name"
          name="name"
          value={form.name || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={loading}>
          Save Settings
        </Button>
      </form>
    </Paper>
  );
}
