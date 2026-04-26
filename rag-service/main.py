from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Smart Warehouse RAG Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "RAG-based AI Assistant Service API"}

@app.post("/query")
async def process_query(data: dict):
    """
    Mock endpoint for RAG query processing.
    Eventually retrieves context from FAISS and generates response via LLM.
    """
    user_query = data.get("query", "")
    
    # Mock RAG response
    return {
        "query": user_query,
        "answer": f"Based on the warehouse documents, here is the answer for your query: '{user_query}'",
        "sources": ["inventory_manual_v1.pdf", "warehouse_layout_2024.json"],
        "status": "success"
    }
