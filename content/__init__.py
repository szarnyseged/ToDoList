from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config.from_object("config")
db = SQLAlchemy(app)

#app.secret_key = token_hex(64)

from content import routes
