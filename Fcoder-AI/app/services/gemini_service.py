import base64
from fastapi import HTTPException
import aiohttp
import google.generativeai as genai
from app.config import settings

class GeminiService:
    def __init__(self):
        # config
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.chat_model = genai.GenerativeModel('gemini-2.0-flash')
        self.vision_model = genai.GenerativeModel('gemini-2.0-pro-exp-02-05')
        self.image_model_id = 'gemini-2.0-flash-exp-image-generation'
        
        self.chat_session = self.chat_model.start_chat(
            history=[
                {
                    'role': 'user',
                    'parts': ['Vietnamese only,You are an AI assistant specialized in IT(information technology). Discuss only IT-related topics.']
                },
                {
                    'role': 'model',
                    'parts': ['Understood. I will focus exclusively on topics related IT(information technology). Explain in Vietnamese only.']
                }   
            ]
        )
    
    async def get_chat_response(self, prompt: str) -> str:
        try:
            PROMPT = "The simplest and most complete answer for me, if the question don't related car then refuse answer. Question: "
            
            response = self.chat_session.send_message(PROMPT + prompt)
            return response.text
        except Exception as e:
            raise HTTPException(
                status_code=500, 
                detail=f"Error in chat response: {str(e)}"
            )
            
    async def reset_chat_session(self):
        """Reset the chat session to its initial state."""
        self.chat_session = self.chat_model.start_chat(
            history=[
                {
                    'role': 'user',
                    'parts': ['You are an AI assistant specialized in IT(information technology). Discuss only IT(information technology)-related topics.']
                },
                {
                    'role': 'model',
                    'parts': ['Understood. I will focus exclusively on topics related to IT(information technology). Explain in Vietnamese only.']
                }
            ]
        )
    
    async def analyze_image(self, image_file, prompt: str = None) -> str:
        try:
            image_bytes = await image_file.read()
            base64_image = base64.b64encode(image_bytes).decode('utf-8')
            
            image_parts = [
                {
                    'mime_type': image_file.content_type,
                    'data': base64_image
                }
            ]
            
            full_prompt = prompt or "Vietnamese only, Identify IT(information technology) related topics then give me a very short description of the IT(information technology). If not related, answer is 'Xin lỗi vì quá ngu, tôi không đọc được ảnh, gửi lại cái khác đi fen.'"
            
            response = self.vision_model.generate_content(
                [full_prompt] + image_parts
            )
            
            return response.text
        except Exception as e:
            raise HTTPException(
                status_code=500, 
                detail=f"Image analysis error: {str(e)}"
            )
    async def generate_image(self, prompt: str, input_image=None):
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.image_model_id}:generateContent"
            headers = {
                "Content-Type": "application/json",
                "x-goog-api-key": settings.GEMINI_API_KEY
            }
            enhanced_prompt = f"{prompt}. Create a high-resolution, detailed, top-quality image."
            
            request_data = {
                "contents": [
                    {
                        "role": "user",
                        "parts": [{"text": enhanced_prompt}]
                    }
                ],
                "generation_config": {
                    "temperature": 1,
                    "topP": 0.95,
                    "topK": 40,
                    "responseModalities": ["Text", "Image"]
                }
            }
            
            # Handle input image if provided
            if input_image and input_image.startswith('data:'):
                mime_type = input_image.split(';')[0].split(':')[1]
                base64_image = input_image.split(',')[1]
                
                request_data["contents"][0]["parts"].append({
                    "inlineData": {
                        "mimeType": mime_type,
                        "data": base64_image
                    }
                })
            
            async with aiohttp.ClientSession() as session:
                async with session.post(url, json=request_data, headers=headers) as response:
                    if response.status == 200:
                        result = await response.json()
                        
                        image_data = None
                        mime_type = "image/png"
                        
                        if "candidates" in result and result["candidates"]:
                            parts = result["candidates"][0]["content"]["parts"]
                            
                            for part in parts:
                                if "inlineData" in part and part["inlineData"]:
                                    image_data = part["inlineData"]["data"]
                                    mime_type = part["inlineData"].get("mimeType", "image/png")
                        
                        return {
                            "image": f"data:{mime_type};base64,{image_data}" if image_data else None,
                        }
                    else:
                        error_text = await response.text()
                        raise HTTPException(
                            status_code=response.status, 
                            detail=f"Image generation API error: {error_text}"
                        )
        except Exception as e:
            raise HTTPException(
                status_code=500, 
                detail=f"Image generation error: {str(e)}"
            )
gemini_service = GeminiService()