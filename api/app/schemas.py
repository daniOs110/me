from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator


class Metric(BaseModel):
    id: str
    value: float
    unit: str = ""
    target: float | None = None


class Focus(BaseModel):
    es: str
    en: str


class Pillar(BaseModel):
    id: Literal["mente", "cuerpo", "arte"]
    focus: Focus
    hours: float = Field(default=0, ge=0)
    completed: bool = False
    video: str = ""
    metrics: list[Metric]

    @field_validator("focus")
    @classmethod
    def focus_not_blank(cls, value: Focus) -> Focus:
        if not value.es.strip() or not value.en.strip():
            raise ValueError("empty focus")
        return Focus(es=value.es.strip(), en=value.en.strip())

    @field_validator("video")
    @classmethod
    def clean_video(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            return ""
        if not (cleaned.startswith("https://") or cleaned.startswith("http://")):
            raise ValueError("video")
        return cleaned


class NowSnapshot(BaseModel):
    updated: str
    pillars: list[Pillar]


class ContactIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    message: str = Field(min_length=1, max_length=5000)
    lang: Literal["es", "en"]

    @field_validator("name", "message")
    @classmethod
    def strip_text(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("empty")
        return cleaned


class ContactOut(BaseModel):
    ok: bool = True


class LoginIn(BaseModel):
    password: str = Field(min_length=1, max_length=200)


class TokenOut(BaseModel):
    token: str
