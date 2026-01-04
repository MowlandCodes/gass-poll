from bson.objectid import ObjectId
from flask import Blueprint
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from libs.utils import admin_only, serialize_doc
from libs.connection import db


bp_users = Blueprint('users', __name__, url_prefix='/users')
api = Api(bp_users)

class userList(Resource):
    @jwt_required()
    @admin_only
    def get(self):
        users = db.users.find()
        user_list = [serialize_doc(user) for user in users]

        for user in user_list:
            user.pop('password', None)
        return user_list, 200

class userProfile(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        user_data = db.users.find_one({'_id': ObjectId(current_user_id)})
        
        if not user_data:
            return {'message': 'User not found'}, 404
        
        user_data.pop('password', None)
        return serialize_doc(user_data), 200

api.add_resource(userList, '/')
api.add_resource(userProfile, '/me')