try:
    from flask import Blueprint, jsonify, request
    from sql.models.Accessories import Accessories
    from sql.db import db
except Exception as e:
    print(f"Error: {e}")

routeAcc = Blueprint('accessories', __name__)

@routeAcc.route('/api/v1.0/accessories', methods=['GET'])
def allAccessories():
    try:
        accessories = Accessories.query.all()
        return jsonify([accessory.serialize() for accessory in accessories])
    except Exception as e:
        return jsonify({'message': 'Error al obtener los accesorios', 'error': str(e)})

@routeAcc.route('/api/v1.0/accessories/<int:workday_id>', methods=['POST'])
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

@routeAcc.route('/api/v1.0/accessories', methods=['POST'])
def add_accessory():
    data = request.get_json()
    try:
        for item in data:
            new_accessory = Accessories(
                                        id=item['id'],
                                        workday_id=item['workday_id'],
                                        accesorio=item['accesorio'],
                                        detalle=item['detalle'],
                                        ticket=item['ticket'],
                                        cantidad=item['cantidad']
                                        )
            db.session.add(new_accessory)
        db.session.commit()
        return jsonify({'message': 'Accesorios agregados correctamente'})
    except Exception as e:
        return jsonify({'message': 'Error al agregar los accesorios', 'error': str(e)}), 500        

@routeAcc.route('/api/v1.0/accessories/<int:id>', methods=['PUT'])
def update_accessory(id):
    try:
        accessory = Accessories.query.get(id)
        data = request.get_json()
        accessory.update(**data)
        db.session.commit()
        return jsonify(accessory.serialize())
    except:
        return jsonify({'message': 'Error al actualizar el accesorio'}) 

@routeAcc.route('/api/v1.0/accessories/<int:id>', methods=['DELETE'])
def delete_accessory(id):
    try:
        accessory = Accessories.query.get(id)
        db.session.delete(accessory)
        db.session.commit()
        return jsonify(accessory.serialize())
    except: 
        return jsonify({'message': 'Error al eliminar el accesorio'})

@routeAcc.route('/api/v1.0/accessories/<string:workday_id>', methods=['GET'])
def accessories_by_user(workday_id):
    try:
        accessories = Accessories.query.filter_by(workday_id=workday_id).all()
        return jsonify([accessory.serialize() for accessory in accessories])
    except Exception as e:
        return jsonify({'message': 'Error al obtener los accesorios', 'error': str(e)})
    