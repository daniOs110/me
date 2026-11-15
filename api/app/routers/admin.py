from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Request

from app.auth import (
    admin_password,
    issue_token,
    note_failure,
    password_matches,
    require_admin,
    too_many_attempts,
)
from app.schemas import LoginIn, NowSnapshot, TokenOut
from app.store import write_now

router = APIRouter()


@router.post("/login", response_model=TokenOut)
def login(body: LoginIn, request: Request) -> TokenOut:
    ip = request.client.host if request.client else "unknown"
    if too_many_attempts(ip):
        raise HTTPException(status_code=429, detail="too many attempts")
    expected = admin_password()
    if not expected:
        raise HTTPException(status_code=503, detail="admin password is not configured")
    if not password_matches(body.password, expected):
        note_failure(ip)
        raise HTTPException(status_code=401, detail="invalid password")
    return TokenOut(token=issue_token())


@router.get("/session")
def session(_: None = Depends(require_admin)) -> dict[str, bool]:
    return {"ok": True}


@router.put("/now", response_model=NowSnapshot)
def update_now(body: NowSnapshot, _: None = Depends(require_admin)) -> NowSnapshot:
    saved = body.model_copy(update={"updated": date.today().isoformat()})
    write_now(saved)
    return saved
