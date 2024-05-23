from sql.db import db
from datetime import datetime
class UserAuth(db.Model):
    __tablename__ = 'user_auth'
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(255), default='user', nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now, onupdate=datetime.now)
    
    
    def __init__(self, username, password, role, created_at, updated_at):
        self.username = username
        self.password = password
        self.role = role
        self.created_at = created_at
        self.updated_at = updated_at
        
    def __repr__(self):
        return f'<UserAuth {self.username}>'