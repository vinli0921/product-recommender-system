import asyncio
from database.create_tables import create_tables
from database.fetch_feast_users import seed_users

async def setup_all():
    await create_tables()
    await seed_users()

if __name__ == "__main__":
    asyncio.run(setup_all())
