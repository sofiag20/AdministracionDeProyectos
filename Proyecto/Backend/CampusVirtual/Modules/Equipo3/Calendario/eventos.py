from fastapi import APIRouter
from .models import Evento
import json
import os

router = APIRouter(tags=["Equipo 3 - Calendario"])


BASE_DIR = os.path.dirname(__file__)
DB_PATH = os.path.join(BASE_DIR, "calendar_db.json")


@router.get("/eventos")
def obtener_eventos():
    with open(DB_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


@router.post("/eventos")
def agregar_evento(evento: Evento):
    with open(DB_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    data.append(evento.dict())

    with open(DB_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    return {"mensaje": "Evento agregado"}
