from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
import os

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = Config.JWT_SECRET_KEY
app.config["UPLOAD_FOLDER"] = Config.UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = Config.MAX_CONTENT_LENGTH

CORS(app, origins=["http://localhost:3000"])
jwt = JWTManager(app)

os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)

from routes.auth import auth_bp
from routes.applications import apps_bp
from routes.cv import cv_bp

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(apps_bp, url_prefix="/api/applications")
app.register_blueprint(cv_bp, url_prefix="/api/cv")

if __name__ == "__main__":
    app.run(debug=True, port=5000)