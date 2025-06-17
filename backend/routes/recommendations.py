from fastapi import APIRouter
from typing import List
from backend.models import Product
from backend.feast_service import feast_service
router = APIRouter()

@router.get("/recommendations/{user_id}", response_model=List[Product])
def get_recommendations(user_id: int):
    items = feast_service.load_items_exiting_user(user_id)
    return items
