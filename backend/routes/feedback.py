from fastapi import APIRouter
from backend.models import Feedback

router = APIRouter()

@router.post("/feedback", status_code=204)
def submit_feedback(payload: Feedback):
    return
