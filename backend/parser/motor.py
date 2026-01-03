from flask_restful import reqparse

motor_parser = reqparse.RequestParser()
motor_parser.add_argument(
    "motor_id", type=str, required=True, help="Motor ID can't be blank"
)
motor_parser.add_argument(
    "brand", type=str, required=True, help="Brand can't be blank"
)
motor_parser.add_argument(
    "license_plate", type=str, required=True, help="License plate can't be blank"
)
motor_parser.add_argument(
    "rental_price", type=float, required=True, help="Rental price can't be blank"
)  
motor_parser.add_argument(
    "status", type=str, required=True, help="Status can't be blank"
)
motor_parser .add_argument(
    "image", type=str, required=True, help="Image URL can't be blank"
)