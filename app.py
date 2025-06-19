import os, json
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-pro")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(BASE_DIR, "characters.json")) as f:
    characters = {c["name"]: c for c in json.load(f)}

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data["message"]
    char = characters[data["character"]]
    prompt = [char["prompt"], message]
    response = model.generate_content(prompt)
    return jsonify({"reply": response.text})

if __name__ == "__main__":
    app.run(debug=True)
