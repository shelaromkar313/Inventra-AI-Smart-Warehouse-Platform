from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from openai import OpenAI
from langchain_community.vectorstores import FAISS
from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings

load_dotenv()

app = FastAPI(title="Smart Warehouse RAG Service")

# Initialize NVIDIA API Clients
client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=os.getenv("OPENAI_API_KEY")
)

# Initialize Embedding Model for Retrieval
embeddings = NVIDIAEmbeddings(
    model="nvidia/nv-embed-v1", 
    api_key=os.getenv("OPENAI_API_KEY")
)

# Load Vector Database (if it exists)
vector_db = None
if os.path.exists("./vector_store"):
    vector_db = FAISS.load_local("vector_store", embeddings, allow_dangerous_deserialization=True)
    print("📢 Vector database loaded successfully.")
else:
    print("⚠️ Warning: No vector database found. Run ingest.py first.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "RAG-based AI Assistant Service API (NVIDIA + Vector DB)"}

@app.post("/query")
async def process_query(data: dict):
    user_query = data.get("query", "")
    
    # 1. RETRIEVAL: Find relevant chunks in the manual
    context = ""
    sources = ["General Knowledge"]
    
    if vector_db:
        docs = vector_db.similarity_search(user_query, k=2)
        context = "\n".join([d.page_content for d in docs])
        sources = list(set([d.metadata.get('source', 'Manual') for d in docs]))

    # 2. PROMPT AUGMENTATION
    system_prompt = "You are a Smart Warehouse Assistant. Use the following context to answer the user question. If the answer is not in the context, use your general knowledge but mention it."
    full_prompt = f"Context: {context}\n\nUser Question: {user_query}" if context else user_query

    try:
        completion = client.chat.completions.create(
            model="meta/llama-3.1-70b-instruct",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": full_prompt}
            ],
            temperature=0.2,
            top_p=0.7,
            max_tokens=1024,
            stream=False
        )

        answer = completion.choices[0].message.content

        return {
            "query": user_query,
            "answer": answer,
            "sources": sources,
            "status": "success"
        }
    except Exception as e:
        return {
            "query": user_query,
            "answer": f"Error calling NVIDIA AI: {str(e)}",
            "status": "error"
        }
