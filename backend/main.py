from dotenv import load_dotenv
import os
from pymongo import MongoClient

if __name__ == "__main__":
    # On charge les variables d'environnement
    load_dotenv()

    host = os.getenv("DB_HOST")
    user = os.getenv("DB_USER")
    password = os.getenv("DB_PASSWORD")

    client = MongoClient(f"mongodb://{host}:27017/")
    print(client)