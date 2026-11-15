import json

from fastapi import APIRouter, HTTPException

from app.schemas import NowSnapshot
from app.store import now_path, read_now

router = APIRouter()


@router.get("/now", response_model=NowSnapshot)
def get_now() -> NowSnapshot:
    if not now_path().is_file():
        raise HTTPException(status_code=500, detail="now.json missing")
    try:
        return read_now()
    except (OSError, json.JSONDecodeError, ValueError) as error:
        raise HTTPException(status_code=500, detail="now.json invalid") from error
