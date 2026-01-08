from datetime import datetime, timedelta
from parser import auth
from parser.auth import auth_register_parser, auth_login_parser

import bcrypt
import jwt
from flask import Blueprint, current_app, request
from flask_restful import Api, Resource
from flask_jwt_extended import create_access_token

from helpers.auth import format_phone_number, validate_register, validate_login
from libs.connection import db

auth_bp = Blueprint("auth", __name__)
api_auth = Api(auth_bp)


class register(Resource):
    def post(self):
        data = auth_register_parser.parse_args()

        username: str = data.get("name")
        password: str = data.get("password")

        phone_number: str = data.get("phone_number")
        phone_number = format_phone_number(phone_number)

        email: str = data.get("email")

        is_valid = validate_register(username, password, email)

        if not is_valid:
            return {"message": "Bad Request"}, 400

        ## Make it secret password
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

        new_user = {
            "name": username,
            "password": hashed_password,
            "email": email,
            "phone_number": phone_number,
            "role": "user",
        }

        db.users.insert_one(new_user)
        return {"message": "User registered successfully."}, 201


class login(Resource):
    def post(self):
        data = auth_login_parser.parse_args()

        email: str = data.get("email")
        password: str = data.get("password")

        is_login_valid = validate_login(email, password)
        if not is_login_valid:
            return {"message": "Bad Request"}, 400
        
        user = db.users.find_one({"email": email})

<<<<<<< HEAD
        if user and bcrypt.checkpw(
            password.encode("utf-8"), user["password"]
        ):
=======
        if user and bcrypt.checkpw(password.encode("utf-8"), user["password"]):
            payload = {
                "role": user["role"],
                "name": user["name"],
                "email": user["email"],
                "user_id": str(user["_id"]),
            }

>>>>>>> 3888ef5ce9b1f3ca75f365121581dfa711c8969b
            token = create_access_token(
                identity=str(user["_id"]),
                expires_delta=timedelta(hours=1),
            )
            return {"token": token, "message": "login successful"}, 200
        
        return {"message": "Invalid email or password"}, 401

api_auth.add_resource(register, "/register")
api_auth.add_resource(login, "/login")


class logout(Resource):
    def post(self):
        return {"message": "Logout successful"}, 200
