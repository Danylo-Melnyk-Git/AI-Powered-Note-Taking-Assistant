from flask import Blueprint, request, jsonify, send_from_directory, g, current_app
from utils.file_handler import save_file, allowed_file, MEDIA_DIR
import os
import sqlite3
from datetime import datetime
import hashlib
import asyncio
import aioredis

bp = Blueprint('notes', __name__)

def get_db():
    return sqlite3.connect(current_app.config['DATABASE'])

async def get_redis():
    redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
    return await aioredis.from_url(redis_url, encoding="utf-8", decode_responses=True)

def hash_content(content):
    return hashlib.sha256(content.encode('utf-8')).hexdigest()

async def process_note(user_id, content, compute_fn):
    redis = await get_redis()
    key = f"{user_id}:{hash_content(content)}"
    cached = await redis.get(key)
    if cached:
        return cached
    result = compute_fn(content)
    await redis.set(key, result, ex=300)
    return result

@bp.route('/notes', methods=['POST'])
def upload_note():
    user_id = g.user_id
    audio_file = request.files.get('audio_file')
    note_text = request.form.get('note_text')
    if not audio_file and not note_text:
        return jsonify({'error': 'No input provided'}), 400
    audio_filename = None
    if audio_file:
        try:
            audio_filename, file_path = save_file(audio_file)
        except Exception as e:
            return jsonify({'error': str(e)}), 400
    db = get_db()
    cur = db.cursor()
    cur.execute('''INSERT INTO notes (user_id, created_at, audio_file_path, note_text) VALUES (?, ?, ?, ?)''',
                (user_id, datetime.utcnow().isoformat(), audio_filename, note_text))
    note_id = cur.lastrowid
    db.commit()
    # TODO: Call processing pipeline and store results
    # Example usage (pseudo):
    # summary = await process_note(user_id, note_text, summarize_text)
    return jsonify({'id': note_id, 'audio_file': audio_filename}), 201

@bp.route('/media/<filename>', methods=['GET'])
def serve_media(filename):
    # Optionally: check user permissions here
    if not allowed_file(filename):
        return jsonify({'error': 'Invalid file type'}), 400
    return send_from_directory(MEDIA_DIR, filename, as_attachment=False)
