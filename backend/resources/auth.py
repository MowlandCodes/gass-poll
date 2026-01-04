from datetime import timedelta
from parser.auth import auth_login_parser, auth_register_parser

import bcrypt
from flask import Blueprint, make_response
from flask_jwt_extended import create_access_token
from flask_restful import Api, Resource

from helpers.auth import format_phone_number, validate_login, validate_register
from libs.connection import db

auth_bp = Blueprint("auth", __name__)
api_auth = Api(auth_bp)


class register(Resource):
    def post(self):
        data = auth_register_parser.parse_args()

        username: str = data.get("name", "")
        password: str = data.get("password", "")

        phone_number: str = data.get("phone_number", "")
        phone_number = format_phone_number(phone_number)

        email: str = data.get("email", "")

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

        email: str = data.get("email", "")
        password: str = data.get("password", "")

        is_login_valid = validate_login(email, password)
        if not is_login_valid:
            return {"message": "Bad Request"}, 400

        user = db.users.find_one({"email": email})

        if user and bcrypt.checkpw(password.encode("utf-8"), user["password"]):
            payload = {
                "role": user["role"],
                "name": user["name"],
                "email": user["email"],
            }

            token = create_access_token(
                identity=str(user["_id"]),
                additional_claims=payload,
                expires_delta=timedelta(hours=1),
            )

            response = make_response(
                {"token": token, "message": "Login successful", "user": payload}
            )
            response.set_cookie("token", token, httponly=True)

            return response

        return {"message": "Invalid email or password"}, 401


class Logout(Resource):
    def get(self):
        response = make_response({"message": "Logout successful"})
        response.status_code = 200

        # Remove cookie, biar nggk bisa di pake lagi
        response.set_cookie("token", "", httponly=True, expires=0)

        return response


api_auth.add_resource(register, "/register")
api_auth.add_resource(login, "/login")
api_auth.add_resource(Logout, "/logout")
