from flask import Blueprint, request
from flask_restful import Api, Resource
from libs.connection import db
from libs.utils import serialize_doc, token_required
from bson.objectid import ObjectId
from datetime import datetime, timedelta


bp_rental = Blueprint('rental', __name__, url_prefix='/rental')
rental_api = Api(bp_rental)

class Rental(Resource):
    @token_required
    def post(self, current_user):
        data = request.get_json()
        motor_id = data.get('motor_id')

        try:
            motor = db.motors.find_one({'_id': ObjectId(motor_id)})
        except:
            return {'message': 'Invalid scooter ID!'}, 400
        
        if not motor or motor['status'] != 'available':
            return {'message': 'Scooter not available!'}, 400
        
        duration_hours = int(data.get('duration', 1))
        start_time = datetime.now()
        end_time = start_time + timedelta(hours=duration_hours)
        total_cost = motor['rental_rate'] * duration_hours

        rental_bill = {
            'user_id': current_user['_id'],
            'motor_id': motor['_id'],
            'start_time': start_time,
            'end_time': end_time,
            'total_cost': total_cost,
            'status': 'ongoing',
            'payment_status': 'unpaid'
        }

        result = db.rental_bills.insert_one(rental_bill)

        db.motors.update_one({'_id': motor['_id']}
                             , {'$set': {'status': 'rented'}}
                             )
        
        return {'message' : 'Rental successfully created!',
                         'rental_bill_id': str(result.inserted_id),
                         'total_cost': total_cost
                         }, 201
    
    @token_required
    def get(self, user_id=None):
        if user_id:
            try:
                rental_bill = db.rental_bills.find_one({'user_id': ObjectId(user_id)})
            except:
                return {'message': 'Invalid rental bill User!'}, 400
            
            if not rental_bill:
                return {'message': 'Rental bill not found!'}, 404
            
            return serialize_doc(rental_bill), 200
        else:
            rental_bills = db.rental_bills.find({})
            bills_list = [serialize_doc(bill) for bill in rental_bills]
            return bills_list, 200

rental_api.add_resource(Rental, "/", '/<string:user_id>')


