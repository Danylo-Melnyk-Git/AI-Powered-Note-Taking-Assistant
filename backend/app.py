import os
import logging
import jwt
import sqlite3
from functools import wraps
from flask import Flask, jsonify, request, g, after_this_request, make_response
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
    get_jwt,
    create_refresh_token,
)
from dotenv import load_dotenv
import uuid
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# --- Sentry integration ---
import sentry_sdk
sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    traces_sample_rate=1.0,
    environment=os.getenv("ENV")
)

from models.keyword_extractor import extract_keywords as extract_keywords_fn
from models.summarizer import summarize as summarize_text
from models.transcriber import transcribe
from models.topic_classifier import classify_topics as classify_topics_fn
from routes.auth import bp as auth_bp
from routes.notes import bp as notes_bp
from routes.user import bp as user_bp
from utils.storage import download_file, upload_file

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET") or "dev-secret"
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY") or os.getenv("JWT_SECRET") or "dev-secret"
app.config['DATABASE'] = 'db.sqlite3'

# CORS with allowed origins from ENV
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
CORS(app, origins=ALLOWED_ORIGINS, supports_credentials=True)

# Rate limiter
limiter = Limiter(get_remote_address, app=app, default_limits=["200 per day", "50 per hour"])

jwt = JWTManager(app)

# --- Request ID Middleware ---
@app.before_request
def add_request_id():
    request_id = str(uuid.uuid4())
    g.request_id = request_id
    @after_this_request
    def add_request_id_header(response):
        response.headers['X-Request-ID'] = request_id
        return response

# Patch logger to always include request_id if present
def request_id_filter(record):
    record.request_id = getattr(g, 'request_id', '-')
    return True

class RequestIdFilter(logging.Filter):
    def filter(self, record):
        if not hasattr(record, 'request_id'):
            record.request_id = '-'
        return True

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(name)s [%(request_id)s] %(message)s',
)
logger = logging.getLogger(__name__)
for handler in logging.getLogger().handlers:
    handler.addFilter(RequestIdFilter())


# --- JWT Middleware ---
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            parts = request.headers['Authorization'].split()
            if len(parts) == 2 and parts[0] == 'Bearer':
                token = parts[1]
        if not token:
            return jsonify({'error': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            g.user_id = data['user_id']
        except Exception:
            return jsonify({'error': 'Token is invalid!'}), 401
        return f(*args, **kwargs)
    return decorated


@app.route("/login", methods=["POST"])
@limiter.limit("10/minute")
def login():
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        if not username or not password:
            return jsonify({"msg": "Missing username or password"}), 400
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)
    except Exception as e:
        logger.exception("Login error")
        return jsonify({"error": str(e)}), 500


# POST /transcribe: Upload audio file → returns transcription ID
@app.route("/transcribe", methods=["POST"])
@jwt_required()
@limiter.limit("10/minute")
def transcribe_audio():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        file = request.files["file"]
        filename = file.filename
        local_path = f"/tmp/{filename}"
        file.save(local_path)
        transcript = transcribe(local_path)
        transcript_id = os.path.splitext(filename)[0]
        # Save transcript to S3/local
        with open(f"/tmp/{transcript_id}.txt", "w", encoding="utf-8") as f:
            f.write(transcript)
        upload_file(f"/tmp/{transcript_id}.txt", f"transcripts/{transcript_id}.txt")
        return jsonify({"id": transcript_id})
    except Exception as e:
        logger.exception("Transcription error")
        return jsonify({"error": str(e)}), 500


# GET /transcript/<id>: Returns full transcript
@app.route("/transcript/<id>", methods=["GET"])
@jwt_required()
def get_transcript(id):
    try:
        file_key = f"transcripts/{id}.txt"
        local_path = f"/tmp/{id}_downloaded.txt"
        download_file(file_key, local_path)
        with open(local_path, "r", encoding="utf-8") as f:
            transcript = f.read()
        return jsonify({"transcript": transcript})
    except Exception as e:
        logger.exception("Get transcript error")
        return jsonify({"error": str(e)}), 500


# POST /summarize: Body { transcript: string } → returns summary
@app.route("/summarize", methods=["POST"])
@jwt_required()
def summarize():
    try:
        data = request.get_json()
        transcript = data.get("transcript")
        if not transcript:
            return jsonify({"error": "Missing transcript"}), 400
        summary = summarize_text(transcript)
        return jsonify({"summary": summary})
    except Exception as e:
        logger.exception("Summarize error")
        return jsonify({"error": str(e)}), 500


# POST /keywords: Body { transcript: string } → returns keyword list
@app.route("/keywords", methods=["POST"])
@jwt_required()
def extract_keywords():
    try:
        data = request.get_json()
        transcript = data.get("transcript")
        if not transcript:
            return jsonify({"error": "Missing transcript"}), 400
        keywords = extract_keywords_fn(transcript)
        return jsonify({"keywords": keywords})
    except Exception as e:
        logger.exception("Keyword extraction error")
        return jsonify({"error": str(e)}), 500


# POST /topics: Body { transcript: string } → returns topic tags
@app.route("/topics", methods=["POST"])
@jwt_required()
def classify_topics():
    try:
        data = request.get_json()
        transcript = data.get("transcript")
        if not transcript:
            return jsonify({"error": "Missing transcript"}), 400
        topics = classify_topics_fn(transcript)
        return jsonify({"topics": topics})
    except Exception as e:
        logger.exception("Topic classification error")
        return jsonify({"error": str(e)}), 500


@app.route("/save", methods=["POST"])
@jwt_required()
def save_transcript():
    try:
        data = request.get_json()
        transcript_id = data.get("id")
        transcript = data.get("transcript")
        if not transcript_id or not transcript:
            return jsonify({"error": "Missing id or transcript"}), 400
        file_path = f"/tmp/{transcript_id}.txt"
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(transcript)
        upload_file(file_path, f"transcripts/{transcript_id}.txt")
        return jsonify({"status": "saved"})
    except Exception as e:
        logger.exception("Save transcript error")
        return jsonify({"error": str(e)}), 500


@app.route("/load/<id>", methods=["GET"])
@jwt_required()
def load_transcript(id):
    try:
        file_key = f"transcripts/{id}.txt"
        local_path = f"/tmp/{id}_downloaded.txt"
        download_file(file_key, local_path)
        with open(local_path, "r", encoding="utf-8") as f:
            transcript = f.read()
        return jsonify({"transcript": transcript})
    except Exception as e:
        logger.exception("Load transcript error")
        return jsonify({"error": str(e)}), 500


# --- JWT Refresh Token Endpoint ---
@app.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    try:
        identity = get_jwt_identity()
        access_token = create_access_token(identity=identity)
        refresh_token = create_refresh_token(identity=identity)
        resp = make_response(jsonify({"access_token": access_token}))
        set_access_cookies(resp, access_token)
        set_refresh_cookies(resp, refresh_token)
        return resp
    except Exception as e:
        logger.exception("Refresh token error")
        resp = make_response(jsonify({"error": str(e)}), 401)
        unset_jwt_cookies(resp)
        return resp


# Register auth blueprint
app.register_blueprint(auth_bp)
app.register_blueprint(notes_bp)
app.register_blueprint(user_bp)

# --- Ensure users table has settings fields ---
def migrate_users_table():
    db = sqlite3.connect(app.config['DATABASE'])
    db.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL,
        theme_preference TEXT DEFAULT 'light',
        notification_level TEXT DEFAULT 'all',
        email TEXT,
        name TEXT
    )''')
    db.commit()
    db.close()

migrate_users_table()

# --- Ensure /media directory exists ---
MEDIA_DIR = os.path.join(os.path.dirname(__file__), 'media')
os.makedirs(MEDIA_DIR, exist_ok=True)

# Example: Protect /notes endpoints
@app.route('/notes', methods=['GET', 'POST'])
@token_required
def notes():
    return jsonify({'message': 'Notes endpoint (protected)'}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
