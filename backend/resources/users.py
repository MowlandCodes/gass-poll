from flask import Blueprint, request
from flask_restful import Api, Resource
from libs.utils import serialize_doc, token_required

bp_users = Blueprint('users', __name__, url_prefix='/users')
api = Api(bp_users)

class userProfile(Resource):
    @token_required
    def get(self, current_user):
        current_user.pop('password', None)
        return serialize_doc(current_user), 200
    
api.add_resource(userProfile, '/')