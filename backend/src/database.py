import sys
import time
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from .config import MONGO_URI, MONGO_DB_NAME
import uuid
from bson.objectid import ObjectId 

_client = None
_db = None

def connect_to_mongo():
    """
    Mengelola koneksi singleton ke MongoDB.
    Membuat koneksi baru jika belum ada, atau mengembalikan yang sudah ada.
    """
    global _client, _db
    if _client is None:
        try:
            print(f"Attempting to connect to MongoDB at {MONGO_URI}...")
            _client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
            _client.admin.command('ping')
            _db = _client[MONGO_DB_NAME]
            print("MongoDB connection successful.")
        except ConnectionFailure as e:
            print(f"Could not connect to MongoDB: {e}", file=sys.stderr)
            _client = None
            _db = None
            raise

    return _db

def generate_and_store_hash():
    """
    Menghasilkan hash unik dan menyimpannya di koleksi 'assessments'.
    Ini bisa dijalankan secara manual oleh admin untuk memberikan hash ke pengguna.
    """
    try:
        db = connect_to_mongo()
        assessments_collection = db.assessments
        unique_hash = str(uuid.uuid4())
        
        assessments_collection.insert_one({
            "hash": unique_hash,
            "status": "pending", # Status awal
            "created_at": time.time(),
            "results": None
        })
        print(f"New hash generated and stored: {unique_hash}")
        return unique_hash
    except Exception as e:
        print(f"Failed to generate and store hash: {e}")
        return None

def validate_hash(user_hash):
    """
    Memvalidasi apakah hash ada dan masih berstatus 'pending'.
    """
    try:
        db = connect_to_mongo()
        assessment = db.assessments.find_one({"hash": user_hash})
        
        if assessment and assessment.get("status") == "pending":
            return True
        return False
    except Exception as e:
        print(f"Error validating hash: {e}")
        return False

def save_assessment_results(user_hash, result_data):
    """
    Menyimpan hasil asesmen ke dokumen yang cocok dengan hash.
    """
    try:
        db = connect_to_mongo()
        db.assessments.update_one(
            {"hash": user_hash},
            {
                "$set": {
                    "results": result_data,
                    "status": "completed",
                    "completed_at": time.time()
                }
            }
        )
        print(f"Assessment results saved for hash: {user_hash}")
    except Exception as e:
        print(f"Failed to save assessment results: {e}")

def save_assessment_additional_data(user_hash, additional_data):
    """
    Menyimpan data tambahan asesmen ke dokumen yang cocok dengan hash.
    """
    try:
        db = connect_to_mongo()
        db.assessments.update_one(
            {"hash": user_hash},
            {
                "$set": {
                    "additional_data": additional_data,
                    "additional_completed_at": time.time()
                }
            }
        )
        print(f"Additional assessment data saved for hash: {user_hash}")
    except Exception as e:
        print(f"Failed to save additional assessment data: {e}")

def get_assessment_by_hash(user_hash):
    """
    Mengambil hasil asesmen berdasarkan hash.
    """
    try:
        db = connect_to_mongo()
        assessment = db.assessments.find_one({"hash": user_hash})
        return assessment.get("results") if assessment else None
    except Exception as e:
        print(f"Failed to retrieve assessment data: {e}")
        return None
        
def save_feedback(feedback_data):
    """Menyimpan data feedback ke dalam koleksi 'feedback'."""
    try:
        db = connect_to_mongo()
        feedback_collection = db.feedback
        feedback_collection.insert_one(feedback_data)
        print("Feedback data saved successfully.")
    except Exception as e:
        print(f"Failed to save feedback data: {e}")