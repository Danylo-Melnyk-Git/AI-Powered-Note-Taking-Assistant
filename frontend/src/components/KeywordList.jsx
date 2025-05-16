import React, { useEffect, useState } from 'react';
import { getNoteById, extractApiError } from '../services/api';

export default function KeywordList({ noteId }) {
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!noteId) return;
    setLoading(true);
    setError('');
    getNoteById(noteId)
      .then(data => {
        setKeywords(data.keywords || []);
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
