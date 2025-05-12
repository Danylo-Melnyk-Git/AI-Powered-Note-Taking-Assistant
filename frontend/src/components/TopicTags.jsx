import React, { useState } from 'react';
import { getTopics } from '../services/api';

export default function TopicTags({ token, transcript }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClassify = () => {
    setLoading(true);
    setError('');
    fetch('/topics', {
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
        if (data.topics) setTopics(data.topics);
        else setError(data.error || 'Unknown error');
      })
      .catch(() => {
        setLoading(false);
        setError('Network/server error');
      });
  };

  return (
    <div>
      <button onClick={handleClassify} disabled={loading || !transcript} className="px-3 py-1 bg-blue-500 text-white rounded">
        {loading ? 'Classifying...' : 'Classify Topics'}
      </button>
      {loading && <div className="spinner">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {topics.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {topics.map((tag, i) => (
            <span key={i} className="bg-green-200 text-green-800 px-2 py-1 rounded text-sm">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}
