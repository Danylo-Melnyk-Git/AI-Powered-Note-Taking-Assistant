# AI Note Assistant MVP

## Description
AI Note Assistant is an AI-powered tool designed to streamline the process of capturing, organizing, and understanding spoken information. It provides:
- Audio upload & secure storage
- Speech-to-text transcription (AI-powered)
- Automated text summarization
- Keyword extraction from transcribed text
- Topic classification using ML models
- Modern web UI for user interaction and results display

## Prerequisites
- Python 3.9+
- Node.js 18+
- Docker & docker-compose

## Installation & Run Instructions

### Backend
```pwsh
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
# Edit .env with your API keys and config
python app.py
```

### Frontend
```pwsh
cd frontend
npm install
copy .env.example .env
# Edit .env with your API URL and config
npm run dev
```

## Docker & Deployment Overview

- To run both backend and frontend with Docker Compose:
  ```pwsh
  docker-compose up --build
  ```
- For production, see the deployment section for AWS Fargate/Heroku (backend) and Vercel/Netlify (frontend). Set environment variables as described in `.env.example` files for each service.

---

# AI Note Assistant

## 1. Project Overview & Motivation

AI Note Assistant is an AI-powered tool designed to streamline the process of capturing, organizing, and understanding spoken information. By leveraging state-of-the-art speech recognition and natural language processing, it enables users to upload audio notes, transcribe them into text, generate concise summaries, extract key concepts, and classify topics—all through an intuitive web interface.

**Problem Solved:**
- Manual note-taking is time-consuming and error-prone, especially in meetings, lectures, or interviews.
- Valuable insights are often lost in lengthy recordings or unstructured notes.
- There is a need for automated, accurate, and actionable note management to boost productivity and knowledge retention.

## 2. Goals & Objectives

**High-Level Goals:**
- Deliver a rapid MVP with core AI note-taking features.
- Architect the system for modularity and easy extensibility.
- Ensure cloud-native compatibility for scalable deployment.

**Measurable Objectives:**
- Achieve ≥95% accuracy in audio transcription for clear speech.
- Generate text summaries under 500 characters per note.
- Extract the top 10 most relevant keywords per note.
- Classify each note into one of at least 5 predefined topics.

## 3. Features

- Audio upload & secure storage
- Speech-to-text transcription (AI-powered)
- Automated text summarization
- Keyword extraction from transcribed text
- Topic classification using ML models
- Modern web UI for user interaction and results display

## 4. Technology Stack

**Backend:**
- Python 3.9+
- Flask or FastAPI
- OpenAI API (Whisper) or HuggingFace Transformers
- scikit-learn
- boto3 (AWS S3) or Firebase SDK

**Frontend:**
- React 18
- Vite or Create React App
- Axios
- Tailwind CSS

**Infrastructure:**
- Docker, docker-compose
- AWS S3 or Firebase for storage
- JWT for authentication

**Dev Tools:**
- Git
- pytest (backend testing)
- Jest (frontend testing)
- GitHub Actions (CI/CD)

## 5. Architecture & Project Structure

```
ai-note-assistant/
├── backend/                # Python backend API
│   ├── app.py              # Main API entrypoint
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile          # Backend Docker image
│   ├── .env.example        # Backend environment variables template
│   ├── models/             # ML/NLP models
│   │   ├── transcriber.py      # Speech-to-text logic
│   │   ├── summarizer.py       # Summarization logic
│   │   ├── keyword_extractor.py# Keyword extraction logic
│   │   └── topic_classifier.py # Topic classification logic
│   ├── utils/              # Utility modules
│   │   ├── config.py           # Config management
│   │   └── storage.py          # File storage helpers
│   └── tests/              # Backend tests
│       ├── test_transcriber.py
│       ├── test_summarizer.py
│       └── test_storage.py
├── frontend/               # React frontend
│   ├── package.json        # Frontend dependencies
│   ├── Dockerfile          # Frontend Docker image
│   ├── .env.example        # Frontend environment variables template
│   └── src/
│       ├── index.js            # App entrypoint
│       ├── App.jsx             # Main app component
│       ├── services/
│       │   └── api.js              # API calls
│       └── components/         # UI components
│           ├── TranscriptionComponent.jsx
│           ├── SummaryComponent.jsx
│           ├── KeywordList.jsx
│           └── TopicTags.jsx
├── docs/
│   └── API.md               # API documentation
├── docker-compose.yml       # Multi-container orchestration
└── README.md                # Project documentation
```

**Module Responsibilities:**
- `models/`: Core ML/NLP logic for transcription, summarization, keyword extraction, and topic classification.
- `utils/`: Configuration and storage utilities.
- `components/`: React UI components for displaying results.
- `services/`: Frontend API communication logic.

## 6. Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- Docker & docker-compose

### Step-by-Step Setup

```pwsh
# 1. Clone the repository (assume local folder)
cd path\to\your\projects
# (If not already in place)
# git clone <repo-url> ai-note-assistant
cd ai-note-assistant

# 2. Backend setup
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
# Edit .env with your API keys and config

# 3. Frontend setup
cd ..\frontend
npm install
copy .env.example .env
# Edit .env with your API URL and config

# 4. Run backend
cd ..\backend
python app.py

# 5. Run frontend
cd ..\frontend
npm run dev
```

## 7. Configuration & Environment Variables

### Backend `.env` keys
- `OPENAI_API_KEY` – OpenAI/Whisper API key
- `AWS_ACCESS_KEY_ID` – AWS S3 access key
- `AWS_SECRET_ACCESS_KEY` – AWS S3 secret
- `S3_BUCKET_NAME` – S3 bucket for audio storage
- `JWT_SECRET` – Secret for JWT authentication
- `ALLOWED_ORIGINS` – CORS origins

### Frontend `.env` keys
- `API_URL` – Backend API base URL
- `AUTH_TOKEN` – JWT token (if required)

### Example `.env.example` (Backend)
```
OPENAI_API_KEY=your-openai-key
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
S3_BUCKET_NAME=your-s3-bucket
JWT_SECRET=your-jwt-secret
ALLOWED_ORIGINS=http://localhost:5173
```

### Example `.env.example` (Frontend)
```
API_URL=http://localhost:8000
AUTH_TOKEN=your-jwt-token
```

## 8. Usage & Examples

### API Usage (example curl)

**Transcribe Audio:**
```sh
curl -X POST -F "file=@audio.wav" $API_URL/transcribe
```

**Summarize Text:**
```sh
curl -X POST -H "Content-Type: application/json" -d '{"text": "..."}' $API_URL/summarize
```

**Extract Keywords:**
```sh
curl -X POST -H "Content-Type: application/json" -d '{"text": "..."}' $API_URL/keywords
```

**Classify Topic:**
```sh
curl -X POST -H "Content-Type: application/json" -d '{"text": "..."}' $API_URL/classify
```

### Frontend UI Example (Axios)
```js
// src/services/api.js
import axios from 'axios';

export const transcribeAudio = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${process.env.API_URL}/transcribe`, formData);
};
```

### UI Screenshot
![UI Screenshot](docs/ui-screenshot.png)

## 9. Testing

### Backend
```pwsh
cd backend
.\venv\Scripts\Activate.ps1
pytest
```

### Frontend
```pwsh
cd frontend
npm test
```

**Test Coverage Goals:**
- ≥80% code coverage for core logic (transcription, summarization, extraction, classification)
- Unit and integration tests for all endpoints and UI components

## 10. Docker & Deployment

### Local Docker Compose
```pwsh
docker-compose up --build
```

### Deployment Steps

**Backend:**
- Build and push Docker image to AWS ECR or Docker Hub
- Deploy to AWS Fargate (or Heroku)
- Set environment variables in the cloud environment

**Frontend:**
- Build static site (`npm run build`)
- Deploy to Vercel or Netlify
- Set `API_URL` and other env vars in deployment dashboard

## 10.1. Production Deployment Instructions

### Deploying Backend to AWS Fargate (or Heroku)

**AWS Fargate:**
1. Build and push your backend Docker image to Amazon ECR:
   ```pwsh
   # Authenticate Docker to ECR
   aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com
   # Build and tag image
   docker build -t ai-note-backend ./backend
   docker tag ai-note-backend:latest <ecr_repo_url>:latest
   # Push image
   docker push <ecr_repo_url>:latest
   ```
2. In AWS ECS, create a new Fargate service using your pushed image.
3. Set environment variables in the ECS Task Definition (use values from your `.env.example`).
4. Expose port 8000 and configure a load balancer if needed.

**Heroku (alternative):**
1. Install the Heroku CLI and log in.
2. Create a new Heroku app:
   ```pwsh
   heroku create ai-note-backend
   ```
3. Add environment variables in the Heroku dashboard or via CLI:
   ```pwsh
   heroku config:set KEY=VALUE
   ```
4. Deploy using Docker:
   ```pwsh
   heroku container:push web -a ai-note-backend
   heroku container:release web -a ai-note-backend
   ```

### Deploying Frontend to Vercel (or Netlify)

**Vercel:**
1. Push your frontend code to GitHub/GitLab.
2. Import the repo in Vercel and select the `frontend/` directory as the project root.
3. Set environment variables in the Vercel dashboard (use keys from `.env.example`).
4. Deploy. Vercel will build and host your React app automatically.

**Netlify (alternative):**
1. Push your frontend code to GitHub/GitLab.
2. Import the repo in Netlify and select the `frontend/` directory as the project root.
3. Set environment variables in the Netlify dashboard (use keys from `.env.example`).
4. Set build command to `npm run build` and publish directory to `build`.
5. Deploy.

### Setting Up Environment Variables in Production
- **Backend:** Set all required keys (see `backend/.env.example`) in your cloud provider's environment variable settings (ECS Task Definition, Heroku Config Vars, etc.).
- **Frontend:** Set all required keys (see `frontend/.env.example`) in your frontend host's environment variable settings (Vercel, Netlify, etc.).
- Never commit secrets to source control. Use your provider's dashboard or CLI to set them securely.

## 11. Project Roadmap & Next Steps
- Real-time transcription and streaming
- Multi-speaker diarization
- Mobile app (React Native)
- User accounts and history
- Advanced analytics and search

## 12. Contributing & License

**Contributing Guidelines:**
- Use feature/ or fix/ branch prefixes
- Submit pull requests with clear descriptions
- Ensure all tests pass before PR review

**License:**

This project is licensed under the MIT License.

---

## Configuration

The project uses environment variables for secure configuration. Copy `.env.example` to `.env` in both `backend/` and `frontend/` and fill in your values.

**Backend .env variables:**
- `JWT_SECRET`: Secret key for JWT authentication.
- `OPENAI_API_KEY`: Your OpenAI API key for GPT/Whisper.
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`: AWS credentials for S3 storage.
- `S3_BUCKET_NAME`: S3 bucket for transcripts.
- `FRONTEND_ORIGIN`: Allowed CORS origin (e.g., `http://localhost:3000`).

**Frontend .env variables:**
- (Add any required frontend variables here.)

---

## Testing

### Backend
- **Unit/Integration:**
  ```sh
  cd backend
  pytest --maxfail=1 --disable-warnings --cov=.
  ```
- **Lint/Format:**
  ```sh
  black . --check && isort . --check && flake8
  ```

### Frontend
- **Unit:**
  ```sh
  cd frontend
  npm test -- --coverage
  ```
- **Lint:**
  ```sh
  npm run lint
  ```
- **E2E:**
  ```sh
  cd frontend
  npx cypress open
  # or
  npx cypress run
  ```

---

## CI

![CI](https://github.com/<your-org-or-username>/ai-note-assistant/actions/workflows/ci.yml/badge.svg)

Automated tests and linting run on every push and PR via GitHub Actions. [View workflow](.github/workflows/ci.yml)

---

## Pre-commit Hooks

To ensure code quality before every commit, install pre-commit hooks:

```sh
pip install pre-commit
pre-commit install
```

This will auto-run Black, isort, and ESLint on staged files.

---
