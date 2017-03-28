from peewee import *


class DatabaseConnection:

    def get_connect_string():
        try:
            with open('connection_str.txt', 'r') as db_name:
                return db_name.readline().strip()
        except:
            print("You need to create a database and store its name in a file named 'connect_str.txt'.")

    db = PostgresqlDatabase(get_connect_string())
