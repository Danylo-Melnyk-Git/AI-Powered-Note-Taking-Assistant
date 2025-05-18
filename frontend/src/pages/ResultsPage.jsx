import React, { useEffect, useState } from 'react';
import { getNoteById, getMediaUrl, deleteNote } from '../services/api';
import { Box, Typography, Paper, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import SkeletonLoader from '../components/Common/SkeletonLoader';
import ConfirmModal from '../components/Common/ConfirmModal';

// Results page for note details
export default function ResultsPage({ noteId }) {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (!noteId) return;
    setLoading(true);
    getNoteById(noteId).then(data => {
      setNote(data);
      setLoading(false);
    });
  }, [noteId]);

  const handleDownload = () => {
    if (!note?.audio_file_path) return;
    window.open(getMediaUrl(note.audio_file_path), '_blank');
  };

  const handleDelete = async () => {
    await deleteNote(noteId);
    setShowDelete(false);
    // Optionally: redirect or update UI
  };

  if (loading) return <SkeletonLoader lines={4} />;
  if (!note) return <Typography>No note found.</Typography>;

  return (
    <Paper sx={{ p: 3, maxWidth: 700, mx: 'auto' }}>
      <Typography variant="h6">Note Results</Typography>
      {note.audio_file_path && (
        <Box mt={2}>
          <Typography variant="subtitle2">Audio File:</Typography>
          <audio controls src={getMediaUrl(note.audio_file_path)} style={{ width: '100%' }} />
          <Box display="flex" gap={1} mt={1}>
            <Button startIcon={<DownloadIcon />} onClick={handleDownload} variant="outlined">Download</Button>
            <IconButton color="error" onClick={() => setShowDelete(true)}><DeleteIcon /></IconButton>
          </Box>
        </Box>
      )}
      {/* Add summary, keywords, topics, transcription display here */}
      <ConfirmModal open={showDelete} title="Delete Note" message="Are you sure you want to delete this note and its file?" onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
    </Paper>
  );
}
