from dotenv import load_dotenv
import os

load_dotenv()

URL = os.getenv("SQLALCHEMY_DATABASE_URL")
print(URL)