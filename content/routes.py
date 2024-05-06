from content import app, db
from flask import url_for, render_template
from content.models import ToDoCard, ToDoContent
from content.dummy_datas import dummy_cards, dummy_contents


with app.app_context():
    db.create_all()
    for card in dummy_cards:
        card_obj = ToDoCard(id=card["id"], title=card["title"], subtitle=card["subtitle"])
        db.session.add(card_obj)
    for content in dummy_contents:
        content_obj = ToDoContent(id=content["id"], checkbox_on_off=content["checkbox_on_off"], content_text=content["content_text"], card_id=content["card_id"])
        db.session.add(content_obj)
    db.session.commit()

    # bugcheck
    print(ToDoCard.query.all())
    print("")
    print(ToDoContent.query.all())
    check_obj = ToDoCard.query.filter_by(id=2).first()
    print("\n", check_obj.content)



@app.route("/")
@app.route("/index")
@app.route("/home")
def home():
    cards = db.session.execute(db.select(ToDoCard)).scalars()
    return render_template("index.html", ToDoCard=cards)

