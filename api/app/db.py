import os
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parents[1] / "data"


def db_path() -> Path:
    override = os.environ.get("CONTACT_DB")
    if override:
        return Path(override)
    return DATA_DIR / "contact.sqlite3"


def connect() -> sqlite3.Connection:
    path = db_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(path)
    connection.row_factory = sqlite3.Row
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            lang TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        """
    )
    return connection


def save_message(name: str, email: str, message: str, lang: str) -> None:
    created_at = datetime.now(timezone.utc).isoformat()
    with connect() as connection:
        connection.execute(
            """
            INSERT INTO messages (name, email, message, lang, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (name, email, message, lang, created_at),
        )
