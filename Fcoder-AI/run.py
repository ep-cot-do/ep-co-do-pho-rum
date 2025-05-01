import uvicorn
from app.config import settings

def main():
    """
    Run the FastAPI application
    """
    uvicorn.run(
        "app.main:app", 
        host=settings.APP_HOST, 
        port=settings.APP_PORT,
        reload=settings.DEBUG
    )

if __name__ == "__main__":
    main()