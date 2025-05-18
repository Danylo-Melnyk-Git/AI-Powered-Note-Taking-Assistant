import axios from 'axios';
import React from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// API service for backend comm
// Handles auth, notes, user settings

// --- LOGGING INIT ---
console.log('[api.js] API_URL:', API_URL);
console.log('[api.js] JWT token at load:', localStorage.getItem('jwt_token'));

// --- Auth ---
export async function loginUser(username, password) {
  console.log('[api.js] loginUser', { username });
  try {
    const res = await axios.post(`${API_URL}/login`, { username, password });
    console.log('[api.js] loginUser response', res);
    const token = res.data.token;
    localStorage.setItem('jwt_token', token);
    return token;
  } catch (error) {
    console.error('[api.js] loginUser error', error);
    throw error;
  }
}

export async function registerUser(username, password) {
  console.log('[api.js] registerUser', { username });
  try {
    const res = await axios.post(`${API_URL}/register`, { username, password });
    console.log('[api.js] registerUser response', res);
    const token = res.data.token;
    if (token) localStorage.setItem('jwt_token', token);
    return token;
  } catch (error) {
    console.error('[api.js] registerUser error', error);
    throw error;
  }
}

function authHeaders() {
  const token = localStorage.getItem('jwt_token');
  console.log('[api.js] authHeaders, token:', token);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// --- Notes ---
export async function uploadNote({ audioFile }) {
  console.log('[api.js] uploadNote', { audioFile });
  const formData = new FormData();
  if (audioFile) formData.append('file', audioFile); // поле file, не audio_file
  try {
    const res = await axios.post(`${API_URL}/transcribe`, formData, {
      headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' },
    });
    console.log('[api.js] uploadNote response', res);
    return res.data; // { id }
  } catch (error) {
    console.error('[api.js] uploadNote error', error);
    throw error;
  }
}

export async function getAllNotes() {
  console.log('[api.js] getAllNotes');
  try {
    const res = await axios.get(`${API_URL}/notes`, { headers: authHeaders() });
    console.log('[api.js] getAllNotes response', res);
    return res.data;
  } catch (error) {
    console.error('[api.js] getAllNotes error', error);
    throw error;
  }
}

export async function getNoteById(id) {
  console.log('[api.js] getNoteById', { id });
  try {
    const res = await axios.get(`${API_URL}/transcript/${id}`, { headers: authHeaders() });
    console.log('[api.js] getNoteById response', res);
    return res.data; // { transcript }
  } catch (error) {
    console.error('[api.js] getNoteById error', error);
    throw error;
  }
}

export function logoutUser() {
  console.log('[api.js] logoutUser');
  localStorage.removeItem('jwt_token');
}

export function getMediaUrl(filename) {
  if (!filename) return null;
  const url = `${API_URL}/media/${filename}`;
  console.log('[api.js] getMediaUrl', url);
  return url;
}

export async function deleteNote(noteId) {
  console.log('[api.js] deleteNote', { noteId });
  // Implement backend endpoint for deletion if needed
  // Placeholder: return Promise.resolve()
  return Promise.resolve();
}

// --- Settings ---
export async function getUserSettings() {
  console.log('[api.js] getUserSettings');
  try {
    const res = await axios.get(`${API_URL}/settings`, { headers: authHeaders() });
    console.log('[api.js] getUserSettings response', res);
    return res.data;
  } catch (error) {
    console.error('[api.js] getUserSettings error', error);
    throw error;
  }
}

export async function updateUserSettings(settings) {
  console.log('[api.js] updateUserSettings', settings);
  try {
    const res = await axios.put(`${API_URL}/settings`, settings, { headers: authHeaders() });
    console.log('[api.js] updateUserSettings response', res);
    return res.data;
  } catch (error) {
    console.error('[api.js] updateUserSettings error', error);
    throw error;
  }
}

// --- Utility for error extraction ---
export function extractApiError(error) {
  // Логируем ошибку для диагностики
  console.log('extractApiError input:', error);
  if (!error) return 'Unknown error (empty)';
  if (typeof error === 'string') return error;
  if (typeof error === 'number') return error.toString();
  if (Array.isArray(error)) return error.map(e => extractApiError(e)).join(', ');
  if (error && error.response && error.response.data) {
    if (typeof error.response.data.error === 'string') {
      return error.response.data.error;
    }
    if (typeof error.response.data === 'string') {
      return error.response.data;
    }
    if (typeof error.response.data.error === 'object') {
      try {
        return JSON.stringify(error.response.data.error);
      } catch (e) {
        return 'Unknown error (error.response.data.error object)';
      }
    }
  }
  if (error && error.message && typeof error.message === 'string') return error.message;
  if (React.isValidElement(error)) return 'React element error';
  if (typeof error === 'object') {
    try {
      return JSON.stringify(error);
    } catch (e) {
      return 'Unknown object error';
    }
  }
  return String(error);
}
