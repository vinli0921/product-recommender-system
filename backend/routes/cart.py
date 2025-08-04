from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from database.db import get_db
from database.models_sql import CartItem as CartItemDB
from models import CartItem, InteractionType
from services.kafka_service import KafkaService

router = APIRouter()


@router.get("/cart/{user_id}", response_model=List[CartItem])
async def get_cart(user_id: str, db: AsyncSession = Depends(get_db)):
    # Get cart items from database
    stmt = select(CartItemDB).where(CartItemDB.user_id == user_id)
    result = await db.execute(stmt)
    cart_items = result.scalars().all()

    # Convert to Pydantic models
    return [
        CartItem(
            user_id=item.user_id,
            product_id=item.product_id,
            quantity=item.quantity,
        )
        for item in cart_items
    ]


@router.post("/cart", status_code=204)
async def add_to_cart(item: CartItem, db: AsyncSession = Depends(get_db)):
<<<<<<< HEAD
    KafkaService().send_interaction(item.user_id, item.product_id, InteractionType.CART.value)
=======
    KafkaService().send_interaction(
        item.user_id, item.product_id, InteractionType.CART.value
    )
>>>>>>> aa629f2bc3c11f3a996d1c8a6184fada69c95489

    # Check if item already exists in cart
    stmt = select(CartItemDB).where(
        CartItemDB.user_id == item.user_id,
        CartItemDB.product_id == item.product_id,
    )
    result = await db.execute(stmt)
    existing_item = result.scalar_one_or_none()

    if existing_item:
        # Update quantity
        existing_item.quantity += item.quantity or 1
    else:
        # Add new item
        new_item = CartItemDB(
            user_id=item.user_id,
            product_id=item.product_id,
            quantity=item.quantity or 1,
        )
        db.add(new_item)

    await db.commit()
    return


@router.put("/cart", status_code=204)
async def update_cart(item: CartItem, db: AsyncSession = Depends(get_db)):
    # Find and update item
    stmt = select(CartItemDB).where(
        CartItemDB.user_id == item.user_id,
        CartItemDB.product_id == item.product_id,
    )
    result = await db.execute(stmt)
    existing_item = result.scalar_one_or_none()

    if existing_item:
        existing_item.quantity = item.quantity or 1
        await db.commit()

    return


@router.delete("/cart", status_code=204)
async def remove_from_cart(item: CartItem, db: AsyncSession = Depends(get_db)):
    # Delete item from cart
    stmt = delete(CartItemDB).where(
        CartItemDB.user_id == item.user_id,
        CartItemDB.product_id == item.product_id,
    )
    await db.execute(stmt)
    await db.commit()
    return
