from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Smart Warehouse ML Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Demand Forecasting Service API"}

@app.post("/forecast")
async def get_forecast(data: dict):
    """
    Mock endpoint for demand forecasting.
    Expects historical sales/inventory data.
    """
    # Placeholder for actual XGBoost/Regression logic
    item_id = data.get("item_id", "unknown")
    historical_avg = sum(data.get("history", [10, 20, 15])) / 3
    prediction = historical_avg * 1.1  # Simple mock logic: 10% growth
    
    return {
        "item_id": item_id,
        "forecasted_demand": round(prediction, 2),
        "confidence_score": 0.85,
        "model_used": os.getenv("MODEL_NAME", "xgboost_v1")
    }
