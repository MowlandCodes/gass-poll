from flask_restful import reqparse

rental_parser = reqparse.RequestParser()

rental_parser.add_argument(
    "motor_id", type=str, required=True, help="Motor ID can't be blank"
)
rental_parser.add_argument(
    "duration_hours", type=int, required=False, help="Duration in hours"
)
