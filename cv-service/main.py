from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Smart Warehouse CV Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Computer Vision Monitoring Service API"}

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    """
    Mock endpoint for YOLO object detection.
    Eventually processes the uploaded image through YOLO.
    """
    # Mock detection result
    return {
        "filename": file.filename,
        "detections": [
            {"label": "pallet", "confidence": 0.92, "box": [100, 150, 400, 500]},
            {"label": "forklift", "confidence": 0.88, "box": [50, 200, 300, 450]}
        ],
        "status": "success",
        "model": os.getenv("YOLO_MODEL", "yolov8n.pt")
    }
