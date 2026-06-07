from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import get_connection

apps_bp = Blueprint("applications", __name__)

@apps_bp.route("/", methods=["GET"])
@jwt_required()
def get_applications():
    user_id = get_jwt_identity()
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM applications WHERE user_id=%s ORDER BY created_at DESC", (user_id,))
            apps = cur.fetchall()
        return jsonify(apps), 200
    finally:
        conn.close()

@apps_bp.route("/", methods=["POST"])
@jwt_required()
def create_application():
    user_id = get_jwt_identity()
    data = request.json
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO applications
                (user_id, company_name, role_title, job_description,
                 status, applied_date, deadline, location, salary_range, notes)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            """, (user_id, data.get("company_name"), data.get("role_title"),
                data.get("job_description"), data.get("status", "Saved"),
                data.get("applied_date") or None, data.get("deadline") or None,
                data.get("location"), data.get("salary_range"), data.get("notes")))
            conn.commit()
        return jsonify({"message": "Created"}), 201
    finally:
        conn.close()

@apps_bp.route("/<int:app_id>", methods=["PUT"])
@jwt_required()
def update_application(app_id):
    user_id = get_jwt_identity()
    data = request.json
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE applications SET
                company_name=%s, role_title=%s, job_description=%s,
                status=%s, applied_date=%s, deadline=%s,
                location=%s, salary_range=%s, notes=%s
                WHERE id=%s AND user_id=%s
            """, (data.get("company_name"), data.get("role_title"),
                data.get("job_description"), data.get("status"),
                data.get("applied_date") or None, data.get("deadline") or None,
                data.get("location"), data.get("salary_range"),
                data.get("notes"), app_id, user_id))
            conn.commit()
        return jsonify({"message": "Updated"}), 200
    finally:
        conn.close()

@apps_bp.route("/<int:app_id>", methods=["DELETE"])
@jwt_required()
def delete_application(app_id):
    user_id = get_jwt_identity()
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM applications WHERE id=%s AND user_id=%s", (app_id, user_id))
            conn.commit()
        return jsonify({"message": "Deleted"}), 200
    finally:
        conn.close()