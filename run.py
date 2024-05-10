from content import app


if __name__ == "__main__":
    app.run(debug=True)

"""
to do:
rework -> backend sends the cards data to js array. -> this array fills the DOM.
update, add, delete on this array.
then saving sends this array to backend.

js -> done button, add line button could be removed. using only the add functions
to create them (iterate), when the DOM loads.

js make timestamp function is not in use ->
handling the timestamp in backend doesnt work well, because the saving happens on all cards "at once".

create real db instead of memory ->
(load db option in frontend)

"""
