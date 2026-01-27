from datetime import datetime, timedelta

import bcrypt
from bson.objectid import ObjectId
from dotenv import load_dotenv

load_dotenv()
from libs.connection import db


def hash_password(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())


def database_first():
    print("Clearing existing data...")
    db.users.delete_many({})
    db.motor.delete_many({})
    db.rental_bills.delete_many({})
    db.token_blocklist.delete_many({})
    print("Data cleared.")

    print("Seeding new data...")

    users_to_seed = [
        {
            "_id": ObjectId(),
            "name": "Admin User",
            "email": "admin@gasspoll.com",
            "password": hash_password("admin123"),
            "phone_number": "+6281234567890",
            "role": "admin",
        },
        {
            "_id": ObjectId(),
            "name": "John Doe",
            "email": "johndoe@example.com",
            "password": hash_password("password123"),
            "phone_number": "+6281111111111",
            "role": "user",
        },
        {
            "_id": ObjectId(),
            "name": "Jane Smith",
            "email": "janesmith@example.com",
            "password": hash_password("password123"),
            "phone_number": "+6282222222222",
            "role": "user",
        },
    ]
    db.users.insert_many(users_to_seed)
    print(f"-> Seeded {len(users_to_seed)} users.")

    motors_to_seed = [
        {
            "_id": ObjectId(),
            "name": "Honda Vario 160",
            "brand": "Honda",
            "license_plate": "B 1234 ABC",
            "rent_price": 7500,
            "status": "available",
            "image": "public/honda-vario-160.webp",
        },
        {
            "_id": ObjectId(),
            "name": "Yamaha NMAX",
            "brand": "Yamaha",
            "license_plate": "D 5678 XYZ",
            "rent_price": 9000,
            "status": "available",
            "image": "public/yamaha-nmax.webp",
        },
        {
            "_id": ObjectId(),
            "name": "Suzuki Burgman",
            "brand": "Suzuki",
            "license_plate": "F 9101 GHI",
            "rent_price": 8500,
            "status": "not_available",
            "image": "public/suzuki-burgman.webp",
        },
        {
            "_id": ObjectId(),
            "name": "Honda PCX 160",
            "brand": "Honda",
            "license_plate": "AD 1122 JKL",
            "rent_price": 8000,
            "status": "available",
            "image": "public/honda-pcx-160.webp",
        },
    ]
    db.motor.insert_many(motors_to_seed)
    print(f"-> Seeded {len(motors_to_seed)} motors.")

    print("Database seeding completed successfully!")


if __name__ == "__main__":
    database_first()
