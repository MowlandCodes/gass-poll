import functools
from bson.objectid import ObjectId
from datetime import datetime
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from libs.connection import db

def serialize_doc(doc):
    if not doc:
        return None

    doc["_id"] = str(doc["_id"])

    if "user_id" in doc:
        doc["user_id"] = str(doc["user_id"])
    if "motor_id" in doc:
        doc["motor_id"] = str(doc["motor_id"])
    
    for key, value in doc.items():
        if isinstance(value, datetime):
            doc[key] = value.isoformat()

    return doc

def admin_only(decorator):
    @functools.wraps(decorator)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        user = db.users.find_one({"_id": ObjectId(user_id)})
        if not user or user.get("role") != "admin":
            return {"message": "Admin Only!"}, 403
        return decorator(*args, **kwargs)
    return wrapper
