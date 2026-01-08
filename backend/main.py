import os

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from libs.connection import db
from resources.auth import auth_bp
from resources.motor import bp_motor
from resources.rental import bp_rental
from resources.users import bp_users

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

app = Flask(__name__, static_folder="./public", static_url_path="/public")
app.config["SECRET_KEY"] = os.getenv("APP_SECRET_KEY")
app.config["APP_PORT"] = int(os.getenv("APP_PORT", 5000))

jwt = JWTManager(app)


@jwt.token_in_blocklist_loader
def check_if_token_revoked(__header__, jwt_payload):
    jti = jwt_payload["jti"]
    token = db.token_blocklist.find_one({"jti": jti})
    return token is not None


@jwt.revoked_token_loader
def revoked_token_callback(__header__, __jwt_payload__):
    return {"message": "Unauthorized"}, 401


CORS(app, origins=[FRONTEND_URL], supports_credentials=True)

app.register_blueprint(bp_rental, url_prefix="/rental")
app.register_blueprint(bp_users, url_prefix="/users")
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(bp_motor, url_prefix="/motor")


if __name__ == "__main__":
    print(f"Starting server on port {app.config['APP_PORT']}...")
    app.run(port=app.config["APP_PORT"], debug=True)
