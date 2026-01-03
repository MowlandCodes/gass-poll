from bson import is_valid
from flask import Blueprint, request
from flask_restful import Resource, Api

from parser.motor import motor_parser
from helpers.motor import validate_motors

from libs.connection import db
from libs.utils import serialize_doc, token_required
from resources import rental

bp_motor = Blueprint("motor", __name__, url_prefix="/motor")
api_motor = Api(bp_motor)


class MotorList(Resource):
    def get(self):
        motors = db.motor.find()
        motor_list = [serialize_doc(motor) for motor in motors]
        return {"motors": motor_list}, 200

    ## Add a new motor
    @token_required
    def post(self, current_user):
        data = motor_parser.parse_args()

        name: str = (data.get("name"),)
        brand: str = (data.get("brand"),)
        license_plate: str = (data.get("license_plate"),)
        rent_price: float = (data.get("rent_price"),)
        image: str = data.get("image", "")

        is_valid = validate_motors(current_user)
        if not is_valid:
            return {"message": "Unauthorized"}, 401

        new_motor = {
            "name": name,
            "brand": brand,
            "license_plate": license,
            "rent_price": rent_price,
            "status": "available",
            "image": image,
        }

        result = db.motor.insert_one(new_motor)
        return {
            "message": "Motor added successfully.",
            "motor_id": str(result.inserted_id),
        }, 201


api_motor.add_resource(MotorList, "/")
