from libs.connection import db


def validate_register(username: str, password: str, email: str) -> bool:
    """Validate user registration input"""
    ## Validate name must be alphabetic
    if not username.isascii() and len(username) > 3:
        return False

    ## Validate the password must more than 8 characters
    if len(password) < 8:
        return False

    ## Validate email and password
    if not email or not password:
        return False

    ## Check if user already exists in database via email
    if db.users.find_one({"email": email}):
        return False

    return True


def format_phone_number(phone_number: str) -> str:
    if phone_number.startswith("+") and not phone_number.startswith("08"):
        return phone_number

    if phone_number.startswith("08"):
        return f"+62{phone_number[1:]}"

    if phone_number.startswith("62"):
        return f"+62{phone_number[2:]}"
    
    return f"+62{phone_number}"



def validate_login(email: str, password: str) -> bool:
    if not email or not password:
        return False

    return True
