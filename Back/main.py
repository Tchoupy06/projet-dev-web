from typing import Annotated

from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select


class Score(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    score: int
    player_name: str

class ScoreCreate(SQLModel):
    score: int
    player_name: str

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
app = FastAPI()

origins = [  
    "http://localhost:8000",  
    "http://localhost:5173",  
    "http://localhost:5174",  
]  
  
  
app.add_middleware(  
    CORSMiddleware,  
    allow_origins=origins,  
    allow_credentials=True,  
    allow_methods=["*"],  
    allow_headers=["*"],  
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.post("/Scores/", response_model=Score)
def create_score(score: ScoreCreate, session: SessionDep):
    db_score = Score.model_validate(score)
    session.add(db_score)
    session.commit()
    session.refresh(db_score)
    return db_score


@app.get("/Scores/", response_model=list[Score])
def read_scores(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
):
    scores = session.exec(select(Score).offset(offset).limit(limit)).all()
    return scores


@app.get("/Scores/{score_id}", response_model=Score)
def read_score(score_id: int, session: SessionDep):
    score = session.get(Score, score_id)
    if not score:
        raise HTTPException(status_code=404, detail="Score not found")
    return score

@app.delete("/Scores/{score_id}")
def delete_score(score_id: int, session: SessionDep):
    score = session.get(Score, score_id)
    if not score:
        raise HTTPException(status_code=404, detail="Score not found")
    session.delete(score)
    session.commit()
    return {"ok": True}
