from services.feast_service import feast_service
import asyncio
import random
import string
from datetime import date

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from database.db import get_db
from database.models_sql import User
from services.security import hash_password

# Utility: generate random email and password
def generate_email(user_id: str) -> str:
    return f"user_{user_id[-6:]}@example.com"

def generate_password(length=10) -> str:
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

async def seed_users():
    users = feast_service.get_all_existing_users()

    async for db in get_db():
        for row in users:
            user_id = str(row["user_id"])  # Treat user_id as string

            # Skip new users: 27-digit numeric strings only
            if user_id.isdigit() and len(user_id) == 27:
                continue

            result = await db.execute(select(User).where(User.user_id == user_id))
            if result.scalar_one_or_none():
                continue

            email = generate_email(user_id)
            password = generate_password()

            print(f"Seeding user: {user_id}, email: {email}")

            user = User(
                user_id=user_id,
                email=email,
                age=0,
                gender="unknown",
                signup_date=date.today(),
                preferences=row.get("preferences", ""),
                password=password,
                hashed_password=hash_password(password),
            )
            db.add(user)

        await db.commit()

if __name__ == "__main__":
    asyncio.run(seed_users())
