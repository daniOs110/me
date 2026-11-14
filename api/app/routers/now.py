import json

from fastapi import APIRouter, HTTPException

from app.db import DATA_DIR
from app.schemas import NowSnapshot

router = APIRouter()


@router.get("/now", response_model=NowSnapshot)
def get_now() -> NowSnapshot:
    path = DATA_DIR / "now.json"
    if not path.is_file():
        raise HTTPException(status_code=500, detail="now.json missing")
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
        return NowSnapshot.model_validate(payload)
    except (OSError, json.JSONDecodeError, ValueError) as error:
        raise HTTPException(status_code=500, detail="now.json invalid") from error
