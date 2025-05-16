import bcrypt
from datetime import datetime

class User:
    def __init__(self, id, username, password_hash, created_at=None, theme_preference='light', notification_level='all', email=None, name=None):
        self.id = id
        self.username = username
        self.password_hash = password_hash
        self.created_at = created_at or datetime.utcnow()
        self.theme_preference = theme_preference
        self.notification_level = notification_level
        self.email = email
        self.name = name

    @staticmethod
    def hash_password(password):
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def to_settings_dict(self):
        return {
            'theme_preference': self.theme_preference,
            'notification_level': self.notification_level,
            'email': self.email,
            'name': self.name
        }
