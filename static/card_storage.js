
$(document).ready(function () {
    var cards = JSON.parse(localStorage.getItem("cards")) || [];
    for (var i in cards) {
        render_new_card(cards[i].title, cards[i].description);

    }
    $("#add-card").click(function () {
        //localStorage.setItem("cards", []);
        var cardName = $("#new-card-title").val();
        var cardDescription = $("#new-card-description").val();
        var cardId = 1;
        cards = JSON.parse(localStorage.getItem("cards")) || cards;
        if (cardName  && !cards.includes(cardName)) {
            $("#new-card-title").val('');
            $("#new-card-description").val('');
            var card = {
                id: cardId,
                title: cardName,
                description:cardDescription
                }
            cards.push(card);
            render_new_card(cardName, cardDescription, cardId);
            console.log(cards);
            localStorage.setItem("cards", JSON.stringify(cards));
            console.log(localStorage.getItem("cards"));
            id += 1;
        };
    });
});

var render_new_card = function(cardName, cardDescription, cardId){
     $("#card_objects").append('<div class="card-text" id="' + cardId + '" draggable="true" ondragstart="drag(event)")><p>' + '<section class="card"> ' + '<header>' + cardName + '</header>' + '<article class="card_text">' + '<header>' + cardDescription + '</header>' + ' </article>' + '</section>' + '</p></div>');
}