
from typing import List, Any
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
#from starlette.requests import Request
from pydantic import BaseModel
from uuid import uuid4
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class User(BaseModel):
    name:str

db_instance = {}
database:List[Any] = []

with open("src/database/database.json","r") as db:
    db_instance = json.load(db)
    database = db_instance["users"]


def save():
    with open("src/database/database.json","w") as db:
        db_instance["users"] = database
        json.dump(db_instance,db)


@app.get("/users")
def read_user():
    return database

@app.get("/users/{id}")
def read_one_user(id:str):
    for user in database:
        if user["id"] == id:
            return user

@app.post("/users")
async def create_user(user:User):
    
    database.append({
        "id": uuid4().__str__(),
        "name":user.name
    })
    save()
    return database

@app.delete("/users/{id}")
def delete_user(id:str):
    for user in database:
        if user["id"] == id:
            database.remove(user)
    save()
    return database

@app.put("/users/{id}")
async def update_user(id:str,user_req:User):
    
    for user in database:
        if user["id"] == id:
            user["name"] = user_req.name
    save()
    return database
