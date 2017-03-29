from peewee import *
from database import DatabaseConnection


class BaseModel(Model):
    class Meta:
        database = DatabaseConnection.db


class Board(BaseModel):
    board_title = CharField()
    board_id = IntegerField(null=True, default=None)


class Status(BaseModel):
    name = CharField()
    status_list = [
        {"name": "not_yet_arranged"},
        {"name": "new"},
        {"name": "in_progress"},
        {"name": "review"},
        {"name": "done"}
    ]

    @staticmethod
    def gen_status():
        for status in Status.status_list:
            Status.create(name=status["name"])


class Cards(BaseModel):
    card_title = CharField()
    card_desc = CharField()
    card_id = IntegerField()
    board = ForeignKeyField(Board, null=True, default=None)
    status = ForeignKeyField(Status, null=True, default=None)
