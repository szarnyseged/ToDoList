from content import app, db
from flask import url_for, redirect, render_template, request, flash
from content.models import ToDoCard, ToDoContent
from content.dummy_datas import dummy_cards, dummy_contents


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
    cards = db.session.execute(db.select(ToDoCard)).scalars()
    # !! cards is an inerator object. (db behavior) -> when you try to use it with jinja multiple times (eg: for loop)
    # the iterator will be exhausted. therefore only 1 iteration can be done.
    # -> solution: list is iterable, but will not exhaust (but must be fit into memory).
    cards_list = list(cards)
    return render_template("index.html", ToDoCard=cards_list)


@app.route("/done_button", methods=["POST"])
def done_button():
    json_data = request.get_json()
    card_id = json_data.get("card_id")

    current_card_obj = db.get_or_404(ToDoCard, card_id)
    #print("done button before done: ", current_card_obj.done)
    current_card_obj.done = not current_card_obj.done
    #print("done button after done: ", current_card_obj.done)
    return redirect(url_for("home"))


@app.route("/save_all", methods=["POST"])
def save():
    json_data = request.get_json()
    # card_id = json_data["card_id"] -> this can cause error, if the key is none existent
    card_id = json_data.get("card_id")
    card_title = json_data["card_content"]["title"]
    card_subtitle = json_data["card_content"]["subtitle"]
    card_content = json_data["card_content"]["content"]

    print("all content: \n", card_content)

    # send to db
    current_card_obj = db.get_or_404(ToDoCard, card_id)
    current_card_obj.title = card_title
    current_card_obj.subtitle = card_subtitle
    for one_content in card_content:
        current_content_obj = db.get_or_404(ToDoContent, one_content["content_id"])
        current_content_obj.checkbox_on_off = one_content["is_checked"]
        current_content_obj.content_text = one_content["text"]
        db.session.add(current_content_obj)
    db.session.add(current_card_obj)
    db.session.commit()
    return redirect(url_for("home"))
    pass
