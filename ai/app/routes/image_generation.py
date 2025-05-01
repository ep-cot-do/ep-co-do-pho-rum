from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse, StreamingResponse
from app.models.request_models import ChatRequest
from app.services.gemini_service import gemini_service
from app.dependencies.auth import get_api_key
import base64
import io
import uuid

router = APIRouter()
image_cache = {}

@router.post("/generate-image", dependencies=[Depends(get_api_key)])
async def generate_image_endpoint(request: ChatRequest):
    result = await gemini_service.generate_image(request.prompt)

    if result.get("image"):
        base64_image = result["image"]
        
        # Tách phần dữ liệu base64 và loại MIME
        image_parts = base64_image.split(";base64,")
        if len(image_parts) != 2:
            return JSONResponse(content={"error": "Invalid image format"}, status_code=400)
        
        mime_type = image_parts[0].replace("data:", "")
        base64_data = image_parts[1]
        image_binary = base64.b64decode(base64_data)
        image_id = str(uuid.uuid4())
        image_cache[image_id] = {"data": image_binary, "mime_type": mime_type}

        return JSONResponse(
            content={
                "image_id": f"{image_id}",
                "image_base64": base64_image
            },
            media_type="application/json"
        )

    return JSONResponse(content={"error": "Failed to generate image", "description": result.get("description")}, status_code=500)


@router.get("/generate-image/stream/{image_id}")
async def stream_generated_image(image_id: str):
    image_info = image_cache.get(image_id)

    if image_info:
        return StreamingResponse(io.BytesIO(image_info["data"]), media_type=image_info["mime_type"])

    return JSONResponse(content={"error": "Image not found"}, status_code=404)
