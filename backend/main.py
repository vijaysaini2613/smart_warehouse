from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.predict import router as predict_router
from api.suggest import router as suggest_router

app = FastAPI(
    title="Smart Warehouse API",
    version="1.0.0",
    description="ML-powered backend for demand prediction and cabinet suggestions."
)

# ✅ Allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with exact frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Simple health check
@app.get("/ping")
def ping():
    return {"message": "Smart Warehouse API is alive!"}

# ✅ Route includes
app.include_router(predict_router, prefix="/predict")
app.include_router(suggest_router, prefix="/suggest")

@app.get("/")
def root():
    return {"message": "Welcome to Smart Warehouse API 🚀"}

