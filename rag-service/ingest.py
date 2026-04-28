import os
from dotenv import load_dotenv
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings
from langchain_community.vectorstores import FAISS

load_dotenv()

def build_vector_db():
    print("🚀 Starting knowledge base ingestion...")
    
    # Check for data folder
    if not os.path.exists('./data'):
        print("❌ Error: No ./data folder found.")
        return

    # 1. Load documents
    loader = DirectoryLoader('./data', glob="./*.txt", loader_cls=TextLoader)
    docs = loader.load()
    print(f"📄 Loaded {len(docs)} documents.")

    # 2. Split into chunks for better retrieval
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    splits = text_splitter.split_documents(docs)
    print(f"✂️ Split documents into {len(splits)} chunks.")

    # 3. Create Embeddings (Using NVIDIA's official endpoint)
    embeddings = NVIDIAEmbeddings(
        model="nvidia/nv-embed-v1", 
        api_key=os.getenv("OPENAI_API_KEY")
    )

    # 4. Build and Save to FAISS (Vector DB)
    print("🧠 Generating embeddings and building FAISS index...")
    vectorstore = FAISS.from_documents(splits, embeddings)
    vectorstore.save_local("vector_store")
    print("✅ Success! Vector database saved to ./vector_store")

if __name__ == "__main__":
    build_vector_db()
