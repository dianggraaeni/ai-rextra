import sys
import time
import uuid
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

MONGO_URI = "mongodb://admin:yourSecurePassword123@localhost:27019/ai_rextra?authSource=admin"
MONGO_DB_NAME = "ai_rextra"


def connect_to_mongo():
    """
    Connect to MongoDB using the defined URI.
    """
    try:
        print(f"Attempting to connect to MongoDB at {MONGO_URI}...")
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        db = client[MONGO_DB_NAME]
        print("MongoDB connection successful.")
        return db
    except ConnectionFailure as e:
        print(f"Could not connect to MongoDB: {e}", file=sys.stderr)
        raise

def generate_hashes(num_hashes=100):
    """
    Generate a specified number of unique hashes, store them in the database,
    and append them to a text file.
    """
    db = connect_to_mongo()
    assessments_collection = db.assessments

    with open('hashes.txt', 'a') as f:  # Append mode
        for i in range(num_hashes):
            unique_hash = str(uuid.uuid4())
            
            # Store in database
            assessments_collection.insert_one({
                "hash": unique_hash,
                "status": "pending",
                "created_at": time.time(),
                "results": None
            })
            
            # Append to file
            f.write(unique_hash + '\n')
            
            print(f"Generated and stored hash {i+1}: {unique_hash}")

    print(f"Successfully generated and stored {num_hashes} hashes.")

if __name__ == "__main__":
    generate_hashes(100)