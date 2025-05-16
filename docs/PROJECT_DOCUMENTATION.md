# AI Note Assistant — Full Project Documentation

## Overview
AI Note Assistant is a full-stack web application for uploading, transcribing, summarizing, and organizing audio notes using AI. It features secure user authentication, file storage, and a modern, responsive UI.

---

## 1. Features
- User registration, login, JWT authentication
- Audio upload (.mp3, .wav), secure storage, and playback
- AI-powered speech-to-text transcription
- Automated summarization, keyword extraction, topic classification
- User settings (theme, notifications, profile)
- Responsive, accessible UI (Material UI)
- REST API with protected endpoints

---

## 2. Architecture

### Backend
- Python 3.9+, Flask
- SQLite (default), can be swapped for Postgres
- JWT for authentication
- File storage in `/media/`
- Modular routes: `auth`, `notes`, `user`
- Models: `user.py`, `transcriber.py`, `summarizer.py`, `keyword_extractor.py`, `topic_classifier.py`

### Frontend
- React 18, Material UI, notistack
- React Router for navigation
- Context for auth/user state
- API service layer for backend communication
- Cypress for E2E tests

---

## 3. API Reference

### Auth
- `POST /register` — Register new user `{username, password}`
- `POST /login` — Login, returns `{token}`

### Notes
- `POST /notes` — Upload note (audio/text), returns note info
- `GET /notes` — List user's notes
- `GET /notes/{id}` — Get note details (summary, keywords, topics, transcription)
- `GET /media/{filename}` — Download/stream uploaded audio

### User
- `GET /settings` — Get user settings
- `PUT /settings` — Update user settings

#### Auth
- All `/notes` and `/settings` endpoints require `Authorization: Bearer <token>`

---

## 4. Database Schema

### users
- id (PK)
- username (unique)
- password_hash
- created_at
- theme_preference
- notification_level
- email
- name

### notes
- id (PK)
- user_id (FK)
- created_at
- audio_file_path
- note_text

---

## 5. Environment Variables

### Backend (`backend/.env.example`)
- `JWT_SECRET` — Secret for JWT
- `OPENAI_API_KEY` — For AI models
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME` (if using S3)
- `ALLOWED_ORIGINS` — CORS

### Frontend (`frontend/.env.example`)
- `REACT_APP_API_URL` — Backend API base URL

---

## 6. Testing
- Backend: `pytest` for unit/integration
- Frontend: `npm test` for unit, `npx cypress open` for E2E
- Coverage goal: ≥70%

---

## 7. Deployment

### Local
- `docker-compose up --build` (runs backend and frontend)

### Production
- Backend: Deploy with Gunicorn or uWSGI, use production-ready Dockerfile
- Frontend: Deploy static build to Vercel/Netlify
- Set all required environment variables in your cloud provider

---

## 8. Security & Best Practices
- Passwords hashed with bcrypt
- JWT for all protected endpoints
- File uploads validated and sanitized
- Input validation on all endpoints
- CORS configured for frontend origin

---

## 9. User Preferences
- Theme and notification settings stored in backend and synced to frontend
- Profile info (email, name) editable in Settings

---

## 10. Contributing
- Use feature/fix branch prefixes
- Run all tests and linters before PR
- See code comments and docstrings for extension points

---

## 11. License
MIT License
