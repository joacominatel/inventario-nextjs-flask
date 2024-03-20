# Import generales
try:
    import flask, os
    from flask import Flask, request, jsonify, render_template, send_from_directory
    from dotenv import load_dotenv
    from werkzeug.utils import secure_filename
    from flask_sqlalchemy import SQLAlchemy
    from flask_migrate import Migrate
    from flask_cors import CORS

    # Import de modelos
    from sql.db import init_db, db
    from sql.models.Users import Users
    from sql.models.Accessories import Accessories

    from sqlalchemy.sql import func, exists, and_, or_

except Exception as e:
    print(f"Error: {e}")

# Configuración de la app
app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configuración de la base de datos
load_dotenv('.env')

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URL')
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
        nombre = nombre.capitalize()
        users = Users.query.filter(or_(
            Users.nombre.like(f'{nombre}%'),
            Users.apellido.like(f'{nombre}%'),
            Users.mail.like(f'{nombre}%')
        )).all()

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
        user = Users(**data)
        db.session.add(user)
        db.session.commit()
        return jsonify(user.serialize())
    except:
        return jsonify({'message': 'Error al crear el usuario'})    
    
@app.route('/api/v1.0/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    try:
        user = Users.query.get(id)

        if not user:
            return jsonify({'message': 'Usuario no encontrado'}), 404
        
        nombre = user.nombre

        # get accessories
        try:
            accessories = Accessories.query.filter_by(workday_id=user.workday_id).all()
            for accessory in accessories:
                db.session.delete(accessory)
                db.session.commit()
        except:
            db.session.rollback()
            return jsonify({'message': 'Error al eliminar los accesorios del usuario'}), 500

        db.session.delete(user)
        db.session.commit()

        return jsonify(f'Usuario {nombre} eliminado')
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error al eliminar el usuario', 'error': str(e)})

@app.route('/api/v1.0/users/<int:id>', methods=['PUT'])
def update_user(id):
    try:
        user = Users.query.get(id)
        if not user:
            return jsonify({'message': 'Usuario no encontrado'}), 404
        
        data = request.get_json()
        
        print(data)

        # Actualizar los atributos del usuario con los nuevos datos
        for key, value in data.items():
            setattr(user, key, value)
        
        # Confirmar los cambios en la base de datos
        db.session.commit()
        
        return jsonify(user.serialize())
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error al actualizar el usuario', 'error': str(e)}), 500


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
        data['workday_id'] = workday_id
        
        accessory = Accessories(**data)

        db.session.add(accessory)
        db.session.commit()

        return jsonify(accessory.serialize())
    except:
        return jsonify({'message': 'Error al crear el accesorio'})

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
    
# inicio de la app
if __name__ == '__main__':
    app.run(debug=True, port=8010)