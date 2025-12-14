import os
from dotenv import load_dotenv

# Muat variabel dari file .env di root direktori
# Path ini relatif terhadap lokasi di mana run.py dijalankan
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

# OpenRouter API Configuration
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

# Flask Configuration
SECRET_KEY = os.getenv('SECRET_KEY', 'default-secret-key-for-development')

# MongoDB Configuration
MONGO_URI = os.getenv('MONGO_URI')
MONGO_DB_NAME = os.getenv('MONGO_DB_NAME')