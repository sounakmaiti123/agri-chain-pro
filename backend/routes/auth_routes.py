from flask import Blueprint, request, jsonify
from config import users_collection
import bcrypt

auth = Blueprint("auth", __name__)

# ================= SIGNUP =================
@auth.route("/signup", methods=["POST"])
def signup():

    data = request.json

    name = data.get("name")        # ✅ ADD
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")        # ✅ ADD

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400

    hashed_pw = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

    users_collection.insert_one({
    "name": data.get("name"),
    "email": email,
    "password": hashed_pw,
    "role": data.get("role")
})

    return jsonify({"message": "Signup successful"})


# ================= LOGIN =================
@auth.route("/login", methods=["POST"])
def login():

    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = users_collection.find_one({"email": email})

    if not user:
        return jsonify({"error": "User not found"}), 404

    stored_password = user["password"]

    if bcrypt.checkpw(password.encode("utf-8"), bytes(stored_password)):
        return jsonify({
    "message": "Login successful",
    "email": user["email"],
    "role": user.get("role"),
    "name": user.get("name"),
    "profileImage": user.get("profileImage")  # 🔥 ADD THIS
}), 200

    return jsonify({"error": "Invalid credentials"}), 401
# ================= PROFILE IMAGE UPLOAD =================

@auth.route("/upload-profile", methods=["POST"])
def upload_profile():

    data = request.json
    email = data.get("email")
    image = data.get("image")

    if not email or not image:
        return jsonify({"error": "Missing data"}), 400

    # update user
    users_collection.update_one(
        {"email": email},
        {"$set": {"profileImage": image}}
    )

    return jsonify({
        "message": "Profile image updated",
        "image": image
    }), 200