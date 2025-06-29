"""
This script is used for initilizing the backend database.
This should be run by a job once per cluster.
"""

import asyncio
from database.db import engine
from database.models_sql import Base

async def create_tables():
    async with engine.begin() as conn:
        # Drop existing tables (dev only)
        await conn.run_sync(Base.metadata.drop_all)
        # Create fresh schema with updated types
        await conn.run_sync(Base.metadata.create_all)

if __name__ == "__main__":
    asyncio.run(create_tables())
