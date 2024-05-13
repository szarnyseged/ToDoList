
// save button
document.addEventListener("DOMContentLoaded", function() {
    // find save button
    var saveButton = document.getElementById("save_all");
    var route = "/save_all";

    saveButton.addEventListener("click", function(event) {
        event.preventDefault();

        var fullJson = {
            cards: []
        };

        allCard = document.querySelectorAll(".ToDoCard");
        allCard.forEach(function(oneCard) {
            fullJson.cards.push(prepCardData(oneCard))
        });

        // bugcheck
        console.log("full json: ", JSON.stringify(fullJson));
        makePostRequest(route, fullJson);

        function makePostRequest(route, payload) {
            var xhr = new XMLHttpRequest();
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
    });
});


// add card button
document.addEventListener("DOMContentLoaded", function() {
    var addCardButton = document.getElementById("add_card")

    // attach click event listener
    addCardButton.addEventListener("click", function(event) {
        event.preventDefault();
        var ToDoBar = document.querySelector(".ToDoBar").querySelector(".row");


        newCard = createCard();
        addDoneButtonListener(newCard);
        addAddLineButtonListener(newCard);

        function createCard() {
            var newCard = document.createElement("div");
            // the card got no id -> assign later with backend
            newCard.id = "_";
            newCard.classList.add("card", "ToDoCard", "bg-secondary-subtle", "text-light", "m-3");
            //"card ToDoCard bg-secondary-subtle text-light m-3"
            newCard.innerHTML = `
                <div class="card-body">
                    <div class="modal-header">
                        <h5 contenteditable="True" class="card-title text-black">Title</h5>
                        <button type="button" class="btn-close" data-bs-toggle="modal" data-bs-target="#DeleteModal" aria-label="Close"></button>
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


// Done button
document.addEventListener("DOMContentLoaded", function() {
    // Find all "Done" buttons
    var doneButtons = document.querySelectorAll('.card-link.DoneButton');
    // Attach click event listener to each "Done" button
    doneButtons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            // Prevent default link behavior
            event.preventDefault();
            
            // Find the parent card element (closest() -> moving/searching up in DOM)
            var card = this.closest('.card');
            var route = "/done_button";

            if (card.closest(".ToDoBar")) {
                // Move the card to the left vstack (DoneBar class) bar
                // (querySelector() -> moving/searching down in DOM)
                var vStack = document.querySelector('.DoneBar');
                vStack.appendChild(card);

                //button.style.display = 'none';
                // !!! the class is still DoneButton, this functionality still on it, even while its on the left side.
                // change style
                button.textContent = "Not Done";
                card.querySelector(".AddLineButton").style.display = "none";
                card.classList.remove("bg-secondary-subtle");
                card.classList.add("my_success_color");
                card.querySelector(".card-title").contentEditable="false";
                card.querySelector(".card-subtitle").contentEditable="false";
            } else if (card.closest(".DoneBar")) {
                var ToDoBar = document.querySelector(".ToDoBar");
                ToDoBar.querySelector(".row").appendChild(card);

                // change style
                button.textContent = "Done";
                card.querySelector(".AddLineButton").style.display = "inline-block";
                card.classList.add("bg-secondary-subtle");
                card.classList.remove("my_success_color");
                card.querySelector(".card-title").contentEditable="true";
                card.querySelector(".card-subtitle").contentEditable="true";
            };

            // bugcheck
            console.log("done button bugcheck start");
            console.log(card.id);
            console.log(card.querySelector(".card-title").textContent);
            console.log(card.querySelector(".card-subtitle").textContent);
            console.log("done button bugcheck end");
        });
    });
});


// Add line button
document.addEventListener("DOMContentLoaded", function() {
    // find all "AddLineButtons"
    var AddLineButtons = document.querySelectorAll(".card-link.AddLineButton");

    AddLineButtons.forEach(function(button) {
        addAddLineButtonListener(button.closest(".card"))
    });
});


function addDoneButtonListener(card) {
    var doneButton = card.querySelector('.DoneButton');

    doneButton.addEventListener('click', function(event) {
        // Prevent default link behavior
        event.preventDefault();
        
        if (card.closest(".ToDoBar")) {
            // Move the card to the left vstack (DoneBar class) bar
            // (querySelector() -> moving/searching down in DOM)
            var vStack = document.querySelector('.DoneBar');
            vStack.appendChild(card);

            //button.style.display = 'none';
            // !!! the class is still DoneButton, this functionality still on it, even while its on the left side.
            // change style
            doneButton.textContent = "Not Done";
            card.querySelector(".AddLineButton").style.display = "none";
            card.classList.remove("bg-secondary-subtle");
            card.classList.add("my_success_color");
            card.querySelector(".card-title").contentEditable="false";
            card.querySelector(".card-subtitle").contentEditable="false";
        } else if (card.closest(".DoneBar")) {
            var ToDoBar = document.querySelector(".ToDoBar");
            ToDoBar.querySelector(".row").appendChild(card);

            // change style
            doneButton.textContent = "Done";
            card.querySelector(".AddLineButton").style.display = "inline-block";
            card.classList.add("bg-secondary-subtle");
            card.classList.remove("my_success_color");
            card.querySelector(".card-title").contentEditable="true";
            card.querySelector(".card-subtitle").contentEditable="true";
        };

        // bugcheck
        console.log("done button bugcheck start");
        console.log(card.id);
        console.log(card.querySelector(".card-title").textContent);
        console.log(card.querySelector(".card-subtitle").textContent);
        console.log("done button bugcheck end");
    });
    console.log("done button listener added to card id: ", card.id);
};


function addAddLineButtonListener(card) {
    var addLineButton = card.querySelector('.AddLineButton');

    addLineButton.addEventListener("click", function(event) {
        event.preventDefault()
        var contentGroup = card.querySelector(".content_group");
        createListItem();

        
        function createListItem() {
            var newItem = document.createElement("li");
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


function makeTimestamp() {
    now = new Date()

    // Format the date and time into a string similar to Python's datetime.now() format
    var timestamp = now.getFullYear() + "-" +
                (now.getMonth() + 1).toString().padStart(2, '0') + "-" +
                now.getDate().toString().padStart(2, '0') + " " +
                now.getHours().toString().padStart(2, '0') + ":" +
                now.getMinutes().toString().padStart(2, '0') + ":" +
                now.getSeconds().toString().padStart(2, '0');
    console.log(timestamp);
    return timestamp;
};


function sendCardData(card, route) {
    // Make a POST request to the Flask endpoint
    var xhr = new XMLHttpRequest();
    xhr.open("POST", route, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log("Request successful");
                // Handle successful response from the server
            } else {
                console.error("Request failed");
                // Handle error response from the server
            }
        }
    };

    // get the content-editable div contents
    var listItems = card.querySelector(".list-group.content_group").querySelectorAll(".list-group-item");
    //console.log(card.querySelector(".list-group.content_group").querySelectorAll(".list-group-item"));
    var allContent = [];
    listItems.forEach(function(item) {
        var pairs = []
        pairs.push(item.id)
        pairs.push(item.querySelector("input").checked)
        pairs.push(item.querySelector(".contenteditable-div").textContent)
        allContent.push(pairs)
    });

    // build json object
    var payload = {
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
    console.log("sendCardData check json \n", JSON.stringify(payload));

    // Send json
    xhr.send(JSON.stringify(payload));
};


function prepCardData(card) {
    // get the content-editable div contents
    var listItems = card.querySelector(".list-group.content_group").querySelectorAll(".list-group-item");
    //console.log(card.querySelector(".list-group.content_group").querySelectorAll(".list-group-item"));
    var allContent = [];
    listItems.forEach(function(item) {
        var pairs = []
        pairs.push(item.id)
        pairs.push(item.querySelector("input").checked)
        pairs.push(item.querySelector(".contenteditable-div").textContent)
        allContent.push(pairs)
    });

    // build json object
    var payload = {
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
    console.log("prepCardData check json \n", JSON.stringify(payload));
    return payload;
};

function deleteCard() {
    modal = document.getElementById("DeleteModal");
    
};