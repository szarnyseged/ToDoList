"""
manual db, not in use.
-> sql_alchemy
"""

import sqlite3


db_name = "test.db"


def create_connection():
    connection = sqlite3.connect(__file__ + "/../" + db_name)
    cursor = connection.cursor()
    return connection, cursor



