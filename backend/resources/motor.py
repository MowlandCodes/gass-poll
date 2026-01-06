from parser.motor import motor_parser

from flask import Blueprint
from flask_jwt_extended import jwt_required
from flask_restful import Api, Resource

from helpers.motor import validate_motors
from libs.connection import db
from libs.utils import serialize_doc, admin_only

bp_motor = Blueprint("motor", __name__, url_prefix="/motor")
api_motor = Api(bp_motor)


class MotorList(Resource):
    def get(self):
        motors = db.motor.find()
        motor_list = [serialize_doc(motor) for motor in motors]
        return motor_list, 200

    ## Add a new motor
    @jwt_required()
    @admin_only
    def post(self):
        data = motor_parser.parse_args()

        name: str = data.get("name", "")
        brand: str = data.get("brand", "")
        license_plate: str = data.get("license_plate", "")
        rent_price: float = data.get("rent_price", 0.0)
        image_url: str = data.get("image_url", "")

        # Optional
        status: str = data.get("status", "available")

        is_valid, reason = validate_motors(name, brand, license_plate, image_url)
        if not is_valid:
            return {"message": "Bad Request", "reason": reason}, 400

        new_motor = {
            "name": name,
            "brand": brand,
            "license_plate": license_plate,
            "rent_price": rent_price,
            "status": status,
            "image": image_url,
        }

        result = db.motor.insert_one(new_motor)
        return {
            "message": "Motor added successfully.",
            "motor_id": str(result.inserted_id),
        }, 201


api_motor.add_resource(MotorList, "/")
