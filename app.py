from flask import Flask, render_template, request, jsonify
import os
import joblib
import numpy as np

app = Flask(__name__)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "Linermodel.pkl")
model = joblib.load(MODEL_PATH)

FEATURES = [
    "House Size (sqft)",
    "Number of Bedrooms",
    "Number of Bathrooms",
    "Number of Floors",
]

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "model": "Linear Regression", "features": FEATURES})

@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(silent=True) or {}

        values = []
        for feature in FEATURES:
            if feature not in data:
                return jsonify({"success": False, "error": f"Missing field: {feature}"}), 400
            value = float(data[feature])
            if not np.isfinite(value):
                raise ValueError(f"{feature} must be a finite number")
            if value <= 0:
                return jsonify({"success": False, "error": f"{feature} must be greater than 0"}), 400
            values.append(value)

        features = np.array([values], dtype=float)
        prediction = float(model.predict(features)[0])

        return jsonify({
            "success": True,
            "prediction": round(prediction, 2),
            "currency": "INR",
            "input": dict(zip(FEATURES, values))
        })
    except ValueError as e:
        return jsonify({"success": False, "error": str(e)}), 400
    except Exception:
        return jsonify({"success": False, "error": "Prediction failed. Please check the server/model setup."}), 500

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
