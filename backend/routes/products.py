from fastapi import APIRouter
from typing import List
from backend.models import Product

router = APIRouter()

'''
@router.post("/search", response_model=List[Product])
def search_products(query: SearchQuery):
    return []
'''
@router.get("/product/{product_id}", response_model=Product)
def get_product(product_id: int):
    return Product(
        item_id=product_id,
        name="Lenovo",
        category="Tech",
        subcategory="Laptop",
        price=999.99,
        avg_rating=4.5,
        num_ratings=120,
        popular=0.4,
        new_arrival=0.3,
        on_sale=0.3,
        arrival_date="2024-01-01"
    )
