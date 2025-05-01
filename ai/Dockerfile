
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
COPY . .

RUN pip install -r requirements.txt

EXPOSE 9090

# Use docker-compose for environment variables
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "9090"]
