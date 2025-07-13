from flask import Flask, request, jsonify, render_template_string
import os
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# MySQL connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Vijaysaini@2601",
    database="inventory"
)
cursor = db.cursor()

# Correct HTML file path
HTML_PATH = os.path.join(os.path.dirname(__file__), "qrscanner.html")

@app.route('/')
def home():
    return "✅ Smart Inventory API is Running"

@app.route('/qrscanner')
def serve_qrscanner():
    try:
        with open(HTML_PATH, "r", encoding="utf-8") as f:
            return render_template_string(f.read())
    except Exception as e:
        return f"❌ Error loading HTML: {str(e)}", 500

@app.route('/api/batch', methods=['POST'])
def add_batch():
    data = request.get_json()
    try:
        sql = """
            INSERT INTO batches (
                batch_id, product_id, product_name, category,
                quantity, remaining_quantity, expiry_date, entry_date
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            data['batch_id'],
            data['product_id'],
            data['product_name'],
            data['category'],
            data['quantity'],
            data['quantity'],
            data['expiry_date'],
            data['entry_date']
        )
        cursor.execute(sql, values)
        db.commit()
        return jsonify({"message": "✅ Batch added successfully"}), 201
    except Exception as e:
        return jsonify({"message": f"❌ Error: {str(e)}"}), 400

@app.route('/api/delete', methods=['POST'])
def delete_batch():
    data = request.get_json()
    try:
        cursor.execute("DELETE FROM batches WHERE batch_id = %s", (data['batch_id'],))
        db.commit()
        return jsonify({"message": f"❌ Batch {data['batch_id']} deleted"}), 200
    except Exception as e:
        return jsonify({"message": f"❌ Error: {str(e)}"}), 400

@app.route('/api/reduce_stock', methods=['POST'])
def reduce_stock():
    data = request.get_json()
    batch_id = data.get('batch_id')

    try:
        cursor.execute("SELECT remaining_quantity FROM batches WHERE batch_id = %s", (batch_id,))
        result = cursor.fetchone()

        if not result:
            return jsonify({"message": "❌ Batch not found"}), 404

        current_qty = result[0]
        if current_qty <= 0:
            return jsonify({"message": "⚠️ No remaining stock to reduce"}), 400

        cursor.execute("UPDATE batches SET remaining_quantity = remaining_quantity - 1 WHERE batch_id = %s", (batch_id,))
        db.commit()

        return jsonify({"message": "✅ Remaining stock reduced by 1"}), 200
    except Exception as e:
        return jsonify({"message": f"❌ Error: {str(e)}"}), 500

@app.route('/api/ping')
def ping():
    return jsonify({"message": "pong"})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
