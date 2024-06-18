# this file should be run directly. not connected to the original flask app by any means.
# i cant import from the content, because the init file would run automatically.
# -> messes up things with 2 flask object.


from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


instance_path = __file__ + "/../" + "./content/" "./db"
db_name = "second.db"
app = Flask(__name__, instance_path=instance_path)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + db_name
db = SQLAlchemy(app)


dummy_cards = [
    {
        "id" : 1,
        "title" : "dummy title1",
        "subtitle" : "dummy_subtitle",
        "done" : True
    },
    {
        "id" : 2,
        "title" : "dummy title2",
        "subtitle" : "dummy_subtitle",
        "done": False
    },
    {
        "id" : 3,
        "title" : "dummy title3",
        "subtitle" : "dummy_subtitle",
        "done": False
    },
    {
        "id" : 4,
        "title" : "dummy title4",
        "subtitle" : "dummy_subtitle",
        "done": False
    }
]

dummy_contents = [
    {
        "id" : 1,
        "checkbox_on_off" : False,
        "content_text" : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat in ipsum hic officiis, a adipisci molestiae nostrum accusantium inventore ut.", 
        "card_id" : 1
    },
    {
        "id" : 2,
        "checkbox_on_off" : False,
        "content_text" : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat in ipsum hic officiis, a adipisci molestiae nostrum accusantium inventore ut.", 
        "card_id" : 2
    },
    {
        "id" : 3,
        "checkbox_on_off" : True,
        "content_text" : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat in ipsum hic officiis, a adipisci molestiae nostrum accusantium inventore ut sasljgfhfauhasdéfjaewi.", 
        "card_id" : 2
    },
    {
        "id" : 4,
        "checkbox_on_off" : False,
        "content_text" : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat in ipsum hic officiis, a adipisci molestiae nostrum accusantium inventore ut.", 
        "card_id" : 3
    },
    {
        "id" : 5,
        "checkbox_on_off" : False,
        "content_text" : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat in ipsum hic officiis, a adipisci molestiae nostrum accusantium inventore ut.", 
        "card_id" : 4
    },
]


class ToDoCard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80))
    subtitle = db.Column(db.String(80))
    done = db.Column(db.Boolean, default=False)
    # used to preserve the order both on the DoneBar(left) and ToDoBar(right)
    last_modified = db.Column(db.DateTime, default=datetime.now())
    # issue? relationship?
    content = db.relationship("ToDoContent", lazy=True, backref="content_obj")


class ToDoContent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    checkbox_on_off = db.Column(db.Boolean, nullable=False, default=False)
    content_text = db.Column(db.String)
    # foreign_key -> flask sql_alchemy names the tables with "_"
    card_id = db.Column(db.Integer, db.ForeignKey("to_do_card.id"))


with app.app_context():
    db.create_all()
    for card in dummy_cards:
        card_obj = ToDoCard(id=card["id"], title=card["title"], subtitle=card["subtitle"], done=card["done"])
        db.session.add(card_obj)
    for content in dummy_contents:
        content_obj = ToDoContent(id=content["id"], checkbox_on_off=content["checkbox_on_off"], content_text=content["content_text"], card_id=content["card_id"])
        db.session.add(content_obj)
    db.session.commit()

