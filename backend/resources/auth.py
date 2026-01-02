from html import parser
from flask import Blueprint, request, current_app, reparse
from flask_restful import Resource, Api
from libs.connection import db
import bcrypt
import jwt
from datetime import datetime, timedelta

auth_bp = Blueprint('auth', __name__)
api_auth = Api(auth_bp)

class register(Resource):
    def post(self):

        parser = parser.RequestParser()

        parser.add_argument('name', type=str, required=True, help="Name can't be blank")
        parser.add_argument('email', type=str, required=True, help="Email can't be blank")
        parser.add_argument('password', type=str, required=True, help="Password can't be blank")
        parser.add_argument('phone_number', type=str, required=True, help="Phone number can't be blank")

        data = parser.parse_args()

        ## Validate name must be alphabetic
        if not data.get('name').isalpha():
            return {"message": "Name must contain only alphabetic characters."}, 400

        ## Validate the password must more than 8 characters
        if len(data.get('password')) < 8:
            return {"message": "Password must be at least 8 characters long."}, 400

        ## Validate phone number
        if data.get('phone_number').startswith('+62'):
            return {"message": "Phone number should not start with +62"}, 400

        ## Validate email and password
        if not data.get('email') or not data.get('password'):
            return {"message": "Email and password are required."}, 400
        
        ## Check if user already exists in database via email
        if db.users.find_one({'email': data.get('email')}):
            return {"message": "User already exists."}, 400
        
        ## Make it secret password
        hashed_password = bcrypt.hashpw(data.get('password').encode('utf-8'), bcrypt.gensalt())
                                        
        new_user = {
            "name": data.get("name"),
            "password": hashed_password,
            "email": data.get("email"),
            "phone_number": data.get("phone_number"),
            "role": "user"
        }
        
        db.users.insert_one(new_user)
        return {"message": "User registered successfully."}, 201

    
class login(Resource):
    def post(self):
        data = request.get_json()
        user = db.users.find_one({'email': data.get('email')})

        if user and bcrypt.checkpw(data.get('password').encode('utf-8'), user.get('password')):
            token = jwt.encode({
                'user_id': str(user.get('_id')),
                'role': user.get('role') if user.get('role') else 'user',
                'exp': datetime.utcnow() + timedelta(hours=1)
            }, current_app.config['SECRET_KEY'], algorithm='HS256')

            return {"token": token, 'message': "Login successful."}, 200
        
        return {"message": "Invalid email or password."}, 401
    

api_auth.add_resource(register, '/register')
api_auth.add_resource(login, '/login')




