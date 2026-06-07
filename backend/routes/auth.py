from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from flask_bcrypt import Bcrypt
from db import get_connection

auth_bp = Blueprint("auth", __name__)
bcrypt = Bcrypt()

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    if not all([name, email, password]):
        return jsonify({"error": "All fields required"}), 400
    hashed = bcrypt.generate_password_hash(password).decode("utf-8")
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s)", (name, email, hashed))
            conn.commit()
            user_id = cur.lastrowid
        token = create_access_token(identity=str(user_id))
        return jsonify({"token": token, "name": name}), 201
    except Exception:
        return jsonify({"error": "Email already exists"}), 409
    finally:
        conn.close()

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM users WHERE email=%s", (email,))
            user = cur.fetchone()
        if not user or not bcrypt.check_password_hash(user["password_hash"], password):
            return jsonify({"error": "Invalid credentials"}), 401
        token = create_access_token(identity=str(user["id"]))
        return jsonify({"token": token, "name": user["name"]}), 200
    finally:
        conn.close()