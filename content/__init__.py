from flask import Flask
from secrets import token_hex
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config["SECRET_KEY"] = token_hex(64)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
db = SQLAlchemy(app)

#app.secret_key = token_hex(64)

from content import routes
