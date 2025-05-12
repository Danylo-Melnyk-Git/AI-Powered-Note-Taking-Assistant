import React, { useState } from 'react';
import { uploadAudio, getTranscript, saveTranscriptToCloud, loadTranscriptFromCloud } from '../services/api';

export default function TranscriptionComponent({ token, onTranscribed }) {
  const [file, setFile] = useState(null);
  const [transcriptionId, setTranscriptionId] = useState('');
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [cloudStatus, setCloudStatus] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setTranscript('');
    setTranscriptionId('');
    setError('');
    try {
      const id = await uploadAudio(file);
      setTranscriptionId(id);
      setPolling(true);
      pollTranscript(id);
    } catch (err) {
      setLoading(false);
      setError('Upload failed.');
    }
  };

  const pollTranscript = async (id, attempts = 0) => {
    if (attempts > 20) {
      setPolling(false);
      setTranscript('Transcription timed out.');
      return;
    }
    try {
      const text = await getTranscript(id);
      if (text && text !== 'dummy transcript') {
        setTranscript(text);
        setPolling(false);
      } else {
        setTimeout(() => pollTranscript(id, attempts + 1), 2000);
      }
    } catch {
      setTimeout(() => pollTranscript(id, attempts + 1), 2000);
    }
  };

  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleFileChange} disabled={loading} />
      <button onClick={handleUpload} disabled={loading || !file} className="ml-2 px-3 py-1 bg-blue-500 text-white rounded">
        {loading ? 'Uploading...' : 'Upload & Transcribe'}
      </button>
      {loading && <div className="spinner">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {polling && <div className="mt-2 text-gray-500">Transcribing...</div>}
      {transcript && (
        <div className="mt-4">
          <h3 className="font-semibold">Transcript:</h3>
          <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">{transcript}</pre>
          <div className="flex gap-2 mt-2">
            <button
              className="px-3 py-1 bg-green-600 text-white rounded"
              onClick={async () => {
                setCloudStatus('Saving...');
                try {
                  await saveTranscriptToCloud(transcriptionId, transcript);
                  setCloudStatus('Saved to cloud!');
                } catch {
                  setCloudStatus('Save failed.');
                }
              }}
            >Save to Cloud</button>
            <button
              className="px-3 py-1 bg-purple-600 text-white rounded"
              onClick={async () => {
                setCloudStatus('Loading...');
                try {
                  const loaded = await loadTranscriptFromCloud(transcriptionId);
                  setTranscript(loaded);
                  setCloudStatus('Loaded from cloud!');
                } catch {
                  setCloudStatus('Load failed.');
                }
              }}
            >Load from Cloud</button>
            {cloudStatus && <span className="ml-2 text-sm">{cloudStatus}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
