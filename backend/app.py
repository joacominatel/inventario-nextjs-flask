# Import generales
try:
    import flask, os
    from flask import Flask, request, jsonify
    from dotenv import load_dotenv
    from flask_cors import CORS

    # Import de modelos
    from sql.db import init_db, db
    from sql.models.Users import Users
    from sql.models.Accessories import Accessories
    from sql.models.Computers import Computadoras
    from sql.models.UserComputers import UserComputer

    from sqlalchemy.sql import func, and_, or_
    from sqlalchemy.exc import IntegrityError

except Exception as e:
    print(f"Error: {e}")

# Configuración de la app
app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configuración de la base de datos
load_dotenv('.env')

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'fallback-sqlalchemy-database-url')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

# Inicialización de la base de datos
db = init_db(app)

# Rutas
@app.route('/api/v1.0/users', methods=['GET'])
def users():
    try:
        users = Users.query.all()
        return jsonify([user.serialize() for user in users])
    except:
        return jsonify({'message': 'Error al obtener los usuarios'})

# search user by name
@app.route('/api/v1.0/users/<string:nombre>', methods=['GET'])
def search_user(nombre):
    try:
        nombre = nombre.strip().capitalize()  # Remove leading/trailing spaces and capitalize
        search_terms = nombre.split(' ')  # Split into individual search terms

        # Construct filter query using OR conditions for each term
        filters = []
        for term in search_terms:
            filters.append(or_(
                Users.nombre.like(f'%{term}%'),
                Users.apellido.like(f'%{term}%'),
                Users.mail.like(f'%{term}%')
            ))

        query = Users.query.filter(and_(*filters), Users.is_active == True).all()

        if not query:
            return jsonify({'message': 'Usuario no encontrado'})

        # Get computer data (assuming `computadora` is a relationship)
        for user in query:
            user.computadora = [computer.serialize() for computer in user.computadora_id]

        return jsonify([user.serialize() for user in query])

    except Exception as e:
        print(f"Error al obtener los usuarios: {e}")
        return jsonify({'message': 'Error al obtener los usuarios'}), 500
    
@app.route('/api/v1.0/usersDisabled/<string:nombre>', methods=['GET'])
def search_user_disabled(nombre):
    try:
        nombre = nombre.capitalize()
        users = Users.query.filter(and_(or_(
            Users.nombre.like(f'{nombre}%'),
            Users.apellido.like(f'{nombre}%'),
            Users.mail.like(f'{nombre}%')
        ), Users.is_active == False)).all()

        if len(users) == 0:
            return jsonify({'message': 'Usuario no encontrado'})

        return jsonify([user.serialize() for user in users])
    except:
        return jsonify({'message': 'Error al obtener los usuarios'})

    
@app.route('/api/v1.0/users/<int:id>', methods=['GET'])
def user(id):
    try:
        user = Users.query.get(id)
        return jsonify(user.serialize())
    except:
        return jsonify({'message': 'Error al obtener el usuario'})

@app.route('/api/v1.0/users', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        # print(f"Datos recibidos: {data}")
        
        marca = data.get('marca', '')
        modelo = data.get('modelo', '')
        serie = data.get('serie', '')
        
        computadora = Computadoras.query.filter_by(serie=serie).first()
        
        if not computadora:
            computadora = Computadoras(marca=marca, modelo=modelo, serie=serie)
            db.session.add(computadora)
            
        else:
            computadora.marca = marca
            computadora.modelo = modelo
            db.session.commit()
            
        del data['marca']
        del data['modelo']
        del data['serie']
        # check if the user already exists
        user = Users.query.filter_by(mail=data['mail']).first()
        
        if user:
            # replace the user's data
            user.nombre = data.get('nombre', user.nombre)
            user.apellido = data.get('apellido', user.apellido)
            user.workday_id = data.get('workday_id', user.workday_id)
            user.mail = data.get('mail', user.mail)
            
            db.session.add(user)
        else:
            user = Users(**data)
            db.session.add(user)
            
        # chequear si la computadora ya esta asignada a otro usuario
        existing_assignment = UserComputer.query.filter_by(computer_id=computadora.id).first()
        if existing_assignment and existing_assignment.user_id != user.id:
            # si la computadora ya esta asignada a otro usuario
            # se le asignara la computadora al nuevo usuario
            user_computer = UserComputer(user_id=user.id, computer_id=computadora.id)
            db.session.add(user_computer)
        elif existing_assignment and existing_assignment.user_id == user.id:
            # si la computadora ya esta asignada al usuario, no se hara nada
            pass
        else:
            # si la computadora no esta asignada a ningun usuario, se le asignara al nuevo usuario
            user_computer = UserComputer(user_id=user.id, computer_id=computadora.id)
            db.session.add(user_computer)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Usuario creado con éxito',
            'user': user.serialize()
            }, 200)
        
    except IntegrityError:
        db.session.rollback()
        return jsonify({'message': 'Error de integridad al crear el usuario'}), 500
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error al crear el usuario', 'error': str(e)}), 500
    
@app.route('/api/v1.0/userDeactivate/<int:id>', methods=['POST'])
def deactivate_user(id):
    try:
        user = Users.query.get(id)

        if not user:
            return jsonify({'message': 'Usuario no encontrado'}), 404
        
        if user.is_active == False:
            return jsonify({'message': 'El usuario ya se encuentra desactivado'}), 400
        
        nombre = user.nombre

        # get accessories
        try:
            accessories = Accessories.query.filter_by(workday_id=user.workday_id).all()
            for accessory in accessories:
                db.session.delete(accessory)
                db.session.commit()
        except:
            return jsonify({'message': 'Error al eliminar los accesorios'})
        
        # get computers
        try:
            computers = UserComputer.query.filter_by(user_id=user.id).all()
            for computer in computers:
                db.session.delete(computer)
                db.session.commit()
        except:
            return jsonify({'message': 'Error al eliminar las computadoras'})
                
        user.is_active = False
        user.updated_at = func.now()
        db.session.commit()
        
        return jsonify({'message': f'Usuario {nombre} desactivado'})
    except:
        return jsonify({'message': 'Error al desactivar el usuario'})
    
@app.route('/api/v1.0/userActivate/<int:id>', methods=['POST'])
def activate_user(id):
    try:
        user = Users.query.get(id)

        if not user:
            return jsonify({'message': 'Usuario no encontrado'}), 404
        
        nombre = user.nombre

        user.is_active = True
        user.updated_at = func.now()
        db.session.commit()
        
        return jsonify({'message': f'Usuario {nombre} activado'})
    except:
        return jsonify({'message': 'Error al activar el usuario'})

@app.route('/api/v1.0/users/<int:id>', methods=['PUT'])
def update_user(id):
    try:
        # Buscar al usuario por ID
        user = Users.query.get(id)
        
        if not user:
            return jsonify({'message': 'Usuario no encontrado'}), 404
        
        data = request.get_json()

        # Actualizar los atributos del usuario con los nuevos datos si están presentes
        user.nombre = data.get('nombre', user.nombre)
        user.apellido = data.get('apellido', user.apellido)
        user.mail = data.get('mail', user.mail)
        user.usuario = data.get('usuario', user.usuario)

        # Obtener los IDs de las computadoras asignadas del cuerpo de la solicitud
        computadoras_ids = data.get('computadoras_ids', [])

        # Limpiar asignaciones de computadoras que no están en la lista
        UserComputer.query.filter(UserComputer.user_id == id, ~UserComputer.computer_id.in_(computadoras_ids)).delete(synchronize_session=False)

        for computadora_id in computadoras_ids:
            # Buscar la computadora por ID
            computadora = Computadoras.query.get(computadora_id)

            if not computadora:
                return jsonify({'message': f'Computadora con ID {computadora_id} no encontrada'}), 404
                
            # Verificar si la computadora ya está asignada a otro usuario
            existing_assignment = UserComputer.query.filter_by(computer_id=computadora_id).first()
            if existing_assignment and existing_assignment.user_id != id:
                assigned_user = Users.query.get(existing_assignment.user_id)
                return jsonify({'message': f'La computadora ya está asignada a otro usuario: {assigned_user.nombre}'}), 201
            elif existing_assignment and existing_assignment.user_id == id:
                # Si la computadora ya está asignada al usuario, solo agregar la computadora que NO está asignada
                continue

            # Asignar la computadora al usuario
            user_computer = UserComputer(user_id=id, computer_id=computadora_id)
            db.session.add(user_computer)

        # Actualizar la fecha de modificación del usuario
        user.updated_at = func.now()

        # Confirmar los cambios en la base de datos
        db.session.commit()
        
        return jsonify(user.serialize())
    except IntegrityError:
        db.session.rollback()
        return jsonify({'message': 'Error de integridad al asignar la computadora al usuario'}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error al actualizar el usuario', 'error': str(e)}), 500
    
@app.route('/api/v1.0/users/<int:id>/force', methods=['POST'])
def forceUpdateComputer(id):
    try:
        data = request.get_json()
        
        # Obtener el ID de la computadora asignada del cuerpo de la solicitud
        computadoras_ids = data.get('computadoras_ids', [])
        
        for computadora_id in computadoras_ids:
            # eliminar todos los usuarios que ya tengan asignada la computadora
            UserComputer.query.filter_by(computer_id=computadora_id).delete()
            db.session.commit()

            # si el usuario tiene mas computadoras que las que se estan asignando, borrara las que no esten en la lista
            if len(UserComputer.query.filter_by(user_id=id).all()) > len(computadoras_ids):
                for user_computer in UserComputer.query.filter_by(user_id=id).all():
                    if user_computer.computer_id not in computadoras_ids:
                        UserComputer.query.filter_by(computer_id=user_computer.computer_id).delete()
                        db.session.commit()
                    else:
                        continue
                
            # asignar la computadora al usuario
            user_computer = UserComputer(user_id=id, computer_id=computadora_id)
            db.session.add(user_computer)
            db.session.commit()
            
        return jsonify({'message': 'Computadora actualizada'})
    except:
        return jsonify({'message': 'Error al actualizar la computadora', 'error': str(e)}), 500

# Accesorios rutas
@app.route('/api/v1.0/accessories', methods=['GET'])
def accessories():
    try:
        accessories = Accessories.query.all()
        return jsonify([accessory.serialize() for accessory in accessories])
    except Exception as e:
        return jsonify({'message': 'Error al obtener los accesorios', 'error': str(e)})

@app.route('/api/v1.0/accessories/<int:workday_id>', methods=['POST'])
def create_accessory(workday_id):
    try:
        data = request.get_json()
        accessory = Accessories(workday_id=workday_id, **data)
        
        print(f"Datos recibidos: {data}")
        
        db.session.add(accessory)
        db.session.commit()
               
        return jsonify(accessory.serialize())
    except Exception as e:
        return jsonify({'message': 'Error al crear el accesorio', 'error': str(e)})

@app.route('/api/v1.0/accessories/<int:id>', methods=['PUT'])
def update_accessory(id):
    try:
        accessory = Accessories.query.get(id)
        data = request.get_json()
        accessory.update(**data)
        db.session.commit()
        return jsonify(accessory.serialize())
    except:
        return jsonify({'message': 'Error al actualizar el accesorio'}) 

@app.route('/api/v1.0/accessories/<int:id>', methods=['DELETE'])
def delete_accessory(id):
    try:
        accessory = Accessories.query.get(id)
        db.session.delete(accessory)
        db.session.commit()
        return jsonify(accessory.serialize())
    except: 
        return jsonify({'message': 'Error al eliminar el accesorio'})

@app.route('/api/v1.0/accessories/<string:workday_id>', methods=['GET'])
def accessories_by_user(workday_id):
    try:
        accessories = Accessories.query.filter_by(workday_id=workday_id).all()
        return jsonify([accessory.serialize() for accessory in accessories])
    except Exception as e:
        return jsonify({'message': 'Error al obtener los accesorios', 'error': str(e)})
    
# Computadoras rutas
@app.route('/api/v1.0/computadoras', methods=['GET'])
def get_available_computers():
    try:
        computers = Computadoras.query.all()
        return jsonify([computer.serialize() for computer in computers])
    except Exception as e:
        return jsonify({'message': 'Error al recuperar las computadoras', 'error': str(e)}), 500
    
@app.route('/api/v1.0/computadoras/<string:workday_id>', methods=['GET'])
def get_computer_by_user(workday_id):
    try:
        # search user by workday_id
        user = Users.query.filter_by(workday_id=workday_id).first()
        print(f"Usuario: {user}")
        
        if not user:
            return jsonify({'message': 'Usuario no encontrado'}), 404
        
        # get id of user
        id = user.id

        # get all computers of user
        computers = UserComputer.query.filter_by(user_id=id).all()
        return jsonify([computer.serialize() for computer in computers])

    except:
        return jsonify({'message': 'Error al obtener la computadora'})
    
# inicio de la app
if __name__ == '__main__':
    app.run(debug=True, port=8010)