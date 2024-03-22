from sql.db import db

class Computadoras(db.Model):
    __tablename__ = 'computadoras'
    
    id = db.Column(db.Integer, primary_key=True)
    marca = db.Column(db.String(100), nullable=False)
    modelo = db.Column(db.String(100), nullable=False)
    serie = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())
    
    def __repr__(self):
        return '<Computer %r>' % self.modelo
    
    def serialize(self):
        return {
            'id': self.id,
            'marca': self.marca,
            'modelo': self.modelo,
            'serie': self.serie,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }