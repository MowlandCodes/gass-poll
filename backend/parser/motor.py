from typing import Literal

from flask_restful import reqparse

motor_parser = reqparse.RequestParser()
motor_parser.add_argument(
    "name", type=str, required=True, help="Motorbike name can't be blank"
)
motor_parser.add_argument("brand", type=str, required=True, help="Brand can't be blank")
motor_parser.add_argument(
    "license_plate", type=str, required=True, help="License plate can't be blank"
)
motor_parser.add_argument(
    "rental_price", type=float, required=True, help="Rental price can't be blank"
)
motor_parser.add_argument(
    "image_url", type=str, required=True, help="Image URL can't be blank"
)

# Optional status for Motor
motor_status = Literal["available", "not_available"]
motor_parser.add_argument(
    "status",
    type=motor_status,
    required=False,
    help="Status must either 'available' or 'not_available'",
)
