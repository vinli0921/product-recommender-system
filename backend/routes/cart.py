from fastapi import APIRouter
from typing import List
from backend.models import CartItem

router = APIRouter()

@router.get("/cart/{user_id}", response_model=List[CartItem])
def get_cart(user_id: int):
    return []

@router.post("/cart", status_code=204)
def add_to_cart(item: CartItem):
    return

@router.put("/cart", status_code=204)
def update_cart(item: CartItem):
    return

@router.delete("/cart", status_code=204)
def remove_from_cart(item: CartItem):
    return
