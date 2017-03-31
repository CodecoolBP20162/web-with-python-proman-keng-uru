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


var SaveToDatabase = function () {
    var currentState = new LocalDatabase(this);

    this.change = function (state) {
        currentState = state;
        currentState.renderSavedCards();
    };

    this.start = function () {
        currentState.renderSavedCards();
    };
}


var RemoteDatabase = function () {
    this.renderSavedCards = function (boardName) {
        var boardName = { board_name : boardName };
        var url = "http://127.0.0.1:5000/board/show_cards";
        $.post(url, JSON.stringify(boardName), function (data) {
            var cards_data = JSON.parse(data);
            var cards = cards_data['cards'];
            for (var i=0; i<cards.length; i++) {
                render_new_card(cardName = cards[i].card_title, cardDescription = cards[i].card_desc, cardId = cards[i].card_id, cardStatus = cards[i].status);
            }
            $(".editcard button").click(editCard);
            });
    };
    this.addCardToDb = function(id, title, description, status, boardName){
        newCard = { card_id : id, card_title : title, card_description : description, card_status : status, board_name : boardName};
        var url = "http://127.0.0.1:5000/boards/save_cards";
	    $.post(url, JSON.stringify(newCard), function (data) {
        });
    };
    this.removeCard = function(cardId){
        cardToDelete = { card_id: card_id };
        var url = "http://127.0.0.1:5000/boards/delete_cards";
        $.post(url, JSON.stringify(cardToDelete), function (data) {
        });
    };
    this.changeCardStatus = function(cardId, cardStatus){
        var newCardStatus = { card_id : cardId, card_status: cardStatus};
        var url = "/boards/update_status";
	    $.post(url, JSON.stringify(newCardStatus), function (data) {
        });
    };
    this.editCard = function(cardId, cardTitle, cardDescription){
        var cardToUpdate = { card_id : cardId, card_title: cardTitle, card_desc: cardDescription };
        var url = "/boards/edit_card";
        $.post(url, JSON.stringify(cardToUpdate), function (data) {
        });

    }

};

var LocalDatabase = function () {
    this.renderSavedCards = function () {
        var cards = JSON.parse(localStorage.getItem(nameOfListForCardsInBoard())) || [];
        for (var i in cards) {
            render_new_card(cards[i].title, cards[i].description, cards[i].id, cards[i].status);
        }
    };
    this.addCardToDb = function(cardId, cardName, cardDescription, cardStatus){
        cards = JSON.parse(localStorage.getItem(nameOfListForCardsInBoard())) || [];
        var card = {
        id: cardId,
        title: cardName,
        description: cardDescription,
        status: cardStatus
        };
        cards.push(card);
        localStorage.setItem(nameOfListForCardsInBoard(), JSON.stringify(cards));
        };
    this.removeCard = function(cardId){
        cards = JSON.parse(localStorage.getItem(nameOfListForCardsInBoard())) || [];
        for (i = 0; i < cards.length; i++) {
            if (cards[i].id === card_id) {
                cards.splice(i, 1);
                break;
            }
        }
    localStorage.setItem(nameOfListForCardsInBoard(), JSON.stringify(cards));

    };
    this.changeCardStatus = function(cardId, cardStatus){
        cards = JSON.parse(localStorage.getItem(nameOfListForCardsInBoard())) || [];
        for (i = 0; i < cards.length; i++) {
        if (cards[i].id === cardId) {
            cards[i].status = cardStatus;
            break;
        }
    }
    localStorage.setItem(nameOfListForCardsInBoard(), JSON.stringify(cards));


    };
    this.editCard = function(cardId, cardTitle, cardDescription) {
        cards = JSON.parse(localStorage.getItem(nameOfListForCardsInBoard())) || [];
        for (i = 0; i < cards.length; i++) {
            if (cards[i].id === cardId) {
                cards[i].title = cardTitle;
                cards[i].description = cardDescription;
                break;
            }
        }
        localStorage.setItem(nameOfListForCardsInBoard(), JSON.stringify(cards));
    };

};







$(document).ready(function () {
    // renderSavedCardsFromLocalDb();
    var boardName = decodeURI(obtainBoardnameFromHref());
    renderSavedCardsFromRemoteDb(boardName);
    $("#navbar").append("<li><a>" + boardName + "</a></li>>");
    $("#add-card").click(addNewcard);
    $('#new_card_button').click(function(){
        $("#add-card").show();
        $("#edit-card-button").hide();
    });
});




function addNewcard() {
    var highestCardId = getNextCardId() + 1;
    var cardName = $("#new-card-title").val();
    var cardDescription = $("#new-card-description").val();
    var boardName = decodeURI(obtainBoardnameFromHref());

    cards = JSON.parse(localStorage.getItem("cards")) || [];
    if (cardName && !cards.includes(cardName)) {
        $("#new-card-title").val('');
        $("#new-card-description").val('');
        addCardToLocalDb(highestCardId, cardName, cardDescription, Status.NEW);
        addCardToRemoteDb(highestCardId, cardName, cardDescription, Status.NEW, boardName);
        render_new_card(cardName, cardDescription, highestCardId,  Status.NEW);
    }
}

function editCard(){
    $("#add-card").hide();
    $("#edit-card-button").show();
    var card_name = $(this).closest(".card-text").find("header.cardname").html();
    var description = $(this).closest(".card-text").find("article").find("header").html();
    $('#new-card-title').val(card_name);
    $('#new-card-description').val(description);
    edited_card_id = $(this).closest(".card-text").attr('id').substring(4);
    $("#edit-card-button").click(saveCardHandler(edited_card_id));
    $(this).closest(".card-text").remove();
    $("#edit-card-button").hide();
    $("#add-card").show();
    }


function renderSavedCardsFromLocalDb() {
    var cards = JSON.parse(localStorage.getItem(nameOfListForCardsInBoard())) || [];
    for (var i in cards) {
        render_new_card(cards[i].title, cards[i].description, cards[i].id, cards[i].status);
    }
}

function renderSavedCardsFromRemoteDb(boardName) {
    var boardName = { board_name : boardName };
    var url = "http://127.0.0.1:5000/board/show_cards";
    $.post(url, JSON.stringify(boardName), function (data) {
        var cards_data = JSON.parse(data);
        var cards = cards_data['cards'];
        for (var i=0; i<cards.length; i++) {
            render_new_card(cardName = cards[i].card_title, cardDescription = cards[i].card_desc, cardId = cards[i].card_id, cardStatus = cards[i].status);
        }
        $(".editcard button").click(editCard);
        });
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

function addCardToRemoteDb (id, title, description, status, boardName) {
        newCard = { card_id : id, card_title : title, card_description : description, card_status : status, board_name : boardName};
        var url = "http://127.0.0.1:5000/boards/save_cards";
	    $.post(url, JSON.stringify(newCard), function (data) {
        });
}

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

var Status = {
    NEW: "new",
    IN_PROGRESS: "in_progress",
    REVIEW: "review",
    DONE: "done"
};


function isValidStatus(statusId) {
    var isFound = false;
    $.each(Status, function (key, value) {
        if (value === statusId) {
            isFound = true;
        }
    });
    return isFound;
}

function obtainBoardnameFromHref() {
    var board_split = window.location.href.split('/');
    var board_name = board_split[board_split.length - 1];
    return board_name;
}

function nameOfListForCardsInBoard() {
    return "cards_of_" + obtainBoardnameFromHref();
}

function getNextCardId() {
    var cards = JSON.parse(localStorage.getItem(nameOfListForCardsInBoard())) || [];
    var cardId = 1;
    for (var i in cards) {
        cardId = Math.max(cardId, cards[i].id);
    }
    return cardId++;
}

function render_new_card(cardName, cardDescription, cardId, cardStatus) {
    $("#" + cardStatus).append('<div class="card-text" id="card' + cardId +
        '" draggable="true" ondragstart="drag(event)")><p>' + '<section class="card"> ' +
        '<header class="cardname">' + cardName + ' </header>' + '<article class="card_text description">' +
        '<header>' + cardDescription + ' </header>' + '<br><br><div class="editcard"><button data-toggle="modal" data-target="#myModal">Edit card</button></div></article>'
        + ' </section>' + '</p></div>');
}

function changeCardInLocalDb(cardId, cardTitle, cardDescription) {
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


function changeCardInRemoteDb(cardId, cardTitle, cardDescription) {
    var cardToUpdate = { card_id : cardId, card_title: cardTitle, card_desc: cardDescription };
    var url = "/boards/edit_card";
     $.post(url, JSON.stringify(cardToUpdate), function (data) {
        });
}

function changeCardStatusInRemoteDb(cardId, cardStatus) {
        var newCardStatus = { card_id : cardId, card_status: cardStatus};
        var url = "/boards/update_status";
	    $.post(url, JSON.stringify(newCardStatus), function (data) {
        });
}


function saveCardHandler(edited_card_id) {
    var cardName = $("#new-card-title").val();
    var cardDescription = $("#new-card-description").val();
    changeCardInLocalDb(edited_card_id, cardName, cardDescription);
    changeCardInRemoteDb(edited_card_id, cardName, cardDescription);
}


    cards = JSON.parse(localStorage.getItem(nameOfListForCardsInBoard())) || cards;
    if (cardName && !cards.includes(cardName)) {
        $("#new-card-title").val('');
        $("#new-card-description").val('');
        addCardToLocalDb(cardId, cardName, cardDescription, Status.NEW);
        addCardToRemoteDb(cardId, cardName, cardDescription, Status.NEW);
        render_new_card(cardName, cardDescription, cardId, Status.NEW);
        ++cardId;
    }

//random color selector//
$(document).on('click', "#new_card_button", function () {
    var colors = ['rgb(240,91,61)', 'rgb(233,185,61)', 'rgb(225,226,90)', 'rgb(119,172,223)', 'rgb(190,74,157)', 'rgb(250,188,65)'];
    var random_color = colors[Math.floor(Math.random() * colors.length)];
    document.getElementById('modal_card').style.backgroundColor = random_color;
})
