from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
import os

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = Config.JWT_SECRET_KEY
app.config["UPLOAD_FOLDER"] = Config.UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = Config.MAX_CONTENT_LENGTH

CORS(app, origins=["http://localhost:3000", "https://internship-tracker-lime-seven.vercel.app"])
jwt = JWTManager(app)

os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)

from routes.auth import auth_bp
from routes.applications import apps_bp
from routes.cv import cv_bp

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(apps_bp, url_prefix="/api/applications")
app.register_blueprint(cv_bp, url_prefix="/api/cv")
@app.route('/setup')
def setup():
    from db import get_connection
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255)
    )''')
    cursor.execute('''CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        company VARCHAR(255),
        position VARCHAR(255),
        status VARCHAR(100),
        date_applied DATE
    )''')
    @app.route('/clearusers')
def clear_users():
    from db import get_connection
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users")
    conn.commit()
    conn.close()
    return "Users cleared!"
    conn.commit()
    conn.close()
    return "Tables created!"
if __name__ == "__main__":
    app.run(debug=True, port=5000)
