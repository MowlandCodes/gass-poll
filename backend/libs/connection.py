from os import getenv
from pymongo import MongoClient

DB_USER = getenv("DB_USER", "user")
DB_PASSWORD = getenv("DB_PASSWORD", "password")
DB_HOST = getenv("DB_HOST", "localhost")
DB_PORT = getenv("DB_PORT", "27017")
DB_NAME = getenv("DB_NAME", "gass_poll")

db_uri = f"mongodb://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/"
conn = MongoClient(db_uri)

db = conn[DB_NAME]
