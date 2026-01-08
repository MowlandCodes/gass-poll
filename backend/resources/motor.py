from backend.parser import motor
from parser.motor import motor_parser, motor_update_parser
from bson.objectid import ObjectId

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
        rent_price: float = data.get("rental_price", 0.0)
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
    
class MotorDetail(Resource):
    @jwt_required()
    @admin_only
    def put(self, motor_id):

        try:
            obj_id = ObjectId(motor_id)
            motor = db.motor.find_one({"_id": obj_id})
        except:
            return {"message": "Invalid Motor"}, 400
        if not motor:
            return {"message": "Motor not found"}, 404
        

        data=motor_update_parser.parse_args()

        update_fields = {}

        if data.get("name"):
            update_fields["name"] = data["name"]
        if data.get("brand"):
            update_fields["brand"] = data["brand"]
        if data.get("license_plate"):
            update_fields["license_plate"] = data["license_plate"]
        if data.get("rental_price") is not None:
            update_fields["rent_price"] = data["rental_price"]
        if data.get("image_url"):
            update_fields["image"] = data["image_url"]
        if data.get("status"):
            update_fields["status"] = data["status"]

        is_valid, reason = validate_motors(
            name=update_fields.get("name", motor["name"]),
            brand=update_fields.get("brand", motor["brand"]),
            license_plate=update_fields.get("license_plate", motor["license_plate"]),
            image_url=update_fields.get("image", motor["image"]),
        )
        if not is_valid:
            return {"message": "Bad Request", "reason": reason}, 400

        if update_fields:
            db.motor.update_one({"_id": obj_id}, {"$set": update_fields})
            return {"message": "Motor updated successfully"}, 200
        return {"message": "No fields to update"}, 400
    

    @jwt_required()
    @admin_only
    def delete(self, motor_id):
        try:
            obj_id = ObjectId(motor_id)
            motor = db.motor.find_one({"_id": obj_id})
        except:
            return {"message": "Invalid Motor"}, 400
        if not motor:
            return {"message": "Motor not found"}, 404

        db.motor.delete_one({"_id": obj_id})
        return {"message": "Motor deleted successfully"}, 200

api_motor.add_resource(MotorList, "")
api_motor.add_resource(MotorDetail, "/<string:motor_id>")
