from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from db import get_connection
import os

cv_bp = Blueprint("cv", __name__)

@cv_bp.route("/upload", methods=["POST"])
@jwt_required()
def upload_cv():
    user_id = get_jwt_identity()
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files["file"]
    ext = file.filename.rsplit(".", 1)[-1].lower()
    if ext != "pdf":
        return jsonify({"error": "Only PDF files allowed"}), 400
    filename = secure_filename(file.filename)
    filepath = os.path.join(current_app.config["UPLOAD_FOLDER"], f"{user_id}_{filename}")
    file.save(filepath)
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM cvs WHERE user_id=%s", (user_id,))
            existing = cur.fetchone()
            if existing:
                cur.execute("UPDATE cvs SET filename=%s, filepath=%s WHERE user_id=%s", (filename, filepath, user_id))
            else:
                cur.execute("INSERT INTO cvs (user_id, filename, filepath) VALUES (%s,%s,%s)", (user_id, filename, filepath))
            conn.commit()
        return jsonify({"message": "CV uploaded"}), 201
    finally:
        conn.close()

@cv_bp.route("/", methods=["GET"])
@jwt_required()
def get_cv():
    user_id = get_jwt_identity()
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id, filename, uploaded_at FROM cvs WHERE user_id=%s", (user_id,))
            cv = cur.fetchone()
        return jsonify(cv or {}), 200
    finally:
        conn.close()