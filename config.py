from secrets import token_hex


SECRET_KEY = token_hex(64)

db_name = "first.db"
#instance_path = __file__ + "/../" + "./content/" "./db"
SQLALCHEMY_DATABASE_URI = "sqlite:///" + db_name
#SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
