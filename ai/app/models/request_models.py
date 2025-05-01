from pydantic import BaseModel, Field
from typing import Optional

class ChatRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=1000, 
                        description="Text prompt for the AI chatbot")

class ImageAnalysisRequest(BaseModel):
    prompt: Optional[str] = Field(None, 
                                  description="Optional custom prompt for image analysis")
