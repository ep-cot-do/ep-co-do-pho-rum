from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from fastapi.openapi.docs import get_swagger_ui_html

from app.config import settings
from app.routes import chat, image_analysis, image_generation

def create_app() -> FastAPI:
    """
    Create and configure FastAPI application
    """
    # Validate configuration
    settings.validate_config()
    
    # Initialize FastAPI app
    app = FastAPI(
        title="Fcoder Bot API",
        description="Advanced AI Chatbot with Text, Image Analysis",
        version="1.0.0",
        docs_url=None,
        redoc_url=None
    )
    
    def custom_openapi():
        if app.openapi_schema:
            return app.openapi_schema
        
        openapi_schema = get_openapi(
            title=app.title,
            version=app.version,
            description=app.description,
            routes=app.routes,
        )
        app.openapi_schema = openapi_schema
        return app.openapi_schema
    
    app.openapi = custom_openapi
    
    # Swagger UI route
    @app.get("/docs", include_in_schema=False)
    async def custom_swagger_ui_html():
        return get_swagger_ui_html(
            openapi_url="/openapi.json",
            title="Fcoder Bot API"
        )
    
    # CORS Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include routers
    app.include_router(chat.router, tags=["Chat"])
    app.include_router(image_analysis.router, tags=["Image Analysis"])
    app.include_router(image_generation.router, tags=["Image Generation"])
     
    # Ping Check Endpoint
    @app.get("/ping")
    async def ping_check():
        return {"status": "pong"}
    
    return app

# Create app instance
app = create_app()