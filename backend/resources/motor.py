import resource
import stat
from turtle import st
from parser.motor import motor_parser, motor_update_parser
from bson import ObjectId

from flask import Blueprint
from flask_jwt_extended import jwt_required
from flask_restful import Api, Resource

from helpers.motor import validate_motors
from libs.connection import db
from libs.utils import admin_only, serialize_doc

bp_motor = Blueprint("motor", __name__, url_prefix="/motor")
api_motor = Api(bp_motor)


class MotorList(Resource):
    def get(self):
        motors = db.motor.find()
        motor_list = [serialize_doc(motor) for motor in motors]
        return motor_list, 200

    @jwt_required()
    @admin_only
    def post(self):
        data = motor_parser.parse_args()

        name: str = data.get("name", "")
        brand: str = data.get("brand", "")
        license_plate: str = data.get("license_plate", "")
        rent_price: float = data.get("rent_price", 0.0)
        image_url: str = data.get("image_url", "")

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
    

class MotorItem(Resource):
    @jwt_required()
    @admin_only

    def put(self, motor_id):
        if not ObjectId.is_valid(motor_id):
            return {"message": "Invalid motor ID."}, 400
        
        data = motor_update_parser.parse_args()

        motor = db.motor.find_one({"_id": ObjectId(motor_id)})
        if not motor:
            return {"message": "Motor not found."}, 404
        
        name = data.get("name", motor["name"])
        brand = data.get("brand", motor["brand"])
        license_plate = data.get("license_plate", motor["license_plate"])
        rent_price = data.get("rent_price", motor["rent_price"])
        image_url = data.get("image_url", motor["image"])
        status = data.get("status", motor["status"])

        is_valid, reason = validate_motors(name, brand, license_plate, image_url)
        if not is_valid:
            return {"message": "Bad Request", "reason": reason}, 400
        
        updated_motor = {
            "name": name,
            "brand": brand,
            "license_plate": license_plate,
            "rent_price": rent_price,
            "status": status,
            "image": image_url,
        }

        db.motor.update_one({"_id": ObjectId(motor_id)}, {"$set": updated_motor})

        return {"message": "Motor updated successfully."}, 200
    
    @jwt_required()
    @admin_only
    def delete(self, motor_id):
        if not ObjectId.is_valid(motor_id):
            return {"message": "Invalid motor ID."}, 400
        
        motor = db.motor.find_one({"_id": ObjectId(motor_id)})
        if not motor:
            return {"message": "Motor not found."}, 404
        
        db.motor.delete_one({"_id": ObjectId(motor_id)})

        return {"message": "Motor deleted successfully."}, 200
    

    
api_motor.add_resource(MotorList, "")
api_motor.add_resource(MotorItem, "/<string:motor_id>")
