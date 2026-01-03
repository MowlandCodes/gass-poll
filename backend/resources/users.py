from bson import ObjectId
from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from libs.utils import serialize_doc
from libs.connection import db


bp_users = Blueprint('users', __name__, url_prefix='/users')
api = Api(bp_users)

class userProfile(Resource):
    @jwt_required()
    def get(self, current_user):
        user_id = get_jwt_identity()
        user = db.users.find_one({'_id': ObjectId(user_id)})
        if not user:
            return {'message': 'User not found'}, 404
        return serialize_doc(user), 200
    
api.add_resource(userProfile, '/')