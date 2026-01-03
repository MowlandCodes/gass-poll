from bson.objectid import ObjectId
from flask import Blueprint
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from libs.utils import serialize_doc
from libs.connection import db


bp_users = Blueprint('users', __name__, url_prefix='/users')
api = Api(bp_users)

class userProfile(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        user_data = db.users.find_one({'_id': ObjectId(current_user_id)})
        
        if not user_data:
            return {'message': 'User not found'}, 404
        
        user_data.pop('password', None)
        return serialize_doc(user_data), 200

api.add_resource(userProfile, '/')