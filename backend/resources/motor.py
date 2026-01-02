from flask import Blueprint, request
from flask_restful import Resource, Api
from libs.connection import db
from libs.utils import serialize_doc, token_required

bp_motor = Blueprint('motor', __name__)
api_motor = Api(bp_motor)

class MotorList(Resource):

    ## Get all motors
    def get(self):
        motors = list(db.motor.find())
        return [serialize_doc(m) for m in motors], 200
    
    ## Add a new motor
    @token_required
    def post(self):
        data = request.get_json()
        
        new_motor = {
            "name": data["name"],
            "brand": data["brand"],
            "license_plate": data["license_plate"],
            "rent_price": float(data["rent_price"]),
            "status": "available",
            "image": data.get("image", "")
        }

        result = db.motor.insert_one(new_motor)
        return {"message": "Motor added successfully.", "motor_id": str(result.inserted_id)}, 201
    
api_motor.add_resource(MotorList, '/')

            
    
