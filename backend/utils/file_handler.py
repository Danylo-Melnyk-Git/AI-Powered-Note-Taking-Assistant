import os
import uuid
from werkzeug.utils import secure_filename
from flask import current_app

ALLOWED_EXTENSIONS = {'.mp3', '.wav'}

MEDIA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'media')
os.makedirs(MEDIA_DIR, exist_ok=True)

def allowed_file(filename):
    ext = os.path.splitext(filename)[1].lower()
    return ext in ALLOWED_EXTENSIONS

def save_file(file_storage):
    if not allowed_file(file_storage.filename):
        raise ValueError('Invalid file type')
    filename = secure_filename(file_storage.filename)
    ext = os.path.splitext(filename)[1].lower()
    unique_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(MEDIA_DIR, unique_name)
    file_storage.save(file_path)
    return unique_name, file_path
