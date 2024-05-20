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
    cards = db.session.query(ToDoCard).order_by(ToDoCard.last_modified.desc()).all()
    # !! cards is an inerator object. (db behavior) -> when you try to use it with jinja multiple times (eg: for loop)
    # the iterator will be exhausted. therefore only 1 iteration can be done.
    # -> solution: list is iterable, but will not exhaust (but must be fit into memory).
    cards_list = list(cards)
    return render_template("index.html", ToDoCard=cards_list)


@app.route("/save_all", methods=["POST"])
def save():
    json_data = request.get_json()
    json_data = json_data["cards"]
    for card in json_data:
        # card_id = json_data["card_id"] -> this can cause error, if the key is none existent
        # new cards created with js got no id, create new card and assign one now.
        if card["card_id"] == "_":
            current_card_obj = ToDoCard()
        else:
            current_card_obj = db.get_or_404(ToDoCard, card["card_id"])

        current_card_obj.done = card["is_done"]
        current_card_obj.title = card["card_content"]["title"]
        current_card_obj.subtitle = card["card_content"]["subtitle"]
        # use js for date later
        current_card_obj.last_modified = datetime.now()
        db.session.add(current_card_obj)
        db.session.commit()

        # must commit here, because cannot add card content to the card which is not exists before.


        card_content = card["card_content"]["content"]
        #print("all content: \n", card_content)
        # same as new cards, no id. assign one now.
        for one_content in card_content:
            if one_content["content_id"] == "_":
                current_content_obj = ToDoContent()
            else:
                current_content_obj = db.get_or_404(ToDoContent, one_content["content_id"])
            current_content_obj.checkbox_on_off = one_content["is_checked"]
            current_content_obj.content_text = one_content["text"]
            current_content_obj.card_id = current_card_obj.id
            db.session.add(current_content_obj)
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
