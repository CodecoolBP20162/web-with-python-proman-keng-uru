$(function () {
    $("#sortable").sortable();
    $("#sortable").disableSelection();
});
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
    var card_id = parseInt(data.substring(4));
    if (ev.target.id === "delete_card") {
        remove_card_from_db(card_id);
        $('#' + data).remove();
    } else if (isValidStatus(ev.target.id)) {
        change_card_status(card_id, ev.target.id)
        ev.target.appendChild(document.getElementById(data));
    }
}

function isValidStatus(statusId) {
    var isFound = false;
    $.each(Status, function(key, value){
        if (value === statusId){
            isFound = true;
        }
    });
    return isFound;
}

var Status = {
    NOT_YET_ARRANGED: "not_yet_arranged",
    NEW: "new",
    IN_PROGRESS: "in_progress",
    REVIEW: "review",
    DONE: "done"
};


function obtainBoardnameFromHref() {
    var board_split = window.location.href.split('/');
    var board_name = board_split[board_split.length - 1];
    return board_name;
}

function nameOfListForCardsInBoard() {
    return "cards_of_" + obtainBoardnameFromHref();
}

function renderSavedCards() {
    var cards = JSON.parse(localStorage.getItem(nameOfListForCardsInBoard())) || [];
    for (var i in cards) {
        render_new_card(cards[i].title, cards[i].description, cards[i].id, cards[i].status);
    }
}

function getNextCardId() {
    var cards = JSON.parse(localStorage.getItem(nameOfListForCardsInBoard())) || [];
    var cardId = 1;
    for (var i in cards) {
        cardId = Math.max(cardId, cards[i].id);
    }
    return cardId++;
    }

function addNewcard() {
    var highestCardId = getNextCardId()+1;
    var cardName = $("#new-card-title").val();
    var cardDescription = $("#new-card-description").val();
    cards = JSON.parse(localStorage.getItem("cards")) || cards;
    if (cardName && !cards.includes(cardName)) {
        $("#new-card-title").val('');
        $("#new-card-description").val('');
        addCardToDb(highestCardId, cardName, cardDescription, Status.NOT_YET_ARRANGED)
        render_new_card(cardName, cardDescription, highestCardId, Status.NOT_YET_ARRANGED);
    }
}

$(document).ready(function () {
    renderSavedCards();
    $(".nav").append("<li><a>" + decodeURI(obtainBoardnameFromHref()) + "</a></li>>");
    $("#add-card").click(addNewcard);
    $(".edit").click(editCard);

});


function save_new_card_handler() {
    var cardName = $("#new-card-title").val();
    var cardDescription = $("#new-card-description").val();

    cards = JSON.parse(localStorage.getItem(nameOfListForCardsInBoard())) || cards;
    if (cardName && !cards.includes(cardName)) {
        $("#new-card-title").val('');
        $("#new-card-description").val('');
        addNewcard(cardId, cardName, cardDescription, Status.NOT_YET_ARRANGED)
        render_new_card(cardName, cardDescription, cardId, Status.NOT_YET_ARRANGED);
        ++cardId;
    };
}

var render_new_card = function (cardName, cardDescription, cardId, cardStatus) {
    $("#" + cardStatus).append('<div class="card-text" id="card' + cardId + '" draggable="true" ondragstart="drag(event)")><p>' + '<section class="card"> ' + '<header class="cardname">' + cardName + ' </header>' + '<article class="card_text description">' + '<header>' + cardDescription + ' </header>' + '<br><br><button class="edit">Edit card</button> </article>' + ' </section>' + '</p></div>');
};

function remove_card_from_db(card_id) {
    cards = JSON.parse(localStorage.getItem(nameOfListForCardsInBoard())) || [];
    for (i = 0; i < cards.length; i++) {
        if (cards[i].id === card_id) {
            cards.splice(i, 1);
            break;
        }
    }
    localStorage.setItem(nameOfListForCardsInBoard(), JSON.stringify(cards));
}


function change_card_status(cardId, cardStatus) {
    cards = JSON.parse(localStorage.getItem(nameOfListForCardsInBoard())) || [];
    for (i = 0; i < cards.length; i++) {
        if (cards[i].id === cardId) {
            cards[i].status = cardStatus;
            break;
        }
    }
    localStorage.setItem(nameOfListForCardsInBoard(), JSON.stringify(cards));

}

function change_card(cardId, cardTitle, cardDescription) {
    cards = JSON.parse(localStorage.getItem(nameOfListForCardsInBoard())) || [];
    for (i = 0; i < cards.length; i++) {
        if (cards[i].id === cardId) {
            cards[i].title = cardTitle;
            cards[i].description = cardDescription;
            break;
        }
    }
    localStorage.setItem(nameOfListForCardsInBoard(), JSON.stringify(cards));
}


function addCardToDb(cardId, cardName, cardDescription, cardStatus) {
    cards = JSON.parse(localStorage.getItem(nameOfListForCardsInBoard())) || [];
    var card = {
        id: cardId,
        title: cardName,
        description: cardDescription,
        status: cardStatus
    };
    cards.push(card);
    localStorage.setItem(nameOfListForCardsInBoard(), JSON.stringify(cards));
}