from libs.connection import db


def validate_register(
    username: str, password: str, phone_number: str, email: str
) -> bool:
    """Validate user registration input"""
    ## Validate name must be alphabetic
    if not username.isalpha():
        return False

    ## Validate the password must more than 8 characters
    if len(password) < 8:
        return False

    ## Validate phone number
    if phone_number.startswith("+62"):
        return False

    ## Validate email and password
    if not email or not password:
        return False

    ## Check if user already exists in database via email
    if db.users.find_one({"email": email}):
        return False

    return True
