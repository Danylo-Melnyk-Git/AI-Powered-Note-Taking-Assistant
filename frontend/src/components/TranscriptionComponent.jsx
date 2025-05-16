import React, { useState } from 'react';
import { uploadNote, getNoteById, extractApiError } from '../services/api';
import { Button, Typography, Paper, Box, Input, CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack';
import SkeletonLoader from './Common/SkeletonLoader';

export default function TranscriptionComponent({ onNoteCreated }) {
  const [file, setFile] = useState(null);
  const [noteId, setNoteId] = useState('');
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setTranscript('');
    setNoteId('');
    try {
      const note = await uploadNote({ audioFile: file });
      setNoteId(note.id);
      if (onNoteCreated) onNoteCreated(note.id);
      // Fetch transcription
      const details = await getNoteById(note.id);
      setTranscript(details.transcription || '');
      setLoading(false);
      enqueueSnackbar('Transcription complete', { variant: 'success' });
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(extractApiError(err), { variant: 'error' });
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" mb={2}>Upload Audio for Transcription</Typography>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Input type="file" inputProps={{ accept: 'audio/*' }} onChange={handleFileChange} disabled={loading} />
        <Button onClick={handleUpload} disabled={loading || !file} variant="contained" color="primary">
          {loading ? <CircularProgress size={24} /> : 'Upload & Transcribe'}
        </Button>
      </Box>
      {loading && <SkeletonLoader lines={3} />}
      {transcript && (
        <Box mt={3}>
          <Typography variant="subtitle1" fontWeight={600}>Transcription:</Typography>
          <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: 'background.default' }}>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{transcript}</Typography>
          </Paper>
        </Box>
      )}
      {!loading && !transcript && (
        <Typography variant="body2" color="text.secondary" mt={2}>No transcription available.</Typography>
      )}
    </Paper>
  );
}
