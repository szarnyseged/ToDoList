from content import app, db
from flask import url_for, redirect, render_template, request, flash
from content.models import ToDoCard, ToDoContent
from content.dummy_datas import dummy_cards, dummy_contents
from content import datetime


# create db
with app.app_context():
    db.create_all()
    for card in dummy_cards:
        card_obj = ToDoCard(id=card["id"], title=card["title"], subtitle=card["subtitle"], done=card["done"])
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
    print("\n", "bugcheck: db create ", check_obj.content)



@app.route("/")
@app.route("/index")
@app.route("/home")
def home():
    #cards = db.session.execute(db.select(ToDoCard)).scalars()
    cards = db.session.query(ToDoCard).order_by(ToDoCard.last_modified.asc()).all()
    # !! cards is an inerator object. (db behavior) -> when you try to use it with jinja multiple times (eg: for loop)
    # the iterator will be exhausted. therefore only 1 iteration can be done.
    # -> solution: list is iterable, but will not exhaust (but must be fit into memory).
    cards_list = list(cards)
    return render_template("index.html", ToDoCard=cards_list)


@app.route("/save_all", methods=["POST"])
def save():
    json_data = request.get_json()
    # send to db
    # card_id = json_data["card_id"] -> this can cause error, if the key is none existent
    current_card_obj = db.get_or_404(ToDoCard, json_data.get("card_id"))
    current_card_obj.done = json_data["is_done"]
    current_card_obj.title = json_data["card_content"]["title"]
    current_card_obj.subtitle = json_data["card_content"]["subtitle"]

    card_content = json_data["card_content"]["content"]
    #print("all content: \n", card_content)
    for one_content in card_content:
        current_content_obj = db.get_or_404(ToDoContent, one_content["content_id"])
        current_content_obj.checkbox_on_off = one_content["is_checked"]
        current_content_obj.content_text = one_content["text"]
        current_content_obj.card_id = current_card_obj.id
        db.session.add(current_content_obj)
    current_card_obj.last_modified = datetime.now()
    db.session.add(current_card_obj)
    db.session.commit()
    return redirect(url_for("home"))


@app.route("/add_line")
def add_line():
    new_content = ToDoContent()
    db.session.add(new_content)
    db.session.commit()
    return str(new_content.id)


@app.route("/add_card")
def add_card():
    new_card = ToDoCard()
    db.session.add(new_card)
    db.session.commit()
    return str(new_card.id)
