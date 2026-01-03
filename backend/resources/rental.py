from datetime import datetime, timedelta

from bson.objectid import ObjectId
from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from libs.connection import db
from libs.utils import serialize_doc

bp_rental = Blueprint("rental", __name__, url_prefix="/rental")
rental_api = Api(bp_rental)


class Rental(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()

    @jwt_required()
    def get(self, current_user, user_id=None):
        if not user_id:
            try:
                rental_bill = db.rental_bills.find_one({"user_id": ObjectId(user_id)})
            except:
                return {"message": "Invalid rental bill User!"}, 400

            if not rental_bill:
                return {"message": "Rental bill not found!"}, 404

            return serialize_doc(rental_bill), 200
        else:
            rental_bills = db.rental_bills.find({})
            bills_list = [serialize_doc(bill) for bill in rental_bills]
            return bills_list, 200


rental_api.add_resource(Rental, "/", "/<string:user_id>")
