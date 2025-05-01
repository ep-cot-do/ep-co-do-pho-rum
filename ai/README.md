- Normal way

### Create virtual env first

```
python 3.10 -m venv venv
```

### Start the vitual env

```
.\venv\Scripts\activate
```

### Install the library

```
pip install -r .\requirements.txt
```

### set up the .env

```
GEMINI_API_KEY=key-ở-đây-nè

APP_API_KEY=okbri

# Application Settings
DEBUG=True
APP_HOST=0.0.0.0
APP_PORT=9090
```

### Run

```
python run.py
```

- Docker way

# Build the Docker image

docker-compose build

# Start the container

docker-compose up -d

# View logs

docker-compose logs -f Fcoder-ai

# Stop the container

docker-compose down

- Swagger UI

```
http://localhost:9090/docs
```
