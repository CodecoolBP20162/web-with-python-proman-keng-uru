"use strict";

var BoardStorage = function () {
    if (!(this instanceof BoardStorage)) {
        return new BoardStorage();
    } 
    var boardInd = location.search.split("=")[1];
    this.boardName = JSON.parse(localStorage.getItem("boards"))[boardInd];
    this.boardDivId = '#' + this.boardName;
    $("#board").attr("id", this.boardName);
};

/* Changes html dom with the stored html content if it exists. */
BoardStorage.prototype.loadBoard = function() {
  var boardHtml = localStorage.getItem(this.boardName);
  if(boardHtml) {
    $(this.boardDivId).empty();
    $(this.boardDivId).append(boardHtml);
  }
};

BoardStorage.prototype.saveBoard = function() {
  var boardHtml = $(this.boardDivId).html().replace(new RegExp( "\>[ ]+\<" , "g" ) , "><" ); 
  localStorage.setItem(this.boardName, boardHtml);
};

$(document).ready(function() {

  var storage = new BoardStorage();
  storage.loadBoard();

  /* sortable engine */
  $( "#nya, #new, #inp, #review, #done" ).sortable({
    connectWith: ".status"
  }).disableSelection();

  $(storage.boardDivId).on("DOMSubtreeModified", function(e){
    storage.saveBoard();
    // loging-testing saving
    // console.log("happening"); 
  });  

});