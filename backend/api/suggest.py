from fastapi import APIRouter
from pydantic import BaseModel
import pandas as pd
import os

router = APIRouter()

# Load cabinet suggestion rules CSV
RULES_PATH = "data/cabinet_suggestions.csv"
rules = pd.read_csv(RULES_PATH) if os.path.exists(RULES_PATH) else pd.DataFrame()
print("Rules loaded:", not rules.empty, "Rows:", len(rules))
print("CSV columns:", rules.columns.tolist())
print("First rows:", rules.head())

class SuggestRequest(BaseModel):
    product: str

@router.post("/")
def get_suggestions(request: SuggestRequest):
    if rules.empty:
        return {"error": "No suggestion data available."}

    product = request.product.lower()
    suggestions = rules[rules["antecedents"].str.lower() == product]
    if suggestions.empty:
        return {"message": f"No suggestions found for {request.product}"}

    result = suggestions[["consequents", "confidence", "lift"]].sort_values(by="confidence", ascending=False)
    return {
        "product": request.product,
        "suggestions": result.to_dict(orient="records")
    }

@router.get("/products")
def get_all_products():
    if rules.empty or "antecedents" not in rules.columns:
        return []
    products = sorted(rules["antecedents"].str.strip().unique())
    return products