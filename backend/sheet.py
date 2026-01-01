from libs.connection import db
import bcrypt
from datetime import datetime, timedelta

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

def database_first():

    