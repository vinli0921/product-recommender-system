from fastapi import APIRouter
from typing import List
from backend.models import Product

router = APIRouter()

@router.get("/recommendations/{user_id}", response_model=List[Product])
def get_recommendations(user_id: int):
    return []
