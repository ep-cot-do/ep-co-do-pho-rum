from fastapi import APIRouter, Depends
from app.models.request_models import ChatRequest
from app.services.gemini_service import gemini_service
from app.dependencies.auth import get_api_key

router = APIRouter()

@router.post("/chat", dependencies=[Depends(get_api_key)])
async def chat_endpoint(
    request: ChatRequest,
):
    response = await gemini_service.get_chat_response(request.prompt)
    return {"response": response}