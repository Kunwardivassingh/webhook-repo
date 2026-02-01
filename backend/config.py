import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://work1234:work1234 @working.jlabcwv.mongodb.net/?appName=working")
DB_NAME = "github_events"
COLLECTION_NAME = "events"
