from datetime import datetime, timedelta
from parser.auth import auth_register_parser

import bcrypt
import jwt
from flask import Blueprint, current_app, request
from flask_restful import Api, Resource

from helpers.auth import validate_register
from libs.connection import db

auth_bp = Blueprint("auth", __name__)
api_auth = Api(auth_bp)


class register(Resource):
    def post(self):
        data = auth_register_parser.parse_args()

        username: str = data.get("name")
        password: str = data.get("password")
        phone_number: str = data.get("phone_number")
        email: str = data.get("email")

        is_valid = validate_register(username, password, phone_number, email)

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
        data = request.get_json()
        user = db.users.find_one({"email": data.get("email")})

        if user and bcrypt.checkpw(
            data.get("password").encode("utf-8"), user.get("password")
        ):
            token = jwt.encode(
                {
                    "user_id": str(user.get("_id")),
                    "role": user.get("role") if user.get("role") else "user",
                    "exp": datetime.now() + timedelta(hours=1),
                },
                current_app.config["SECRET_KEY"],
                algorithm="HS256",
            )

            return {"token": token, "message": "Login successful."}, 200

        return {"message": "Invalid email or password."}, 401


api_auth.add_resource(register, "/register")
api_auth.add_resource(login, "/login")
