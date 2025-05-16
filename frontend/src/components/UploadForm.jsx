import React, { useState } from 'react';
import { uploadNote, extractApiError } from '../services/api';
import { Button, Box, Typography, Paper, Input, CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack';

export default function UploadForm({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const note = await uploadNote({ audioFile: file });
      setLoading(false);
      enqueueSnackbar('File uploaded successfully', { variant: 'success' });
      if (onUploaded) onUploaded(note);
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(extractApiError(err), { variant: 'error' });
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" mb={2}>Upload Audio Note</Typography>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Input type="file" inputProps={{ accept: '.mp3,.wav,audio/*' }} onChange={handleFileChange} disabled={loading} />
        <Button onClick={handleUpload} disabled={loading || !file} variant="contained" color="primary">
          {loading ? <CircularProgress size={24} /> : 'Upload'}
        </Button>
      </Box>
      {file && (
        <Box mt={2}>
          <Typography variant="body2">Selected file: <b>{file.name}</b> ({Math.round(file.size / 1024)} KB)</Typography>
        </Box>
      )}
    </Paper>
  );
}
