import json
import os
from pathlib import Path

from app.schemas import NowSnapshot

DATA_DIR = Path(__file__).resolve().parents[1] / "data"


def now_path() -> Path:
    override = os.environ.get("NOW_JSON")
    if override:
        return Path(override)
    return DATA_DIR / "now.json"


def read_now() -> NowSnapshot:
    path = now_path()
    payload = json.loads(path.read_text(encoding="utf-8"))
    return NowSnapshot.model_validate(payload)


def write_now(snapshot: NowSnapshot) -> None:
    path = now_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    text = json.dumps(snapshot.model_dump(), ensure_ascii=False, indent=2) + "\n"
    temporary = path.with_suffix(".json.tmp")
    temporary.write_text(text, encoding="utf-8")
    temporary.replace(path)
