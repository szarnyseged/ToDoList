from content import app



if __name__ == "__main__":
    app.run(debug=True)

    # !! when using real db instead of memory (otherwise it will try to make the db multiple times during runtime -> bug):
    #   -> ! set debug to False.
    #   or
    #   -> ! set debug to True, but use_reloader to False
    #app.run(debug=True, use_reloader=False)

"""
usage notes:

create real db instead of memory ->
(load db option in frontend)
use the create_db.py to create dummy db manually.
"""

"""
to do:

1. saving not works fine on backend. deleted cards are not handled, only the added ones.
-> ? check which is in the json, compare with the db, delete all which are not in the json.
DONE

7. frontend: h5 title is a flex item -> overflow problem 
!modal-header div class causes this -> the deleting js func works fine without this class.
why do i use it? (check on net what does it do)


8. add a delete line button OR automatically delete empty lines.
routes/save . -> for some reason there are a lot of "\n" -s in the json.
js code looks fine. issue maybe the contenteditable div? 


2. ! rework the db commits on save. -> the current solution commit once after each card creation
 and once after all card content have been added to session. this results too many and unccessary
 change on the db.

 new solution:
 -> 1. add each card to the session first. then commit (because the card contents cannot be added
 before the cards themselves exists in db)
 2. then add each content to the correct cards in the session. commit.
 -> this results 2 commits overall.


3. make enable autosave button on frontend + js.

4. rework -> backend sends the cards data to js array. -> this array fills the DOM.
update, add, delete on this array.
then saving sends this array to backend.


5. js make timestamp function is not in use ->
handling the timestamp in backend doesnt work well, because the saving happens on all cards "at the same time".

6. dynamic db change: (one solution to "overwrite" when saving)
flask-sqlalchemy doesnt support that.
https://stackoverflow.com/questions/63827071/flask-sqlalchemy-dynamic-connection-to-different-databases

    #gpt -> db.engine error -> there is no setter for engine
    from flask import Flask
    from flask_sqlalchemy import SQLAlchemy
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker


    @app.route('/reconfigure_db/<string:new_database_uri>')
    def reconfigure_db(new_database_uri):
        Session = reconfigure_database(app, new_database_uri)
        return "Database reconfigured successfully!"


    def reconfigure_database(app, new_database_uri):
        # Create a new engine
        new_engine = create_engine(f"sqlite:///{new_database_uri}")
        
        # Create a new session factory
        Session = sessionmaker(bind=new_engine)
        
        # Reconfigure the SQLAlchemy object to use the new engine
        db.engine.dispose()  # Dispose the previous engine
        db.engine = new_engine
        db.session.remove()  # Remove the existing session
        db.session.configure(bind=new_engine)  # Rebind session to the new engine
        
        # Update the app config
        app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{new_database_uri}"
        
        # If you use scoped_session, reconfigure it as well
        if hasattr(db, 'scoped_session'):
            db.scoped_session.remove()
            db.scoped_session.configure(bind=new_engine)
        
        return Session


"""
