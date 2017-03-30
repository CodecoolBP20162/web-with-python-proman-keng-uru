$(function () {
    $("#sortable").sortable();
    $("#sortable").disableSelection();
});
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var card_id = parseInt(data.substring(4));
    if (ev.target.id === "delete_card") {
        removeCardFromLocalDb(card_id);
        removeCardFromRemoteDb(card_id);
        $('#' + data).remove();

    } else if (isValidStatus(ev.target.id)) {
        changeCardStatusInLocalDb(card_id, ev.target.id);
        changeCardStatusInRemoteDb(card_id, ev.target.id);
        ev.target.appendChild(document.getElementById(data));
    }
}

function isValidStatus(statusId) {
    var isFound = false;
    $.each(Status, function (key, value) {
        if (value === statusId) {
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
    var highestCardId = getNextCardId() + 1;
    var cardName = $("#new-card-title").val();
    var cardDescription = $("#new-card-description").val();
    var boardName = decodeURI(obtainBoardnameFromHref());
    console.log(boardName);

    cards = JSON.parse(localStorage.getItem("cards")) || [];
    console.log(cards)
    if (cardName && !cards.includes(cardName)) {
        $("#new-card-title").val('');
        $("#new-card-description").val('');
        addCardToLocalDb(highestCardId, cardName, cardDescription, Status.NOT_YET_ARRANGED);
        addCardToRemoteDb(highestCardId, cardName, cardDescription, Status.NOT_YET_ARRANGED, boardName);
        render_new_card(cardName, cardDescription, highestCardId, Status.NOT_YET_ARRANGED);
    }
}

function editCard() {
    var card_name = $(this).closest(".card-text").find("header.cardname").html();
    var description = $(this).closest(".card-text").find("article").find("header").html();
    $('#new-card-title').val(card_name);
    $('#new-card-description').val(description);
    $(this).closest(".card-text").remove();
    edited_card_id = $(this).closest(".card-text").attr('id').substring(4);

    $("#add-card").click(save_card_handler);
};

$(document).ready(function () {
    renderSavedCards();
    $("#navbar").append("<p class='inline'>" + decodeURI(obtainBoardnameFromHref()) + "</p>");
    $(".edit").click(editCard);
    $("#add-card").click(addNewcard);
});

function removeCardFromLocalDb(card_id) {
    cards = JSON.parse(localStorage.getItem(nameOfListForCardsInBoard())) || [];
    for (i = 0; i < cards.length; i++) {
        if (cards[i].id === card_id) {
            cards.splice(i, 1);
            break;
        }
    }
    localStorage.setItem(nameOfListForCardsInBoard(), JSON.stringify(cards));
}

function removeCardFromRemoteDb(card_id) {
    cardToDelete = { card_id: card_id };
    var url = "http://127.0.0.1:5000/boards/delete_cards";
    $.post(url, JSON.stringify(cardToDelete), function (data) {
        console.log(data);
    });
}

function changeCardStatusInLocalDb(cardId, cardStatus) {
    cards = JSON.parse(localStorage.getItem(nameOfListForCardsInBoard())) || [];
    for (i = 0; i < cards.length; i++) {
        if (cards[i].id === cardId) {
            cards[i].status = cardStatus;
            break;
        }
    }
    localStorage.setItem(nameOfListForCardsInBoard(), JSON.stringify(cards));

}

function changeCardStatusInRemoteDb(cardId, cardStatus) {
    newCardStatus = { card_id: cardId, card_status: cardStatus };
    var url = "http://127.0.0.1:5000/boards/update_status";
    $.post(url, JSON.stringify(newCardStatus), function (data) {
        console.log(data);
    });

}


function render_new_card(cardName, cardDescription, cardId, cardStatus) {
    $("#" + cardStatus).append('<div class="card-text" id="card' + cardId +
        '" draggable="true" ondragstart="drag(event)")><p>' + '<section class="card"> ' +
        '<header class="cardname">' + cardName + ' </header>' + '<article class="card_text description">' +
        '<header>' + cardDescription + ' </header>' + '<br><br><button class="edit">Edit card</button> </article>'
        + ' </section>' + '</p></div>');
}


function addCardToLocalDb(cardId, cardName, cardDescription, cardStatus) {
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

function addCardToRemoteDb(id, title, description, status, boardName) {
    newCard = { card_id: id, card_title: title, card_description: description, card_status: status, board_name: boardName };
    var url = "http://127.0.0.1:5000/boards/save_cards";
    $.post(url, JSON.stringify(newCard), function (data) {
        console.log(data["board_name"]);
    });
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

var edited_card_id;

function save_card_handler() {
    var cardName = $("#new-card-title").val();
    var cardDescription = $("#new-card-description").val();
    change_card(edited_card_id, cardName, cardDescription)

    $("#add-card").click(save_new_card_handler);
}

function save_new_card_handler() {
    var cardName = $("#new-card-title").val();
    var cardDescription = $("#new-card-description").val();

    cards = JSON.parse(localStorage.getItem(nameOfListForCardsInBoard())) || cards;
    if (cardName && !cards.includes(cardName)) {
        $("#new-card-title").val('');
        $("#new-card-description").val('');
        addCardToLocalDb(cardId, cardName, cardDescription, Status.NOT_YET_ARRANGED);
        addCardToRemoteDb(cardId, cardName, cardDescription, Status.NOT_YET_ARRANGED);
        render_new_card(cardName, cardDescription, cardId, Status.NOT_YET_ARRANGED);
        ++cardId;
    }
};


function make_card_editable(ev) {
    editable_card_id = ev.target.id;
    card_id = parseInt(editable_card_id.substring(4));
};


//random color selector//
$(document).on('click', "#new_card_button", function () {
    var colors = ['rgb(240,91,61)', 'rgb(233,185,61)', 'rgb(225,226,90)', 'rgb(119,172,223)', 'rgb(190,74,157)', 'rgb(250,188,65)'];
    var random_color = colors[Math.floor(Math.random() * colors.length)];
    document.getElementById('modal_card').style.backgroundColor = random_color;
})