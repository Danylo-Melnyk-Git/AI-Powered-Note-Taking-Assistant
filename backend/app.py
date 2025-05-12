import os
import logging

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt_identity,
    jwt_required,
)
from utils.storage import download_file, upload_file
from models.transcriber import transcribe
from models.summarizer import summarize as summarize_text
from models.keyword_extractor import extract_keywords as extract_keywords_fn
from models.topic_classifier import classify_topics as classify_topics_fn

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)

# Restrict CORS to frontend domain (replace with actual domain in production)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET") or "dev-secret"
jwt = JWTManager(app)

# Configure logging with timestamps
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(name)s %(message)s',
)
logger = logging.getLogger(__name__)


@app.route("/login", methods=["POST"])
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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
