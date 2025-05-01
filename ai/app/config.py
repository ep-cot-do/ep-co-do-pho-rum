import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings:
    # Gemini API Configuration
    GEMINI_API_KEY: str = os.getenv('GEMINI_API_KEY', '')
    APP_API_KEY: str = os.getenv('APP_API_KEY', '')
    
    # Application Settings
    DEBUG: bool = os.getenv('DEBUG', 'False').lower() == 'true'
    APP_HOST: str = os.getenv('APP_HOST', '0.0.0.0')
    APP_PORT: int = int(os.getenv('APP_PORT', 9090))

    # Validate Gemini API Key
    @classmethod
    def validate_config(cls):
        if not cls.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY must be set in .env file")

# Create settings instance
settings = Settings()