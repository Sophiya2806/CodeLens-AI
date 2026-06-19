export const MOCK_CODE = `import jwt
import sqlite3
from flask import Flask, request, jsonify

app = Flask(__name__)
SECRET_KEY = "super-secret-hardcoded-key-123"

def get_user(user_id):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    # POTENTIAL SQL INJECTION BELOW
    query = "SELECT * FROM users WHERE id = '" + user_id + "'"
    cursor.execute(query)
    return cursor.fetchone()

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    # Weak authentication logic
    if username == "admin" and password == "password123":
        token = jwt.encode({"user": username}, SECRET_KEY, algorithm="HS256")
        return jsonify({"token": token})
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/profile')
def profile():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"error": "Missing token"}), 403
    try:
        # Insecure JWT verification (no expiration check)
        data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return jsonify({"user": data['user']})
    except:
        return jsonify({"error": "Invalid token"}), 401

if __name__ == '__main__':
    app.run(debug=True)`;

export const FILE_STRUCTURE = [
  { id: 'app.py', name: 'app.py', type: 'file', content: MOCK_CODE },
  { id: 'utils.py', name: 'utils.py', type: 'file', content: 'def helper():\n    pass' },
  { id: 'db.py', name: 'db.py', type: 'file', content: 'import sqlite3\n# database logic' },
  { id: 'requirements.txt', name: 'requirements.txt', type: 'file', content: 'flask\npyjwt\nsqlite3' },
];
