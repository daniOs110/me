import sqlite3

import pytest
from fastapi.testclient import TestClient

from app.main import app


def _snapshot(hours: float, completed: bool = False, video: str = "") -> dict:
    return {
        "updated": "2026-11-14",
        "pillars": [
            {
                "id": "mente",
                "focus": {"es": "SQL: índices", "en": "SQL: indexes"},
                "hours": hours,
                "completed": completed,
                "video": video,
                "metrics": [],
            },
            {
                "id": "cuerpo",
                "focus": {"es": "Banca", "en": "Bench"},
                "hours": 0,
                "completed": False,
                "video": "",
                "metrics": [{"id": "bench_press", "value": 70, "unit": "kg", "target": 100}],
            },
            {
                "id": "arte",
                "focus": {"es": "Guitarra", "en": "Guitar"},
                "hours": 0,
                "completed": False,
                "video": "",
                "metrics": [],
            },
        ],
    }


@pytest.fixture()
def client(tmp_path, monkeypatch):
    monkeypatch.setenv("CONTACT_DB", str(tmp_path / "messages.sqlite3"))
    monkeypatch.delenv("ADMIN_PASSWORD", raising=False)
    return TestClient(app)


def test_now_returns_three_pillars(client: TestClient):
    response = client.get("/api/now")
    assert response.status_code == 200
    body = response.json()
    assert [pillar["id"] for pillar in body["pillars"]] == ["mente", "cuerpo", "arte"]
    bench = body["pillars"][1]["metrics"][0]
    assert bench["id"] == "bench_press"
    assert bench["target"] == 100
    assert body["pillars"][0]["hours"] == 0
    assert body["pillars"][0]["completed"] is False


def test_contact_stores_a_message(client: TestClient, tmp_path):
    response = client.post(
        "/api/contact",
        json={
            "name": "  Ada  ",
            "email": "ada@example.com",
            "message": "  Hola  ",
            "lang": "es",
        },
    )
    assert response.status_code == 200
    assert response.json() == {"ok": True}

    connection = sqlite3.connect(tmp_path / "messages.sqlite3")
    row = connection.execute("SELECT name, email, message, lang FROM messages").fetchone()
    assert row == ("Ada", "ada@example.com", "Hola", "es")


def test_admin_requires_a_configured_password(client: TestClient):
    response = client.post("/api/admin/login", json={"password": "cualquiera"})
    assert response.status_code == 503


def test_admin_rejects_a_wrong_password(client: TestClient, monkeypatch):
    monkeypatch.setenv("ADMIN_PASSWORD", "secreto-largo")
    response = client.post("/api/admin/login", json={"password": "no-es"})
    assert response.status_code == 401


def test_admin_updates_hours_title_and_video(client: TestClient, tmp_path, monkeypatch):
    monkeypatch.setenv("ADMIN_PASSWORD", "secreto-largo")
    monkeypatch.setenv("NOW_JSON", str(tmp_path / "now.json"))
    login = client.post("/api/admin/login", json={"password": "secreto-largo"})
    assert login.status_code == 200
    token = login.json()["token"]

    denied = client.put(
        "/api/admin/now",
        json=_snapshot(hours=1),
    )
    assert denied.status_code == 401

    response = client.put(
        "/api/admin/now",
        headers={"Authorization": f"Bearer {token}"},
        json=_snapshot(hours=12.5, completed=True, video="https://example.com/reel"),
    )
    assert response.status_code == 200
    saved = response.json()["pillars"][0]
    assert saved["hours"] == 12.5
    assert saved["completed"] is True
    assert saved["video"] == "https://example.com/reel"
    assert saved["focus"]["es"] == "SQL: índices"


def test_contact_rejects_bad_input(client: TestClient):
    response = client.post(
        "/api/contact",
        json={"name": " ", "email": "no-es-correo", "message": "", "lang": "en"},
    )
    assert response.status_code == 422
