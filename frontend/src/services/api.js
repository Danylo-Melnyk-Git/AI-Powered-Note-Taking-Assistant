import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// --- Auth ---
export async function loginUser(username, password) {
  const res = await axios.post(`${API_URL}/login`, { username, password });
  const token = res.data.token;
  localStorage.setItem('jwt_token', token);
  return token;
}

export async function registerUser(username, password) {
  const res = await axios.post(`${API_URL}/register`, { username, password });
  const token = res.data.token;
  if (token) localStorage.setItem('jwt_token', token);
  return token;
}

function authHeaders() {
  const token = localStorage.getItem('jwt_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// --- Notes ---
export async function uploadNote({ audioFile, noteText }) {
  const formData = new FormData();
  if (audioFile) formData.append('audio_file', audioFile);
  if (noteText) formData.append('note_text', noteText);
  const res = await axios.post(`${API_URL}/notes`, formData, {
    headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' },
  });
  return res.data; // { id, keywords, summary, topics, transcription, created_at }
}

export async function getAllNotes() {
  const res = await axios.get(`${API_URL}/notes`, { headers: authHeaders() });
  return res.data; // Array of { id, summary, created_at }
}

export async function getNoteById(id) {
  const res = await axios.get(`${API_URL}/notes/${id}`, { headers: authHeaders() });
  return res.data; // { id, keywords, summary, topics, transcription, created_at }
}

export function logoutUser() {
  localStorage.removeItem('jwt_token');
}

export function getMediaUrl(filename) {
  if (!filename) return null;
  return `${API_URL}/media/${filename}`;
}

export async function deleteNote(noteId) {
  // Implement backend endpoint for deletion if needed
  // Placeholder: return Promise.resolve()
  return Promise.resolve();
}

// --- Settings ---
export async function getUserSettings() {
  const res = await axios.get(`${API_URL}/settings`, { headers: authHeaders() });
  return res.data;
}

export async function updateUserSettings(settings) {
  const res = await axios.put(`${API_URL}/settings`, settings, { headers: authHeaders() });
  return res.data;
}

// --- Utility for error extraction ---
export function extractApiError(error) {
  if (error.response && error.response.data && error.response.data.error) {
    return error.response.data.error;
  }
  if (error.message) return error.message;
  return 'Unknown error';
}
