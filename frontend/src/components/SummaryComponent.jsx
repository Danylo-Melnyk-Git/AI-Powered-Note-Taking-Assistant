import React, { useEffect, useState } from 'react';
import { getNoteById, extractApiError } from '../services/api';

// Get summary for note
// noteId: string
// Returns: summary string
// Usage: <SummaryComponent noteId={id} />
export default function SummaryComponent({ noteId }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    if (!noteId) return;
    setLoading(true);
    setError('');
    console.log('[SummaryComponent] Start fetching transcript for noteId:', noteId);
    // Сначала получаем transcript
    getNoteById(noteId)
      .then(data => {
        const transcriptText = data.transcript || '';
        setTranscript(transcriptText);
        console.log('[SummaryComponent] Got transcript:', transcriptText);
        // Затем делаем POST на /summarize
        console.log('[SummaryComponent] POST /summarize', { transcript: transcriptText });
        return fetch('/summarize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('jwt_token') ? { 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}` } : {})
          },
          body: JSON.stringify({ transcript: transcriptText })
        });
      })
      .then(res => {
        console.log('[SummaryComponent] /summarize response status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('[SummaryComponent] /summarize response data:', data);
        setSummary(data.summary || '');
        setLoading(false);
      })
      .catch(err => {
        console.error('[SummaryComponent] error:', err);
        setError(extractApiError(err));
        setLoading(false);
      });
  }, [noteId]);

  return (
    <div>
      {loading && <div className="spinner">Loading...</div>}
      {error && <div className="error text-red-600">{error}</div>}
      {summary && (
        <div className="mt-4">
          <h3 className="font-semibold">Summary:</h3>
          <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">{summary}</pre>
        </div>
      )}
      {!loading && !error && !summary && <div>No summary available.</div>}
    </div>
  );
}
