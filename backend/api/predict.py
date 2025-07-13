from fastapi import APIRouter
from pydantic import BaseModel
import pandas as pd
import joblib
import os

router = APIRouter()

class PredictRequest(BaseModel):
    city: str
    month: int

# Absolute paths (safe regardless of where app runs from)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "../models")
DATA_TEMPLATE_PATH = os.path.join(BASE_DIR, "../data/predict_template.csv")

# Load models and template once
try:
    product_models = [f.replace("_model.pkl", "") for f in os.listdir(MODEL_DIR) if f.endswith("_model.pkl")]
    print(f"✅ Loaded models: {product_models}")
except Exception as e:
    print("❌ Model folder not found or unreadable:", e)
    product_models = []

try:
    template = pd.read_csv(DATA_TEMPLATE_PATH)
    print(f"✅ Loaded template data: {template.shape}")
except Exception as e:
    print("❌ Template CSV not found or broken:", e)
    template = pd.DataFrame()

@router.post("/")
def predict_demand(request: PredictRequest):
    print(f"🟡 Received prediction request: city={request.city}, month={request.month}")

    if not product_models:
        print("❌ No models found.")
        return {"error": "Models not found."}

    if template.empty:
        print("❌ Template data is empty.")
        return {"error": "Template data not found."}

    input_df = template[
        (template["warehouse_location"] == request.city) &
        (template["month_number"] == request.month)
    ]

    if input_df.empty:
        print("❌ No matching data for this city and month.")
        print("🧾 Available locations:", template["warehouse_location"].unique())
        print("🧾 Available months:", template["month_number"].unique())
        return {"error": "No data for selected city/month."}

     # Drop non-feature columns if present
    drop_cols = [col for col in ["year"] if col in input_df.columns]
    X = input_df.drop(columns=drop_cols)

    predictions = {}
    for product in product_models:
        model_path = os.path.join(MODEL_DIR, f"{product}_model.pkl")
        try:
            model = joblib.load(model_path)
            pred = model.predict(X)
            predictions[product] = int(round(pred[0]))
        except Exception as e:
            print(f"[⚠️ ERROR] Prediction failed for {product}:", e)
            predictions[product] = None

    print("✅ Prediction complete.")
    return {
        "city": request.city,
        "month": request.month,
        "predictions": predictions  # <-- changed key to 'predictions' for frontend consistency
    }