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
ADDITIONAL_ALLOWED_ORIGINS = os.getenv("ADDITIONAL_ALLOWED_ORIGINS", "").split(",")

CORS_ORIGINS = [FRONTEND_URL]

if ADDITIONAL_ALLOWED_ORIGINS != "" and ADDITIONAL_ALLOWED_ORIGINS != [""]:
    CORS_ORIGINS.extend(ADDITIONAL_ALLOWED_ORIGINS)


app = Flask(__name__, static_folder="./public", static_url_path="/public")
app.config["SECRET_KEY"] = os.getenv("APP_SECRET_KEY")
app.config["APP_PORT"] = int(os.getenv("APP_PORT", 5000))
app.config["APP_HOST"] = os.getenv("APP_HOST", "localhost")

jwt = JWTManager(app)


@jwt.token_in_blocklist_loader
def check_if_token_revoked(__header__, jwt_payload):
    jti = jwt_payload["jti"]
    token = db.token_blocklist.find_one({"jti": jti})
    return token is not None


@jwt.revoked_token_loader
def revoked_token_callback(__header__, __jwt_payload__):
    return {"message": "Unauthorized"}, 401


CORS(app, origins=CORS_ORIGINS, supports_credentials=True, allow_private_network=True)

app.register_blueprint(bp_rental, url_prefix="/rental")
app.register_blueprint(bp_users, url_prefix="/users")
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(bp_motor, url_prefix="/motor")


if __name__ == "__main__":
    print(f"✅ Allowed origins: {CORS_ORIGINS}")
    print(f"🚀 Starting server on port {app.config['APP_PORT']}...")
    app.run(host=app.config["APP_HOST"], port=app.config["APP_PORT"], debug=True)
