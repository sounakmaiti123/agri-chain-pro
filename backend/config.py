from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)

# 🔥 auto creates DB when data inserted
db = client["agrichain"]
users_collection = db["users"]