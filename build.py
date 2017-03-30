from models import *
from database import DatabaseConnection


# DatabaseConnection.db.drop_tables([Board, Status, Cards], safe=True)
DatabaseConnection.db.create_tables([Board, Status, Cards], safe=True)

Status.gen_status()
