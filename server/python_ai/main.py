from fastapi import FastAPI, UploadFile, File
import os
import shutil

from pydantic import BaseModel

from rag_pipeline import ask_question, build_vectorstore

app = FastAPI(title="Nexus Python AI Service")

UPLOAD_FOLDER = os.getenv("PY_AI_UPLOAD_DIR", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


class QuestionRequest(BaseModel):
    question: str


@app.get("/")
async def root():
    return {"message": "Nexus Python AI Service", "status": "running"}


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        return {"message": "Only PDF files are indexed for retrieval."}

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    build_vectorstore(UPLOAD_FOLDER)
    return {"message": "File uploaded and indexed successfully"}


@app.post("/ask")
async def ask(req: QuestionRequest):
    answer = ask_question(req.question)
    return {"answer": answer}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
