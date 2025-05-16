from flask import Blueprint, request, jsonify, g, current_app
import sqlite3
from models.user import User

bp = Blueprint('user', __name__)

def get_db():
    return sqlite3.connect(current_app.config['DATABASE'])

@bp.route('/settings', methods=['GET'])
def get_settings():
    user_id = g.user_id
    db = get_db()
    cur = db.cursor()
    cur.execute('SELECT theme_preference, notification_level, email, name FROM users WHERE id = ?', (user_id,))
    row = cur.fetchone()
    if not row:
        return jsonify({'error': 'User not found'}), 404
    settings = {
        'theme_preference': row[0] or 'light',
        'notification_level': row[1] or 'all',
        'email': row[2],
        'name': row[3]
    }
    return jsonify(settings)

@bp.route('/settings', methods=['PUT'])
def update_settings():
    user_id = g.user_id
    data = request.json
    theme = data.get('theme_preference')
    notification = data.get('notification_level')
    email = data.get('email')
    name = data.get('name')
    db = get_db()
    cur = db.cursor()
    cur.execute('''UPDATE users SET theme_preference=?, notification_level=?, email=?, name=? WHERE id=?''',
                (theme, notification, email, name, user_id))
    db.commit()
    return jsonify({'message': 'Settings updated'})
