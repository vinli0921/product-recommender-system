import os
from dotenv import load_dotenv

load_dotenv()

# Expected format: postgresql://username:password@host:port/database_name
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://myuser:mypassword@localhost:5432/db")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is not set.")

# Convert the URL for async
ASYNC_DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
