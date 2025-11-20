from fastapi import FastAPI
from Modules.Equipo1.Routes.equipo1_router import router as equipo1_router
from Modules.Equipo4.models.database import create_db_and_tables_equipo4
from Modules.Equipo3.Calendario.eventos import router as calendario_router

app = FastAPI()


@app.on_event("startup")
def on_startup() -> None:
    create_db_and_tables_equipo4()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    equipo1_router,
    prefix="/api/equipo1",
    tags=["Equipo 1 - Items"],
)

app.include_router(
    calendario_router,
    prefix="/api/calendario",   
    tags=["Equipo 3 - Calendario"],
)
