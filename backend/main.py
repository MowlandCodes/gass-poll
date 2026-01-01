import os
from flask import Flask
from dotenv import load_dotenv
load_dotenv()

from resources.rental import bp_rental
from resources.users import bp_users

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('APP_SECRET_KEY')
app.config['APP_PORT'] = int(os.getenv('APP_PORT', 5000))

app.register_blueprint(bp_rental, url_prefix='/rental')
app.register_blueprint(bp_users, url_prefix='/users')

if __name__ == '__main__':
    print(f"Starting server on port {app.config['APP_PORT']}...")
    app.run(port=app.config['APP_PORT'], debug=True)

