from pydantic import BaseModel

class Evento(BaseModel):
    titulo: str
    fecha: str      # formato YYYY-MM-DD
    descripcion: str | None = None
