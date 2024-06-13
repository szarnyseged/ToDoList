from content import app



if __name__ == "__main__":
    app.run(debug=True)

    # !! when using real db instead of memory (otherwise it will try to make the db multiple times during runtime -> bug):
    #   -> ! set debug to False.
    #   or
    #   -> ! set debug to True, but use_reloader to False
    #app.run(debug=True, use_reloader=False)

"""
to do:

rework -> backend sends the cards data to js array. -> this array fills the DOM.
update, add, delete on this array.
then saving sends this array to backend.

js make timestamp function is not in use ->
handling the timestamp in backend doesnt work well, because the saving happens on all cards "at the same time".

create real db instead of memory ->
(load db option in frontend)

"""
