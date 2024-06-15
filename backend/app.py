# Import generales
try:
    import flask, os
    from flask import Flask, jsonify
    from dotenv import load_dotenv
    from flask_cors import CORS

    # Import de modelos
    from sql.db import init_db, db
    from sql.models.Users import Users
except Exception as e:
    print(f"Error: {e}")

# Configuración de la app
app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configuración de la base de datos
load_dotenv('.env')

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQLALCHEMY_DATABASE_URL', 'fallback-sqlalchemy-database-url')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

# Inicialización de la base de datos
db = init_db(app)

# Rutas
from routes.accessories import routeAcc as accessories
from routes.computers import routeComp as computers
from routes.users import routeUsers as users

app.register_blueprint(accessories)
app.register_blueprint(computers)
app.register_blueprint(users)

# Rutas de prueba
@app.route('/api/internal/test', methods=['GET'])
def test():
    return jsonify({'message': 'Test OK'})
    
# Redmine rutas
@app.route('/api/internal/redmineUsers', methods=['GET'])
def getRedmineUsers():
    API_KEY = os.getenv('API_KEY_REDMINE')
    URL_REDMINE = os.getenv('URL_REDMINE')

    users = []
    usersSQL = Users.query.all()
    sql_users_in_redmine = set()  # Usamos un conjunto para búsquedas más eficientes

    limit = 100
    offset = 0

    try:
        import requests
    except ImportError:
        return jsonify({'message': 'Error al importar requests'})

    try:
        # Obtener usuarios de Redmine
        while True:
            response = requests.get(f'{URL_REDMINE}/users.json?limit={limit}&offset={offset}', headers={'X-Redmine-API-Key': API_KEY})
            data = response.json()
            users_data = data.get('users', [])
            
            if not users_data:
                break
            
            for user in users_data:
                users.append({
                    'id': user.get('id'),
                    'name': user.get('firstname'),
                    'lastname': user.get('lastname'),
                    'mail': user.get('mail'),
                    'login': user.get('login'),
                    'status': user.get('status')
                })
                # Agregamos el nombre de usuario al conjunto
                sql_users_in_redmine.add(user.get('login'))
            
            offset += limit

        # Comparamos y marcamos usuarios de SQL que están en Redmine
        for user in usersSQL:
            username = user.usuario.lower()
            name = f'{user.nombre.lower()}.{user.apellido.lower()}'
            if username in sql_users_in_redmine or name in sql_users_in_redmine:
                user.is_in_redmine = True

        # Guardamos los usuarios de SQL que están en Redmine en un nuevo array
        users_in_redmine = [user.serialize() for user in usersSQL if user.is_in_redmine]

        # Actualizamos los usuarios en la base de datos
        db.session.commit()

        return jsonify(users_in_redmine)
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error al obtener los usuarios de Redmine', 'error': str(e)}), 500


# inicio de la app
if __name__ == '__main__':
    app.run(debug=True, port=8010)