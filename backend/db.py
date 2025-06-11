from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from backend import config

# Async SQLAlchemy engine
engine = create_async_engine(config.ASYNC_DATABASE_URL, echo=True)

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

