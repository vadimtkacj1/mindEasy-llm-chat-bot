import traceback
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel
import uvicorn
from main import ChatbotProcessor

app = FastAPI()
processor = ChatbotProcessor()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    current_model: str

class ModelInfoResponse(BaseModel):
    available_models: List[str]
    current_model: str

class ModelUpdateRequest(BaseModel):
    model_name: str

class ErrorResponse(BaseModel):
    error: str
    traceback: str | None = None

@app.get("/")
async def index():
    return {"message": "AI Chatbot API is running"}

@app.get("/models", response_model=ModelInfoResponse)
async def get_models():
    return {
        "available_models": processor.get_available_models(),
        "current_model": processor.get_current_model()
    }

@app.post("/models", response_model=ModelInfoResponse)
async def update_model(request: ModelUpdateRequest):
    try:
        processor.set_model(request.model_name)
        return {
            "available_models": processor.get_available_models(),
            "current_model": processor.get_current_model()
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": str(e),
                "traceback": traceback.format_exc()
            }
        )

@app.post("/chat", response_model=ChatResponse, responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}})
async def chat(chat_request: ChatRequest):
    try:
        if not chat_request.message:
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        response = processor.handle_query(chat_request.message)
        return {
            "response": response,
            "current_model": processor.get_current_model()
        }
    except HTTPException:
        raise  # Re-raise HTTPExceptions
    except Exception as e:
        error_detail = {
            "error": str(e),
            "traceback": traceback.format_exc()
        }
        raise HTTPException(
            status_code=500,
            detail=error_detail
        )
    
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)