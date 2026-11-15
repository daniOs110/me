from fastapi import APIRouter

from app.db import save_message
from app.schemas import ContactIn, ContactOut

router = APIRouter()


@router.post("/contact", response_model=ContactOut)
def post_contact(body: ContactIn) -> ContactOut:
    save_message(body.name, body.email, body.message, body.lang)
    return ContactOut()
