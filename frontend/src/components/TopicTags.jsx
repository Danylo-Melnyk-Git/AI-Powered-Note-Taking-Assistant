import React, { useEffect, useState } from 'react';
import { getNoteById, extractApiError } from '../services/api';

// Get topics for note
// noteId: string
// Returns: list of topics
// Usage: <TopicTags noteId={id} />
export default function TopicTags({ noteId }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    if (!noteId) return;
    setLoading(true);
    setError('');
    console.log('[TopicTags] Start fetching transcript for noteId:', noteId);
    // Сначала получаем transcript
    getNoteById(noteId)
      .then(data => {
        const transcriptText = data.transcript || '';
        setTranscript(transcriptText);
        console.log('[TopicTags] Got transcript:', transcriptText);
        // Затем делаем POST на /topics
        console.log('[TopicTags] POST /topics', { transcript: transcriptText });
        return fetch('/topics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('jwt_token') ? { 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}` } : {})
          },
          body: JSON.stringify({ transcript: transcriptText })
        });
      })
      .then(res => {
        console.log('[TopicTags] /topics response status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('[TopicTags] /topics response data:', data);
        setTopics(data.topics || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('[TopicTags] error:', err);
        setError(extractApiError(err));
        setLoading(false);
      });
  }, [noteId]);

  return (
    <div>
      {loading && <div className="spinner">Loading...</div>}
      {error && <div className="error text-red-600">{error}</div>}
      {topics.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {topics.map((tag, i) => (
            <span key={i} className="bg-green-200 text-green-800 px-2 py-1 rounded text-sm">{tag}</span>
          ))}
        </div>
      )}
      {!loading && !error && topics.length === 0 && <div>No topics identified.</div>}
    </div>
  );
}
