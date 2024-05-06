"""
manual db, not in use.
-> sql_alchemy
"""

import sqlite3


db_name = "test.db"
connection = sqlite3.connect(__file__ + "/../" + db_name)
cursor = connection.cursor()


