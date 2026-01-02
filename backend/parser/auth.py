from flask_restful import reqparse

auth_register_parser = reqparse.RequestParser()

auth_register_parser.add_argument(
    "name", type=str, required=True, help="Name can't be blank"
)
auth_register_parser.add_argument(
    "email", type=str, required=True, help="Email can't be blank"
)
auth_register_parser.add_argument(
    "password", type=str, required=True, help="Password can't be blank"
)
auth_register_parser.add_argument(
    "phone_number", type=str, required=True, help="Phone number can't be blank"
)
