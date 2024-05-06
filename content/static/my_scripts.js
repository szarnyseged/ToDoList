
// Done button
document.addEventListener("DOMContentLoaded", function() {
    // Find all "Done" buttons
    var doneButtons = document.querySelectorAll('.card-link.DoneButton');

    // Attach click event listener to each "Done" button
    doneButtons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            // Prevent default link behavior
            event.preventDefault();
            
            // Find the parent card element
            var card = this.closest('.card');

            // Move the card to the left vstack (DoneBar class) bar
            var vStack = document.querySelector('.DoneBar');
            vStack.appendChild(card);

            // Hide the "Done" button after moving the card
            //button.style.display = 'none';
            button.textContent = "Not Done"

            // Make a POST request to the Flask endpoint
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/done", true);
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
            xhr.send(JSON.stringify({card_id: card})); // Send card id or any other relevant data
        });
    });
});

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

            // append
            listGroup.appendChild(newItem);
        });
    });
});