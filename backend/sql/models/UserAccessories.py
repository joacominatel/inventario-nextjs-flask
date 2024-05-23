from sql.db import db

class UserAccessories(db.Model):
    __tablename__ = 'usuarios_accessories'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    accessory_id = db.Column(db.Integer, nullable=False)
    ticket = db.Column(db.String(100), nullable=True, default='No tiene')

    def __repr__(self):
        return '<UserAccessory %r>' % self.id
    
    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'accessory_id': self.accessory_id
        }