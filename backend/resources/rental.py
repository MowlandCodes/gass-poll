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
            return {"message": "Motor Unavailable or Rented!"}, 404

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

        # ?page=1&limit=10
        try:
            page = int(request.args.get("page", 1))
            limit = int(request.args.get("limit", 10))
        except ValueError:
            page = 1
            limit = 10

        user_id_query = request.args.get("user_id")
        query = {}
        if is_admin and user_id_query:
            try:
                query["user_id"] = ObjectId(user_id_query)
            except:
                return {"message": "Invalid user ID!"}, 400
        elif is_admin and not user_id_query:
            pass
        else:
            query["user_id"] = ObjectId(current_user_id)

        # Hitung Total Data & Total Unpaid
        unpaid_pipeline = [
            {"$match": {**query, "payment_status": "unpaid"}},
            {"$group": {"_id": None, "total": {"$sum": "$total_price"}}},
        ]
        unpaid_result = list(db.rental_bills.aggregate(unpaid_pipeline))
        total_unpaid = unpaid_result[0]["total"] if unpaid_result else 0

        # Hitung jumlah dokumen buat pagination info
        total_items = db.rental_bills.count_documents(query)
        total_pages = (total_items + limit - 1) // limit

        # Ambil Data Transaksi (Paginated & Sorted (yang terbaru harusnya di atas))
        skip = (page - 1) * limit
        rental_bills = (
            db.rental_bills.find(query).sort("_id", -1).skip(skip).limit(limit)
        )

        rental_list = [serialize_doc(rental) for rental in rental_bills]

        # Response Terstruktur
        return {
            "data": rental_list,
            "meta": {
                "page": page,
                "limit": limit,
                "total_items": total_items,
                "total_pages": total_pages,
                "total_unpaid": total_unpaid,
            },
        }, 200


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
        motor_id: str | None = None
        user_id: str | None = None
        payment_status: str | None = None

        try:
            rental_bill = db.rental_bills.find_one({"_id": ObjectId(rental_id)})

            # Kalo rental bill valid, ambil motor id nya
            motor_id = rental_bill and str(rental_bill.get("motor_id", None))
            user_id = rental_bill and str(rental_bill.get("user_id", None))
            payment_status = rental_bill and rental_bill.get("payment_status", None)
        except:
            return {"message": "Invalid rental ID!"}, 400

        if not rental_bill:
            return {"message": "Rental bill not found!"}, 404

        if user_id != current_user_id:
            return {"message": "Unauthorized access"}, 401

        if payment_status == "paid":
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

        # Ubah lagi status motor nya jadi available
        db.motor.update_one(
            {"_id": ObjectId(motor_id)}, {"$set": {"status": "available"}}
        )

        # Ubah status transaksi motor nya jadi completed
        db.rental_bills.update_one(
            {"_id": ObjectId(rental_bill.get("_id", ""))},
            {"$set": {"status": "completed"}},
        )

        return {"message": "Rental bill payment successful."}, 200


class RentalPayAll(Resource):
    @jwt_required()
    def post(self):
        current_user_id = get_jwt_identity()

        # Ambil semua motor id yang belum dibayar
        list_motors = db.rental_bills.find(
            {"user_id": ObjectId(current_user_id), "payment_status": "unpaid"},
            {"_id": 0, "motor_id": 1},
        )
        list_motors = [motor["motor_id"] for motor in list_motors]

        try:
            result = db.rental_bills.update_many(
                {
                    "user_id": ObjectId(current_user_id),
                    "payment_status": "unpaid",
                    "status": "ongoing",
                },
                {
                    "$set": {
                        "payment_status": "paid",
                        "status": "completed",
                        "paid_at": datetime.now(),
                    }
                },
            )

            # Update semua motor yang dibayar, ubah status nya jadi available
            for motor_id in list_motors:
                db.motor.update_one(
                    {"_id": ObjectId(motor_id)}, {"$set": {"status": "available"}}
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
