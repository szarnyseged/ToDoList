from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from config import instance_path


app = Flask(__name__, instance_path=instance_path)
app.config.from_object("config")
db = SQLAlchemy(app)


from content import routes
