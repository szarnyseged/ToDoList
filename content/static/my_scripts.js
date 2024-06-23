
// save button
document.addEventListener("DOMContentLoaded", function() {
    let saveButton = document.getElementById("ConfirmSave");

    saveButton.addEventListener("click", function(event) {
        saveAll(event)
    });
});


// add card button
document.addEventListener("DOMContentLoaded", function() {
    let addCardButton = document.getElementById("add_card")

    addCardButton.addEventListener("click", function(event) {
        event.preventDefault();
        let ToDoBar = document.querySelector(".ToDoBar").querySelector(".row");

        newCard = createCard();
        addDoneButtonListener(newCard);
        addAddLineButtonListener(newCard);
        addDeleteButtonListener(newCard);
        confirmDeleteListener()

        function createCard() {
            let newCard = document.createElement("div");
            // the card got no id -> assign later with backend
            newCard.id = "_";
            newCard.classList.add("card", "ToDoCard", "bg-secondary-subtle", "text-light", "m-3");
            newCard.innerHTML = `
                <div class="card-body">
                    <div class="modal-header">
                        <h5 contenteditable="True" class="card-title text-black">Title</h5>
                        <button type="button" class="btn-close DeleteButton" data-bs-toggle="modal" data-bs-target="#DeleteModal" aria-label="Close"></button>
                    </div>
                    <h6 contenteditable="True" class="card-subtitle mb-2 text-body-secondary">Subtitle</h6>
                    <ul class="list-group content_group">
                    </ul>
                    <div class="d-flex justify-content-evenly">
                        <button class="card-link AddLineButton btn btn-primary btn-sm ps-2 pe-2 ms-1">Add Line</button>
                        <button class="card-link DoneButton btn btn-primary btn-sm ps-2 pe-2 ms-1">Done</button>
                    </div>
                </div>
                `
            ToDoBar.appendChild(newCard);
            return newCard;
        };
    });
});


// load button listeners
document.addEventListener("DOMContentLoaded", function() {
    let addLineButtons = document.querySelectorAll(".card-link.AddLineButton");
    let doneButtons = document.querySelectorAll(".DoneButton");

    doneButtons.forEach(function(button) {
        addDoneButtonListener(button.closest(".card"))
    });

    addLineButtons.forEach(function(button) {
        addAddLineButtonListener(button.closest(".card"))
    });
});


// donebar height listener
document.addEventListener("DOMContentLoaded", function() {
    let toDoBar = document.querySelector(".ToDoBar").querySelector(".row");
    let doneBar = document.querySelector('.DoneBar');
    let resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            let toDoBarHeight = document.querySelector(".ToDoBar").querySelector(".row").clientHeight;
            doneBar.style.maxHeight = `${toDoBarHeight}px`;

            console.log('max-height changed to:', toDoBarHeight);
          }
    });
    resizeObserver.observe(toDoBar);
});


function addDoneButtonListener(card) {
    let doneButton = card.querySelector('.DoneButton');

    doneButton.addEventListener('click', function(event) {
        // Prevent default link behavior
        event.preventDefault();
        
        if (card.closest(".ToDoBar")) {
            // Move the card to the left vstack (DoneBar class) bar
            // (querySelector() -> moving/searching down in DOM)
            // (closest() -> moving/searching up in DOM)
            let vStack = document.querySelector('.DoneBar');
            vStack.appendChild(card);

            // !!! the class is still DoneButton, this functionality still on it, even while its on the left side.
            // change style
            doneButton.textContent = "Not Done";
            card.querySelector(".AddLineButton").style.display = "none";
            card.classList.remove("bg-secondary-subtle");
            card.classList.add("my_success_color");
            card.querySelector(".card-title").contentEditable="false";
            card.querySelector(".card-subtitle").contentEditable="false";
        } else if (card.closest(".DoneBar")) {
            // Move the card to the right (ToDoBar class) bar
            let ToDoBar = document.querySelector(".ToDoBar");
            ToDoBar.querySelector(".row").appendChild(card);

            // change style
            doneButton.textContent = "Done";
            card.querySelector(".AddLineButton").style.display = "inline-block";
            card.classList.add("bg-secondary-subtle");
            card.classList.remove("my_success_color");
            card.querySelector(".card-title").contentEditable="true";
            card.querySelector(".card-subtitle").contentEditable="true";
        };
    });
    console.log("done button listener added to card id: ", card.id);
};


function addAddLineButtonListener(card) {
    let addLineButton = card.querySelector('.AddLineButton');

    addLineButton.addEventListener("click", function(event) {
        event.preventDefault()
        let contentGroup = card.querySelector(".content_group");
        createListItem();

        
        function createListItem() {
            let newItem = document.createElement("li");
            // the content got no id -> assign later with backend
            newItem.id = "_";
            newItem.classList.add("list-group-item");

            // create inner html
            newItem.innerHTML = `
                <div class="row">
                    <div class="col-2 align-self-center">
                        <input class="form-check-input me-1 fs-5" type="checkbox" value="">
                    </div>
                    <div class="col-10">
                        <div class="contenteditable-div" contenteditable="true" aria-multiline="true" role="textbox" aria-placeholder="Enter text here">
                        </div>
                    </div>
                </div>`;
            contentGroup.appendChild(newItem);
        };
    });
    console.log("add line button listener added to card id: ", card.id);
};


let cardToDelete = null;
function addDeleteButtonListener(card) {
    let deleteButton = card.querySelector(".DeleteButton");

    deleteButton.addEventListener("click", function(event) {
        cardToDelete = card;
        //console.log(cardToDelete)
    });
};


function confirmDeleteListener() {
    let confirm = document.getElementById("confirm-delete")
    confirm.addEventListener("click", function(event){
        if (cardToDelete) {
            cardToDelete.parentNode.removeChild(cardToDelete);
            cardToDelete = null;
        };
    });
};


function makeTimestamp() {
    now = new Date()

    // Format the date and time into a string similar to Python's datetime.now() format
    let timestamp = now.getFullYear() + "-" +
                (now.getMonth() + 1).toString().padStart(2, '0') + "-" +
                now.getDate().toString().padStart(2, '0') + " " +
                now.getHours().toString().padStart(2, '0') + ":" +
                now.getMinutes().toString().padStart(2, '0') + ":" +
                now.getSeconds().toString().padStart(2, '0');
    console.log(timestamp);
    return timestamp;
};


function prepCardData(card) {
    // get the content-editable div contents
    let listItems = card.querySelector(".list-group.content_group").querySelectorAll(".list-group-item");
    //console.log(card.querySelector(".list-group.content_group").querySelectorAll(".list-group-item"));
    let allContent = [];
    listItems.forEach(function(item) {
        var pairs = []
        pairs.push(item.id)
        pairs.push(item.querySelector("input").checked)
        pairs.push(item.querySelector(".contenteditable-div").textContent)
        allContent.push(pairs)
    });

    // build json object
    let payload = {
        card_id: card.id,
        is_done: "_",
        card_content:
        {
            title: card.querySelector(".card-title").textContent,
            subtitle: card.querySelector(".card-subtitle").textContent,
            content: []
        }
    };

    allContent.forEach(function(item) {
        payload.card_content.content.push({
            content_id: item[0],
            is_checked: item[1],
            text: item[2]
            }
        )
    });

    if (card.closest(".DoneBar")) {
        payload.is_done = true
    } else {
        payload.is_done = false
    };

    // bugcheck
    //console.log("prepCardData check json \n", JSON.stringify(payload));
    return payload;
};


function saveAll(event=null) {
    if (event != null) {
        event.preventDefault();
    }

    let route = "/tasks";
    let fullJson = {
        cards: []
    };

    let allCard = document.querySelectorAll(".ToDoCard");
    allCard.forEach(function(oneCard) {
        fullJson.cards.push(prepCardData(oneCard))
    });

    // bugcheck
    console.log("full json: ", JSON.stringify(fullJson));
    makePostRequest(route, fullJson);

    function makePostRequest(route, payload) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", route, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    console.log("Request successful");
                } else {
                    console.error("Request failed");
                }
            };
        };
        xhr.send(JSON.stringify(payload));
    };
};

/*
//
function enableAutosave(delay = 10000) {
    setInterval(saveAll, delay)
};
*/
