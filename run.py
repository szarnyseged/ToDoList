from content import app


if __name__ == "__main__":
    app.run(debug=True)

"""
to do:
saving the done state is not handled in the /save_all route. 
nor being sent any info about it trough js json.
/done_button route session is lost before saving button being clicked.

add line button,

add card button to the navbar

"""