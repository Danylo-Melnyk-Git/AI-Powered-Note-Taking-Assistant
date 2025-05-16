import React, { useEffect, useState } from 'react';
import { getNoteById, extractApiError } from '../services/api';

export default function TopicTags({ noteId }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!noteId) return;
    setLoading(true);
    setError('');
    getNoteById(noteId)
      .then(data => {
        setTopics(data.topics || []);
        setLoading(false);
      })
      .catch(err => {
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
