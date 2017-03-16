
$(document).ready(function () {
    var cards = JSON.parse(localStorage.getItem("cards")) || [];
    for (var i in cards) {
        render_new_card(cards[i].title, cards[i].description);

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
                title: cardName,
                description:cardDescription
                }
            cards.push(card);
            render_new_card(cardName, cardDescription);
            console.log(cards);
            localStorage.setItem("cards", JSON.stringify(cards));
            console.log(localStorage.getItem("cards"));
        };
    });
});


var render_new_card = function(cardName, cardDescription){
     $("#card_objects").append('<div class="card-text sortable" draggable="true" ondragstart="drag(event)")><p>' + '<section class="card"> ' + '<header>' + cardName + '</header>' + '<article class="card_text">' + '<header>' + cardDescription + '</header>' + ' </article>' + '</section>' + '</p></div>');
}