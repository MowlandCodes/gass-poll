import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
load_dotenv()

from libs.connection import db
from resources.rental import bp_rental
from resources.users import bp_users
from resources.auth import auth_bp
from resources.motor import bp_motor

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('APP_SECRET_KEY')
app.config['APP_PORT'] = int(os.getenv('APP_PORT', 5000))

CORS(app) # Enabled CORS generally

app.register_blueprint(bp_rental, url_prefix='/rental')
app.register_blueprint(bp_users, url_prefix='/users')
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(bp_motor, url_prefix='/motor')

jwt = JWTManager(app)

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload['jti']
    token = db.revoked_tokens.find_one({'jti': jti})
    return token is not None

@jwt.revoked_token_loader
def revoked_token_callback(jwt_header, jwt_payload):
    return {'message': 'Token has been revoked'}, 401

if __name__ == '__main__':
    print(f"Starting server on port {app.config['APP_PORT']}...")
    app.run(port=app.config['APP_PORT'], debug=True)

