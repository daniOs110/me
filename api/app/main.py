import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import admin, contact, now

app = FastAPI(title="Daniel")

origins = [
    origin.strip()
    for origin in os.environ.get(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET", "POST", "PUT"],
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(now.router, prefix="/api")
app.include_router(contact.router, prefix="/api")
app.include_router(admin.router, prefix="/api/admin")
