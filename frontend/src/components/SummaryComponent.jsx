import React, { useEffect, useState } from 'react';
import { getNoteById, extractApiError } from '../services/api';

export default function SummaryComponent({ noteId }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!noteId) return;
    setLoading(true);
    setError('');
    getNoteById(noteId)
      .then(data => {
        setSummary(data.summary || '');
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
