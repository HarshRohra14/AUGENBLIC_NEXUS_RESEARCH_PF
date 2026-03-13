from fastapi import FastAPI, UploadFile, File, HTTPException
import os
from pydantic import BaseModel

app = FastAPI(title="Nexus Python AI Service")

class QuestionRequest(BaseModel):
    question: str

# Global variables for lazy loading
_rag_initialized = False
_embeddings = None
_vectorstore = None


def init_rag():
    """Lazy initialize RAG components only when needed"""
    global _rag_initialized, _embeddings, _vectorstore

    if _rag_initialized:
        return True

    try:
        # Only import when actually needed
        from langchain_huggingface import HuggingFaceEmbeddings
        from langchain_community.vectorstores import FAISS
        from langchain_groq import ChatGroq

        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            return False

        _embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        _rag_initialized = True
        return True

    except Exception as e:
        print(f"Failed to initialize RAG: {e}")
        return False


@app.get("/")
async def root():
    return {"message": "Nexus Python AI Service", "status": "running", "version": "1.0"}


@app.get("/health")
async def health():
    return {"status": "ok", "rag_ready": _rag_initialized}


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDF files are supported")

    if not init_rag():
        raise HTTPException(500, "RAG system not available - missing GROQ_API_KEY")

    return {"message": f"File {file.filename} would be processed (RAG init successful)"}


@app.post("/ask")
async def ask(req: QuestionRequest):
    if not init_rag():
        raise HTTPException(500, "RAG system not available - missing GROQ_API_KEY")

    return {"answer": f"RAG system would process: {req.question}"}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)