

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
    card_id = parseInt(data.substring(4));
    change_card_status(card_id, ev.target.id)
}


var Status = {
  NOT_YET_ARRANGED: "not_yet_arranged",
  NEW : "new" ,
  IN_PROGRESS: "in_progress",
  REVIEW: "review",
  DONE: "done"
};


function split_board_name(){
    board_split = window.location.href.split('/');
    board_name = board_split[board_split.length-1];
   return board_name;
}

function get_board_name(){
   return "cards" + split_board_name();
}

$(document).ready(function () {
    var cards = JSON.parse(localStorage.getItem(get_board_name())) || []
    var cardId = 1;
    for (var i in cards) {
        render_new_card(cards[i].title, cards[i].description, cardId, cards[i].status);
        ++cardId;
    }

    $(".nav").append("<li><a>" + decodeURI(split_board_name()) + "</a></li>>");

        $("#add-card").click(function () {
        //localStorage.setItem("cards", []);
        var cardName = $("#new-card-title").val();
        var cardDescription = $("#new-card-description").val();

        cards = JSON.parse(localStorage.getItem("cards")) || cards;
        if (cardName  && !cards.includes(cardName)) {
            $("#new-card-title").val('');
            $("#new-card-description").val('');
            add_new_card(cardId, cardName, cardDescription, Status.NOT_YET_ARRANGED)
            render_new_card(cardName, cardDescription, cardId, Status.NOT_YET_ARRANGED);
            ++cardId;
        };
    });

    $(".edit").click(function(){
        var card_name = $(this).closest(".card-text").find("header.cardname").html();
        var description = $(this).closest(".card-text").find("article").find("header").html();
        $('#new-card-title').val(card_name);
        $('#new-card-description').val(description);
        $(this).closest(".card-text").remove();
        edited_card_id = $(this).closest(".card-text").attr('id').substring(4);

        $("#add-card").click(save_card_handler);

    });

    $("#add-card").click(save_new_card_handler);
});

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

        cards = JSON.parse(localStorage.getItem(get_board_name())) || cards;
        if (cardName  && !cards.includes(cardName)) {
            $("#new-card-title").val('');
            $("#new-card-description").val('');
            add_new_card(cardId, cardName, cardDescription, Status.NOT_YET_ARRANGED)
            render_new_card(cardName, cardDescription, cardId, Status.NOT_YET_ARRANGED);
            ++cardId;
        };
}

var render_new_card = function(cardName, cardDescription, cardId, cardStatus){
     $("#" + cardStatus).append('<div class="card-text" id="card' + cardId + '" draggable="true" ondragstart="drag(event)")><p>' + '<section class="card"> ' + '<header class="cardname">' + cardName + ' </header>' + '<article class="card_text description">' + '<header>' + cardDescription + ' </header>' + '<br><br><button class="edit">Edit card</button> </article>' + ' </section>' + '</p></div>');
};

function add_new_card(cardId, cardName, cardDescription, cardStatus){
    cards = JSON.parse(localStorage.getItem(get_board_name())) || [];
    var card = {
        id: cardId,
        title: cardName,
        description:cardDescription,
        status:cardStatus
        };
    cards.push(card);
    localStorage.setItem(get_board_name(), JSON.stringify(cards));

}

function change_card_status(cardId, cardStatus){
    cards = JSON.parse(localStorage.getItem(get_board_name())) || [];
    for (i=0; i<cards.length; i++){
        if (cards[i].id === cardId){
            cards[i].status = cardStatus;
            break;
        }
    }
    localStorage.setItem(get_board_name(), JSON.stringify(cards));

}

function change_card(cardId, cardTitle, cardDescription){
    cards = JSON.parse(localStorage.getItem(get_board_name())) || [];
    for (i=0; i<cards.length; i++){
        if (cards[i].id === cardId){
            cards[i].title = cardTitle;
            cards[i].description = cardDescription;
            break;
        }
    }
    localStorage.setItem(get_board_name(), JSON.stringify(cards));

}

function make_card_editable(ev){
    editable_card_id = ev.target.id;
    card_id = parseInt(editable_card_id.substring(4));
}
