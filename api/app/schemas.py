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
    metrics: list[Metric]


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
