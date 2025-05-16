from flask import Blueprint, request, jsonify, current_app
from models.user import User
import jwt
import sqlite3
from datetime import datetime, timedelta

bp = Blueprint('auth', __name__)

# Helper: get db connection
def get_db():
    return sqlite3.connect(current_app.config['DATABASE'])

@bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    db = get_db()
    cur = db.cursor()
    cur.execute('SELECT id FROM users WHERE username = ?', (username,))
    if cur.fetchone():
        return jsonify({'error': 'Username already exists'}), 409
    password_hash = User.hash_password(password)
    cur.execute('INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?)',
                (username, password_hash, datetime.utcnow().isoformat()))
    db.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    db = get_db()
    cur = db.cursor()
    cur.execute('SELECT id, password_hash FROM users WHERE username = ?', (username,))
    row = cur.fetchone()
    if not row:
        return jsonify({'error': 'Invalid credentials'}), 401
    user = User(id=row[0], username=username, password_hash=row[1])
    if not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401
    payload = {
        'user_id': user.id,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }
    token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')
    return jsonify({'token': token})
