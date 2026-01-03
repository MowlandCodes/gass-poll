def validate_motors(current_user: dict) -> bool:
    if current_user.get("role") != "admin":
        return False
    return True