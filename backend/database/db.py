from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Async SQLAlchemy engine
engine = create_async_engine(os.getenv('DATABASE_URL', None).replace("postgresql://", "postgresql+asyncpg://"), echo=True)

# Async session
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Base class for ORM
Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

