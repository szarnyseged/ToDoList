
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

            // Move the card to the left vstack (DoneBar class) bar
            // (querySelector() -> moving/searching down in DOM)
            var vStack = document.querySelector('.DoneBar');
            vStack.appendChild(card);

            // Hide the "Done" button after moving the card
            //button.style.display = 'none';
            button.textContent = "Not Done";
            // !!! the class is still DoneButton, this functionality still on it, even while its on the left side.

            // bugcheck
            console.log("done button bugcheck start");
            console.log(card.id);
            console.log(card.querySelector(".card-title").textContent);
            console.log(card.querySelector(".card-subtitle").textContent);
            console.log("done button bugcheck end");
            

            sendCardData(card);
        });
    });
});


// save button
document.addEventListener("DOMContentLoaded", function() {
    // find save button
    var saveButton = document.getElementById("save_all");
    var route = "/save_all";

    saveButton.addEventListener("click", function(event) {
        event.preventDefault();

        // send all card data
        // one-by-one many json sending approach. not ideal
        allCard = document.querySelectorAll(".ToDoCard");
        allCard.forEach(function(item) {
            sendCardData(item, route)
        });
    });
});


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

    // bugcheck
    console.log("sendCardData check json \n", JSON.stringify(payload));

    // Send json
    xhr.send(JSON.stringify(payload)); 
}


// Add line button
document.addEventListener("DOMContentLoaded", function() {
    // find all "AddLineButtons"
    var AddLineButtons = document.querySelectorAll(".card-link.AddLineButton");

    // attach click event listener
    AddLineButtons.forEach(function(button) {
        button.addEventListener("click", function(event) {
            // prevent default link behavior
            // this is used to prevent eg.: <a> navigation to an url, OR submit form button functionality,
            // ensuring that only this custom behavior will be executed 
            event.preventDefault();

            // Find the parent list-group element
            var listGroup = this.closest(".card-body").querySelector(".list-group");
            console.log(listGroup);

            // create new list-group-item
            var newItem = document.createElement("li");
            newItem.classList.add("list-group-item");
            
            
            // !!!!! bug id="one_content.id" missing on new li.
            // -> 
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

            listGroup.appendChild(newItem);
        });
    });
});