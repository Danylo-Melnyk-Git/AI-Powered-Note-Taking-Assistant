import React, { useEffect, useState } from 'react';
import { getNoteById, extractApiError } from '../services/api';

// Get keywords for note
// noteId: string
// Returns: list of keywords
// Usage: <KeywordList noteId={id} />
export default function KeywordList({ noteId }) {
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    if (!noteId) return;
    setLoading(true);
    setError('');
    console.log('[KeywordList] Start fetching transcript for noteId:', noteId);
    // First, get transcript
    getNoteById(noteId)
      .then(data => {
        const transcriptText = data.transcript || '';
        setTranscript(transcriptText);
        console.log('[KeywordList] Got transcript:', transcriptText);
        // Then POST to /keywords
        console.log('[KeywordList] POST /keywords', { transcript: transcriptText });
        return fetch('/keywords', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('jwt_token') ? { 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}` } : {})
          },
          body: JSON.stringify({ transcript: transcriptText })
        });
      })
      .then(res => {
        console.log('[KeywordList] /keywords response status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('[KeywordList] /keywords response data:', data);
        const rawKeywords = data.keywords || [];
        const normalized = rawKeywords.map(kw => typeof kw === 'string' ? kw : kw.value || JSON.stringify(kw));
        setKeywords(normalized);
        setLoading(false);
      })
      .catch(err => {
        console.error('[KeywordList] error:', err);
        const errMsg = extractApiError(err);
        setError(errMsg);
        setLoading(false);
      });
  }, [noteId]);

  return (
    <div>
      {loading && <div className="spinner">Loading...</div>}
      {error && (
        <div className="error text-red-600">{typeof error === 'string' ? error : JSON.stringify(error)}</div>
      )}
      {keywords.length > 0 && (
        <ul className="mt-4 list-disc list-inside">
          {keywords.map((kw, i) => (
            <li key={i}>{kw}</li>
          ))}
        </ul>
      )}
      {!loading && !error && keywords.length === 0 && <div>No keywords extracted.</div>}
    </div>
  );
}
