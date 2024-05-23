# /backend/db.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    db.init_app(app)
    
    with app.app_context():
        db.create_all()
        
        # mudar las compus de los usuarios a las nuevas tablas
        # from sql.models.Users import Users
        # from sql.models.Computers import Computadoras
        # from sql.models.UserComputers import UserComputer
        
        # for user in Users.query.all():
        #     # Buscar las compus de los usuarios actuales en la tabla Usuarios segun marca, modelo y serie
        #     # Asignar estas computadoras a la tabla computadoras y a la tabla usuarios_computadoras
        #     computer = Computadoras.query.filter_by(marca=user.marca, modelo=user.modelo, serie=user.serie).first()
        #     if computer:
        #         user_computer = UserComputer(user_id=user.id, computer_id=computer.id)
        #         db.session.add(user_computer)
        #         db.session.commit()
        #     else:
        #         computer = Computadoras(marca=user.marca, modelo=user.modelo, serie=user.serie)
        #         db.session.add(computer)
        #         db.session.commit()
        #         user_computer = UserComputer(user_id=user.id, computer_id=computer.id)
        #         db.session.add(user_computer)
        # create administrator user if not exists
        from sql.models.UserAuth import UserAuth

        try:
            from datetime import datetime
            from werkzeug.security import generate_password_hash

            if UserAuth.query.count() == 0:
                user = UserAuth(username='admin',
                                password=generate_password_hash('admin'), 
                                role='admin', 
                                created_at=datetime.now(), 
                                updated_at=datetime.now())
                db.session.add(user)
                db.session.commit()
                print('Usuario administrador creado')
        except Exception as e:
            print('No se pudo crear el usuario administrador: ', e)

        # mgirating accesories
        from sql.models.Accessories import Accessories
        from sql.models.UserAccessories import UserAccessories

        if Accessories.query.count() == 0:
            print('No hay accesorios')
        else:
            for accesory in Accessories.query.all():
                user_accesory = UserAccessories(user_id=accesory.workday_id, accessory_id=accesory.id)
                db.session.add(user_accesory)
            
            db.session.commit()

    return db