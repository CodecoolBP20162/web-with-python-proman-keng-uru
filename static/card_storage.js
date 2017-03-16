    var new_cards = [];
    var in_progress_cards = [];
    var review_cards = [];
    var done = [];


$( function() {
    $( "#sortable" ).sortable();
    $( "#sortable" ).disableSelection();
  } );
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    console.log(ev.target.id)
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    console.log(ev)
    ev.target.appendChild(document.getElementById(data));
}



$(document).ready(function () {
    var cards = JSON.parse(localStorage.getItem("cards")) || []
    var cardId = 1;
    for (var i in cards) {
        render_new_card(cards[i].title, cards[i].description, cardId);
        ++cardId;
    }

    $("#add-card").click(function () {
        //localStorage.setItem("cards", []);
        var cardName = $("#new-card-title").val();
        var cardDescription = $("#new-card-description").val();

        cards = JSON.parse(localStorage.getItem("cards")) || cards;
        if (cardName  && !cards.includes(cardName)) {
            $("#new-card-title").val('');
            $("#new-card-description").val('');
            var card = {
                id: cardId,
                title: cardName,
                description:cardDescription
                };
            cards.push(card);
            render_new_card(cardName, cardDescription, cardId);
            localStorage.setItem("cards", JSON.stringify(cards));
            ++cardId;
        };
    });
});

var render_new_card = function(cardName, cardDescription, cardId){
     $("#card_objects").append('<div class="card-text" id="card' + cardId + '" draggable="true" ondragstart="drag(event)")><p>' + '<section class="card"> ' + '<header>' + cardName + ' </header>' + '<article class="card_text">' + '<header>' + cardDescription + ' </header>' + '<br><br><button id="edit">Edit card</button> </article>' + ' </section>' + '</p></div>');
};
