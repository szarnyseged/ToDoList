"""
manual db, not in use.
-> sql_alchemy
"""

import sys
import os

# importing from inside this subfolder something which is in the upper directory would lead to error.
# (when running this file directly, python set this to root directory when searching for modules)
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))


"""
# gpt switch db in runtime. not tested yet.

@app.route('/change_db/<string:db_name>')
def change_db(db_name):
    switch_db(db_name)
    return f"Switched to database: {db_name}"

def switch_db(db_name):
    # Tear down the current SQLAlchemy session
    db.session.remove()
    
    # Change the database URI
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_name}"
    
    # Reinitialize the SQLAlchemy object with the new configuration
    db.init_app(app)
    
    # Create tables in the new database if necessary
    with app.app_context():
        db.create_all()

"""


