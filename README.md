# AI Note Assistant

AI Note Assistant is a web application for uploading, transcribing, summarizing, and organizing audio notes using AI.

## Requirements
- Python 3.9+
- Node.js 18+
- Docker & docker-compose (optional, for full stack)

## Setup

### Backend
```sh
cd backend
python -m venv venv
. venv/Scripts/activate  # or source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Edit with your API keys and config
python app.py
```

### Frontend
```sh
cd frontend
npm install
cp .env.example .env  # Edit with your API URL and config
npm run dev
```

### Docker Compose (Full Stack)
```sh
docker-compose up --build
```

## How It Works
- Register or log in.
- Upload an audio note (mp3 or wav).
- The app transcribes, summarizes, and extracts keywords/topics from your note.
- View results and manage your notes in the dashboard.
- Change user settings (theme, notifications, profile) in the Settings page.

## Environment Variables
- See `.env.example` in both `backend/` and `frontend/` for required configuration.

## Testing
- Backend: `cd backend && pytest`
- Frontend: `cd frontend && npm test`

## Documentation
See `docs/PROJECT_DOCUMENTATION.md` for full API, architecture, and deployment details.