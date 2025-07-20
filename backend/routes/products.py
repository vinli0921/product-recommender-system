from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from typing import List
from models import Product
from services.kafka_service import KafkaService
from services.feast_service import FeastService
from routes.auth import get_current_user  # to resolve JWT user
from PIL import Image

router = APIRouter()

@router.get("/products/search", response_model=List[Product])
async def search_products_by_text(query: str, k: int = 5):
    """
    Search products by text query
    """
    try:
        feast = FeastService()
        return feast.search_item_by_text(query, k)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/products/search/image_link", response_model=List[Product])
async def search_products_by_image_link(image_link: str, k: int = 5):
    """
    Search products by image_link
    """
    try:
        feast = FeastService()
        return feast.search_item_by_image_link(image_link, k)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/products/search/image", response_model=List[Product])
async def search_products_by_image(image: UploadFile = File(...), k: int = 5):
    """
    Search products by image
    """
    try:
        feast = FeastService()
        # Convert uploaded file to PIL.Image
        pil_image.verify()
        image.file.seek(0)
        pil_image = Image.open(image.file)
        return feast.search_item_by_image_file(pil_image, k)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str, user_id = Depends(get_current_user)):
    """
    Get product details by ID
    """
    # Send view interaction to Kafka
    KafkaService().send_interaction(
        user_id=user_id,
        item_id=product_id,
        interaction_type='negative_view'
    )
    
    try:
        feast = FeastService()
        return feast.get_item_by_id(product_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/products/{product_id}/interactions/click", status_code=204)
async def record_product_click(product_id: str, user_id = Depends(get_current_user)):
    """
    Records a product click interaction event
    """
    KafkaService().send_interaction(
        user_id=user_id,
        item_id=product_id,
        interaction_type='positive_view'
    )
    return
