
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

