from flask import Blueprint, request, current_app
from flask_restful import Resource, Api
from libs.connection import db
import bcrypt
import jwt
from datetime import datetime, timedelta

auth_bp = Blueprint('auth', __name__)
api_auth = Api(auth_bp)

class register(Resource):
    def post(self):
        data = request.get_json()

        ## Validate input
        if not data.get('email') or not data.get('password'):
            return {"message": "Email and password are required."}, 400
        
        ## Check if user already exists in database via email
        if db.users.find_one({'email': data['email']}):
            return {"message": "User already exists."}, 400
        
        ## Make it secret password
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
                                        
        new_user = {
            "name": data.get("name"),
            "password": hashed_password,
            "email": data["email"],
            "phone": data.get("phone_number"),
        }
        
        db.users.insert_one(new_user)
        return {"message": "User registered successfully."}, 201

    
class login(Resource):
    def post(self):
        data = request.get_json()
        user = db.users.find_one({'email': data.get('email')})


        if user and bcrypt.checkpw(data['password'].encode('utf-8'), user['password']):
            token = jwt.encode({
                'user_id': str(user['_id']),
                'exp': datetime.utcnow() + timedelta(hours=1)
            }, current_app.config['SECRET_KEY'], algorithm='HS256')

            return {"token": token, 'message': "Login successful."}, 200
        
        return {"message": "Invalid email or password."}, 401
    

api_auth.add_resource(register, '/register')
api_auth.add_resource(login, '/login')




