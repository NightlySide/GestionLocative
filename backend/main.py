from dotenv import load_dotenv
import os

if __name__ == "__main__":
    # On charge les variables d'environnement
    load_dotenv()

    print(os.getenv("hello"))