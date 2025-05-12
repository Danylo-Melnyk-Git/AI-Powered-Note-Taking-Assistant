import React, { useState } from 'react';
import { getKeywords } from '../services/api';

export default function KeywordList({ token, transcript }) {
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExtract = () => {
    setLoading(true);
    setError('');
    fetch('/keywords', {
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
        if (data.keywords) setKeywords(data.keywords);
        else setError(data.error || 'Unknown error');
      })
      .catch(() => {
        setLoading(false);
        setError('Network/server error');
      });
  };

  return (
    <div>
      <button onClick={handleExtract} disabled={loading || !transcript} className="px-3 py-1 bg-blue-500 text-white rounded">
        {loading ? 'Extracting...' : 'Extract Keywords'}
      </button>
      {loading && <div className="spinner">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {keywords.length > 0 && (
        <ul className="mt-4 list-disc list-inside">
          {keywords.map((kw, i) => (
            <li key={i}>{kw}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
