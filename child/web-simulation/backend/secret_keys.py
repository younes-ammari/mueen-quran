import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
allam_api_key = os.getenv("ALLAM_API_KEY")