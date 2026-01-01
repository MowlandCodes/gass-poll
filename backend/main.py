from dotenv import load_dotenv
from flask import Flask
from libs.connection import db

load_dotenv()
app = Flask(__name__)



if __name__ == "__main__":
    app.run(port=9900, debug=True)
