from flask import Blueprint, jsonify, request, current_app
from libs.connection import db
import bcrypt
import jwt
from datetime import datetime, timedelta

bp_auth = Blueprint('auth', __name__)
@bp_auth.route('/register', methods=['POST'])

def register():
    data = request.json

    if not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password are required!'}), 400
    
    if db.users.find_one({'email': data['email']}):
        return jsonify({'message': 'User already exists!'}), 400
    
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

    new_user = {
        "name": data.get("name"),
        "password": hashed_password,
        "email":data.get("email"),
        "phone":data.get("phone_number")
    }

    db.users.insert_one(new_user)
    return jsonify({'message': 'User registered successfully!'}), 201

@bp_auth.route('/login', methods=['POST'])

def login():
    data = request.json
    user = db.users.find_one({'email': data.get('email')})

    if user and bcrypt.checkpw(data['password'].encode('utf-8')):
        token = jwt.encode({
            'user_id': str(user['_id']),
            'exp': datetime.utcnow() + timedelta(hours=1)
        }, current_app.config['SECRET_KEY'], algorithm="HS256")

        return jsonify({'token': token, 'message': 'Login successful'}), 200

    return jsonify({'message': 'Invalid credentials!'}), 401



