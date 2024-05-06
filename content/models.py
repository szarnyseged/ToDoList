from content import db


"""
maybe better solution would be using JSON instead of db.

"""

class ToDoCard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80))
    subtitle = db.Column(db.String(80))
    # issue? relationship?
    # foreign_key -> flask sql_alchemy names the tables with "_"
    content = db.relationship("ToDoContent", lazy=True, backref="content_obj")


class ToDoContent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    checkbox_on_off = db.Column(db.Boolean, nullable=False)
    content_text = db.Column(db.String)
    # foreign_key -> flask sql_alchemy names the tables with "_"
    card_id = db.Column(db.Integer, db.ForeignKey("to_do_card.id"))
