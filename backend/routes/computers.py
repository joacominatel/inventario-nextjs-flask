try:
    from flask import Blueprint, jsonify, request
    from sql.models.Computers import Computadoras
    from sql.models.Users import Users
    from sql.models.UserComputers import UserComputer
    from sql.db import db
except Exception as e:
    print(f"Error: {e}")

routeComp = Blueprint('computers', __name__)

@routeComp.route('/api/v1.0/computadoras', methods=['GET'])
def get_available_computers():
    try:
        computers = Computadoras.query.all()
        return jsonify([computer.serialize() for computer in computers])
    except Exception as e:
        return jsonify({'message': 'Error al recuperar las computadoras', 'error': str(e)}), 500
    
@routeComp.route('/api/v1.0/computadoras/<string:workday_id>', methods=['GET'])
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
    
@routeComp.route('/api/v1.0/computadoras', methods=['POST'])
def create_computer():
    try:
        data = request.get_json()
        
        marca = data.get('marca', '')
        modelo = data.get('modelo', '')
        serie = data.get('serie', '')

        computadora = Computadoras.query.filter_by(serie=serie).first()

        if computadora:
            return jsonify({'message': 'La computadora ya existe'}), 400
        
        computadora = Computadoras(marca=marca, modelo=modelo, serie=serie)
        db.session.add(computadora)
        db.session.commit()

        print(f"Computadora creada: {computadora.serialize()}")
        return jsonify(computadora.serialize())
    except:
        return jsonify({'message': 'Error al crear la computadora'})
