import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Authenticates a user and retrieves a JWT token.
 * @param {string} username - The user's username.
 * @param {string} password - The user's password.
 * @returns {Promise<string>} The JWT access token.
 */
export async function login(username, password) {
  const res = await axios.post(`${API_URL}/login`, { username, password });
  const token = res.data.access_token;
  localStorage.setItem('jwt_token', token);
  return token;
}

/**
 * Returns the authorization headers with JWT token if available.
 * @returns {Object} Authorization headers or empty object.
 */
function authHeaders() {
  const token = localStorage.getItem('jwt_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Uploads an audio file for transcription.
 * @param {File} file - The audio file to upload.
 * @returns {Promise<string>} The transcription job ID.
 */
export async function uploadAudio(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await axios.post(`${API_URL}/transcribe`, formData, {
    headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' },
  });
  return res.data.id;
}

/**
 * Retrieves the transcript for a given job ID.
 * @param {string} id - The transcription job ID.
 * @returns {Promise<string>} The transcript text.
 */
export async function getTranscript(id) {
  const res = await axios.get(`${API_URL}/transcript/${id}`, { headers: authHeaders() });
  return res.data.transcript;
}

/**
 * Gets a summary for a given transcript.
 * @param {string} transcript - The transcript text.
 * @returns {Promise<string>} The summary text.
 */
export async function getSummary(transcript) {
  const res = await axios.post(`${API_URL}/summarize`, { transcript }, { headers: authHeaders() });
  return res.data.summary;
}

/**
 * Extracts keywords from a transcript.
 * @param {string} transcript - The transcript text.
 * @returns {Promise<string[]>} Array of keywords.
 */
export async function getKeywords(transcript) {
  const res = await axios.post(`${API_URL}/keywords`, { transcript }, { headers: authHeaders() });
  return res.data.keywords;
}

/**
 * Extracts topics from a transcript.
 * @param {string} transcript - The transcript text.
 * @returns {Promise<string[]>} Array of topics.
 */
export async function getTopics(transcript) {
  const res = await axios.post(`${API_URL}/topics`, { transcript }, { headers: authHeaders() });
  return res.data.topics;
}

/**
 * Saves a transcript to the cloud.
 * @param {string} id - The transcript/job ID.
 * @param {string} transcript - The transcript text.
 * @returns {Promise<Object>} The response data from the server.
 */
export async function saveTranscriptToCloud(id, transcript) {
  const res = await axios.post(`${API_URL}/save`, { id, transcript }, { headers: authHeaders() });
  return res.data;
}

/**
 * Loads a transcript from the cloud by ID.
 * @param {string} id - The transcript/job ID.
 * @returns {Promise<string>} The transcript text.
 */
export async function loadTranscriptFromCloud(id) {
  const res = await axios.get(`${API_URL}/load/${id}`, { headers: authHeaders() });
  return res.data.transcript;
}
