from fastapi import APIRouter
import pandas as pd
import os

router = APIRouter()

# Load template to extract available data
DATA_TEMPLATE_PATH = "backend/data/predict_template.csv"
template = pd.read_csv(DATA_TEMPLATE_PATH) if os.path.exists(DATA_TEMPLATE_PATH) else pd.DataFrame()

@router.get("/products")
def get_products():
    product_cols = [col for col in template.columns if col not in ["month_number", "year", "warehouse_location"]]
    return {"products": product_cols}

@router.get("/cities")
def get_cities():
    if "warehouse_location" in template.columns:
        cities = sorted(template["warehouse_location"].unique().tolist())
        return {"cities": cities}
    return {"cities": []}

@router.get("/months")
def get_months():
    return {"months": list(range(1, 13))}



