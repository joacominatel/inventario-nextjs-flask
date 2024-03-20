from sql.db import db
from sql.models.Users import Users

class Accessories(db.Model):
    """
    Accessories of each User.
    Workday_id is the foreign key of Users.
    Each user can have many accessories, so is one row for each accessory.
    Maybe an user can have the same accessory, so the same accessory can be in many rows.
    Maybe user dont have any accessory, so the user dont have any row in this table.
    """
    __tablename__ = 'accesorios'

    id = db.Column(db.Integer, primary_key=True)
    workday_id = db.Column(db.String(10), db.ForeignKey('usuarios.workday_id'), nullable=False)
    accesorio = db.Column(db.String(100), nullable=False)
    detalle = db.Column(db.String(100), nullable=True)
    cantidad = db.Column(db.Integer, nullable=True, default=1)
    ticket = db.Column(db.String(100), nullable=True, default='No tiene')
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

    def __repr__(self):
        return '<Accessory %r>' % self.accesorio
    
    def serialize(self):
        return {
            'id': self.id,
            'workday_id': self.workday_id,
            'accesorio': self.accesorio,
            'detalle': self.detalle,
            'cantidad': self.cantidad,
            'ticket': self.ticket,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
    
    def serialize_with_user(self):
        user = Users.query.filter_by(workday_id=self.workday_id).first()
        return {
            'id': self.id,
            'workday_id': self.workday_id,
            'accesorio': self.accesorio,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'user': user.serialize()
        }