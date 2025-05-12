import React, { useState } from 'react';
import { getSummary } from '../services/api';

export default function SummaryComponent({ token, transcript }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = () => {
    setLoading(true);
    setError('');
    fetch('/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ transcript }),
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.summary) setSummary(data.summary);
        else setError(data.error || 'Unknown error');
      })
      .catch(() => {
        setLoading(false);
        setError('Network/server error');
      });
  };

  return (
    <div>
      <button onClick={handleSummarize} disabled={loading || !transcript} className="px-3 py-1 bg-blue-500 text-white rounded">
        {loading ? 'Summarizing...' : 'Summarize'}
      </button>
      {loading && <div className="spinner">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {summary && (
        <div className="mt-4">
          <h3 className="font-semibold">Summary:</h3>
          <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">{summary}</pre>
        </div>
      )}
    </div>
  );
}
