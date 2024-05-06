
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

            console.log("card: ", card)

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

document.addEventListener("DCOMContentLoaded", function() {
    // find all "AddLineButtons"
    var AddLineButtons = document.querySelectorAll(".card-link.AddLineButton")

    // attach click event listener
    AddLineButtons.forEach(function(button) {
        button.addEventListener("click", function(event) {
            // prevent default link behavior
            event.preventDefault();

            // Find the parent list-group element
            var ListGroup = this.closest(".list-group");

            // attach new list-group-item
            
        })
    })

})