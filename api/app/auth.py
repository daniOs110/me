import hashlib
import hmac
import os
import time
from collections import defaultdict

from fastapi import Header, HTTPException

TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7
MAX_ATTEMPTS = 8
WINDOW_SECONDS = 10 * 60

_attempts: dict[str, list[float]] = defaultdict(list)


def admin_password() -> str:
    return os.environ.get("ADMIN_PASSWORD", "")


def _prune(ip: str, now: float) -> list[float]:
    fresh = [stamp for stamp in _attempts[ip] if now - stamp < WINDOW_SECONDS]
    _attempts[ip] = fresh
    return fresh


def note_failure(ip: str) -> None:
    now = time.time()
    stamps = _prune(ip, now)
    stamps.append(now)
    _attempts[ip] = stamps


def too_many_attempts(ip: str) -> bool:
    return len(_prune(ip, time.time())) >= MAX_ATTEMPTS


def password_matches(given: str, expected: str) -> bool:
    given_hash = hashlib.sha256(given.encode()).digest()
    expected_hash = hashlib.sha256(expected.encode()).digest()
    return hmac.compare_digest(given_hash, expected_hash)


def issue_token() -> str:
    password = admin_password()
    expires = int(time.time()) + TOKEN_TTL_SECONDS
    message = str(expires).encode()
    signature = hmac.new(password.encode(), message, hashlib.sha256).hexdigest()
    return f"{expires}.{signature}"


def token_is_valid(token: str) -> bool:
    password = admin_password()
    if not password or "." not in token:
        return False
    expires_text, signature = token.split(".", 1)
    if not expires_text.isdigit():
        return False
    if int(expires_text) < int(time.time()):
        return False
    expected = hmac.new(password.encode(), expires_text.encode(), hashlib.sha256).hexdigest()
    return hmac.compare_digest(signature, expected)


def require_admin(authorization: str | None = Header(default=None)) -> None:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="missing token")
    token = authorization.split(" ", 1)[1].strip()
    if not token_is_valid(token):
        raise HTTPException(status_code=401, detail="invalid token")
