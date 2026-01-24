from datetime import datetime, timedelta
from parser.rental import rental_parser

from bson.objectid import ObjectId
from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Api, Resource

from libs.connection import db
from libs.utils import serialize_doc

bp_rental = Blueprint("rental", __name__, url_prefix="/rental")
rental_api = Api(bp_rental)


class RentalList(Resource):
    @jwt_required()
    def post(self):
        data = rental_parser.parse_args()
        current_user_id = get_jwt_identity()
        motor_id: str = data.get("motor_id", "")

        try:
            motor = db.motor.find_one({"_id": ObjectId(motor_id)})
        except:
            return {"message": "Invalid motor ID!"}, 400

        if not motor:
            return {"message": "Motor not found!"}, 404

        if motor["status"] != "available":
            return {"message": "Motor Unavailable or Rented!"}, 400

        # Calculate the total price
        duration_hours = int(data.get("duration_hours") or 24)
        rent_start = datetime.now()
        rent_end = rent_start + timedelta(hours=duration_hours)
        price_per_hour = float(motor.get("rent_price") or 0.0)
        total_price = float(price_per_hour * duration_hours)

        new_rental_bill = {
            "user_id": ObjectId(current_user_id),
            "motor_id": ObjectId(motor_id),
            "rent_start": rent_start,
            "rent_end": rent_end,
            "created_at": datetime.now(),
            "total_price": total_price,
            "payment_status": "unpaid",
            "status": "ongoing",
        }

        result = db.rental_bills.insert_one(new_rental_bill)

        db.motor.update_one(
            {"_id": ObjectId(motor_id)}, {"$set": {"status": "not_available"}}
        )

        return {
            "message": "Rental bill created successfully.",
            "rental_bill_id": str(result.inserted_id),
        }, 201

    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        current_user = db.users.find_one({"_id": ObjectId(current_user_id)})
        is_admin = current_user and current_user.get("role") == "admin"

        # Get Query parameter of user_id
        user_id_query = request.args.get("user_id")
        query = {}
        if is_admin and user_id_query:
            try:
                query["user_id"] = ObjectId(user_id_query)
            except:
                return {"message": "Invalid user ID!"}, 400
        else:
            query["user_id"] = ObjectId(current_user_id)

        rental_bills = db.rental_bills.find(query)
        rental_list = [serialize_doc(rental) for rental in rental_bills]
        return rental_list, 200


class RentalDetail(Resource):
    @jwt_required()
    def get(self, rental_id):
        current_user_id = get_jwt_identity()
        current_user = db.users.find_one({"_id": ObjectId(current_user_id)})
        is_admin = current_user and current_user.get("role") == "admin"

        try:
            rental_bill = db.rental_bills.find_one({"_id": ObjectId(rental_id)})
        except:
            return {"message": "Invalid rental ID!"}, 400

        if not rental_bill:
            return {"message": "Rental bill not found!"}, 404

        if str(rental_bill["user_id"]) != current_user_id and not is_admin:
            return {"message": "Unauthorized access!"}, 401

        return serialize_doc(rental_bill), 200


class RentalPayment(Resource):
    @jwt_required()
    def post(self, rental_id):
        current_user_id = get_jwt_identity()

        try:
            rental_bill = db.rental_bills.find_one({"_id": ObjectId(rental_id)})
        except:
            return {"message": "Invalid rental ID!"}, 400

        if not rental_bill:
            return {"message": "Rental bill not found!"}, 404

        if str(rental_bill["user_id"]) != current_user_id:
            return {"message": "Unauthorized access"}, 401

        if rental_bill["payment_status"] == "paid":
            return {"message": "Rental bill is already paid."}, 200

        db.rental_bills.update_one(
            {"_id": ObjectId(rental_id)},
            {
                "$set": {
                    "payment_status": "paid",
                    "paid_at": datetime.now(),
                    "status": "completed",
                }
            },
        )

        return {"message": "Rental bill payment successful."}, 200


class RentalPayAll(Resource):
    @jwt_required()
    def post(self):
        current_user_id = get_jwt_identity()
        try:
            result = db.rental_bills.update_many(
                {"user_id": ObjectId(current_user_id), "payment_status": "unpaid"},
                {"$set": {"payment_status": "paid", "paid_at": datetime.now()}},
            )
            if result.modified_count == 0:
                return {
                    "status": "no_unpaid",
                    "message": "No unpaid rental bills found.",
                }, 200
            return {
                "status": "paid",
                "message": f"Successfully paid {result.modified_count} rental bills.",
            }, 200
        except Exception as e:
            print(f"Error occurred: {str(e)}")
            return {"message": "Error occurred while processing the request."}, 500


rental_api.add_resource(RentalList, "")
rental_api.add_resource(RentalPayAll, "/pay_all")
rental_api.add_resource(RentalDetail, "/<string:rental_id>")
rental_api.add_resource(RentalPayment, "/<string:rental_id>/pay")
