import sqlite3

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture()
def client(tmp_path, monkeypatch):
    monkeypatch.setenv("CONTACT_DB", str(tmp_path / "messages.sqlite3"))
    return TestClient(app)


def test_now_returns_three_pillars(client: TestClient):
    response = client.get("/api/now")
    assert response.status_code == 200
    body = response.json()
    assert [pillar["id"] for pillar in body["pillars"]] == ["mente", "cuerpo", "arte"]
    bench = body["pillars"][1]["metrics"][0]
    assert bench["id"] == "bench_press"
    assert bench["target"] == 100


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


def test_contact_rejects_bad_input(client: TestClient):
    response = client.post(
        "/api/contact",
        json={"name": " ", "email": "no-es-correo", "message": "", "lang": "en"},
    )
    assert response.status_code == 422
