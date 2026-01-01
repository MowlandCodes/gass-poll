from bson import ObjectId
from flask import Blueprint, request, jsonify, current_app
from libs.connection import db
from libs.utils import serialize_doc
import bcrypt
import jwt
import functools


def serialize_doc(doc):
    if not doc:
        return None
    
    doc['_id'] = str(doc['_id'])

    if "user_id" in doc:
        doc['user_id'] = str(doc['user_id'])
    if "motor_id" in doc:
        doc['motor_id'] = str(doc['motor_id'])

    return doc


def token_required(f):
    @functools.wraps(f)
    
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            data=jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = db.users.find_one({'_id': ObjectId(data['user_id'])})

            if not current_user:
                return jsonify({'message': 'User not found!'}), 401
            
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401
        except jwt as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401
        

        return f(current_user, *args, **kwargs)
    
    return decorated

          



