from flask import Flask, render_template
from flask_cors import CORS
from routes.auth_routes import auth

app = Flask(
    __name__,
    template_folder="../frontend",
    static_folder="../frontend",
    static_url_path=""
)
CORS(app)

app.register_blueprint(auth, url_prefix="/api/auth")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/login")
def login_page():
    return render_template("auth.html")

if __name__ == "__main__":
    app.run(debug=True)