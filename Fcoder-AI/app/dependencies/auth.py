from fastapi import HTTPException, Security
from fastapi.security import APIKeyHeader
from app.config import settings

async def get_api_key(api_key_header: str = Security(APIKeyHeader(name="X-API-Key", auto_error=False))):
    if not settings.APP_API_KEY:
        return True
    
    if api_key_header != settings.APP_API_KEY:
        raise HTTPException(
            status_code=403, 
            detail="Invalid or missing API key or check autherize key at top of the page"
        )
    
    return True