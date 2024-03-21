from sql.db import db

class Users(db.Model):
    """
    Users of the company.
    With the workday_id, the user can be identified.
    """
    __tablename__ = 'usuarios'

    id = db.Column(db.Integer, primary_key=True)
    workday_id = db.Column(db.String(10), unique=True, nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
    apellido = db.Column(db.String(100), nullable=False)
    marca = db.Column(db.String(100), nullable=False)
    modelo = db.Column(db.String(100), nullable=False)
    serie = db.Column(db.String(100), nullable=False)
    mail = db.Column(db.String(100), nullable=False)
    usuario = db.Column(db.String(100), unique=True, nullable=False)
    win11_installed = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

    def __repr__(self):
        return '<User %r>' % self.username
    
    def serialize(self):
        return {
            'id': self.id,
            'workday_id': self.workday_id,
            'nombre': self.nombre,
            'apellido': self.apellido,
            'marca': self.marca,
            'modelo': self.modelo,
            'serie': self.serie,
            'mail': self.mail,
            'usuario': self.usuario,
            'win11_installed': self.win11_installed,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }