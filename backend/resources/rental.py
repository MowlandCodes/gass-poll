from datetime import datetime, timedelta

from bson.objectid import ObjectId
from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from libs.connection import db
from libs.utils import serialize_doc
from parser.rental import rental_parser

bp_rental = Blueprint("rental", __name__, url_prefix="/rental")
rental_api = Api(bp_rental)


class Rental(Resource):
    @jwt_required()
    def post(self):
        data = rental_parser.parse_args()
        current_user_id = get_jwt_identity()
        motor_id: str = data.get("motor_id")

        try:
            motor = db.motor.find_one({"_id": ObjectId(motor_id)})
        except:
            return {"message": "Invalid motor ID!"}, 400

        if not motor:
            return {"message": "Motor not found!"}, 404

        if motor["status"] != "available":
            return {"message": "Motor is not available for rent!"}, 400
        
        
        duration_hours = int(data.get("duration_hours", 24))
        rent_start = datetime.now()
        rent_end = rent_start + timedelta(hours=duration_hours)
        total_price = float(motor["rental_rate"]) * duration_hours

        new_rental_bill = {
            "user_id": ObjectId(current_user_id),
            "motor_id": ObjectId(motor_id),
            "rent_start": rent_start,
            "rent_end": rent_end,
            "created_at": datetime.now(),
            "total_price": total_price,
            "status": "ongoing"
        }

        result = db.rental_bills.insert_one(new_rental_bill)

        db.motor.update_one(
            {"_id": ObjectId(motor_id)}, {"$set": {"status": "rented"}}
        )

        return {
            "message": "Rental bill created successfully.",
            "rental_bill_id": str(result.inserted_id),
        }, 201

    @jwt_required()
    def get(self, user_id=None):
        logged_in_user_id = get_jwt_identity()

        if user_id:
            if user_id != logged_in_user_id:
                return {"message": "Unauthorized access!"}, 401
            rentals = db.rental_bills.find({"user_id": ObjectId(user_id)})
        else:
            rentals = db.rental_bills.find()

        bills_list = [serialize_doc(bill) for bill in rentals]
        return bills_list, 200

rental_api.add_resource(Rental, "/", "/<string:user_id>")
