from secrets import token_hex


SECRET_KEY = token_hex(64)
SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
