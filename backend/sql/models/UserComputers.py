from sql.db import db

class UserComputer(db.Model):
    __tablename__ = 'usuarios_computadoras'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    computer_id = db.Column(db.Integer, db.ForeignKey('computadoras.id'), nullable=False)
    
    def __repr__(self):
        return '<UserComputer %r>' % self.id
    
    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'computer_id': self.computer_id
        }