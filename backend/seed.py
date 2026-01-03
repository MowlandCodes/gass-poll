from email.mime import image
from libs.connection import db
import bcrypt


def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

def database_first():
    db.users.delete_many({})
    db.motors.delete_many({})
    db.rental_bills.delete_many({})

    db.users.insert_one({
        "username": "admin",
        "email": "admin@example.com",
        "password": hash_password("admin123"),
        "phone": "1234567890",
        "role": "admin"
    })

    db.motors.insert_one({
        "name": "Yamaha R15",
        "brand": "Yamaha",
        "license_plate": "AB123CD",
        "rental_price": 150000,
        "status": "available",
        "image": "https://placehold.co/600x400/png"
    })

if __name__ == "__main__":
    database_first()