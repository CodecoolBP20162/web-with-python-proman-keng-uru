"use strict";

$(document).ready(function () {
    var boards = JSON.parse(localStorage.getItem("boards")) || [];
    for (var i in boards) {
        $("#board-objects").append('<div class="floating-box"><p>' + boards[i] + '</p></div>');
    }
    $("#add-button").click(function () {
        var boardName = $("#new-board-title").val();
        boards = JSON.parse(localStorage.getItem("boards")) || boards;
        if (boardName  && !boards.includes(boardName)) {
            $("#board-objects").append('<div class="floating-box"><p>' + boardName + '</p></div>');
            $("#new-board-title").val('');
            boards.push(boardName);
            localStorage.setItem("boards", JSON.stringify(boards));

        };
    });
});