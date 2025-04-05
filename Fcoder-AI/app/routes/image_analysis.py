from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from typing import Optional
from app.services.gemini_service import gemini_service
from app.dependencies.auth import get_api_key

router = APIRouter()

@router.post("/analyze-image", dependencies=[Depends(get_api_key)])
async def analyze_image_endpoint(
    file: UploadFile = File(...),
):
    allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg']
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Unsupported image type")
    
    response = await gemini_service.analyze_image(file)
    
    return {"analysis": response}