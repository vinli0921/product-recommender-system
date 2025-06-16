from fastapi import APIRouter
from backend.models import Feedback, InteractionType
from backend.kafka_service import kafka_service

router = APIRouter()

@router.post("/feedback", status_code=204)
def submit_feedback(payload: Feedback):
    kafka_service.send_interaction(payload.userId, payload.productId, InteractionType.RATE, payload.rating, review_title=payload.title, review_content=payload.comment)
    return #TODO add logic
