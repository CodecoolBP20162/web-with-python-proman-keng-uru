"use strict";

$(document).ready(function () {
    // 
    var boards = JSON.parse(localStorage.getItem("boards")) || [];
    for (var i in boards) {
        $("#board-objects").append('<div class="board-box"><p>' + boards[i] + '</p></div>');
        // on double click create a get request submit form with string params and hidden params disappear
        $(".board-box").dblclick(function () {
            console.log($(this).find("p").text());
            var boardName = $(this).find("p").text();
            var boardID = boards.indexOf(boardName);
            $('<form action="/board" method="GET">' + 
            '<input type="hidden" name="boardid" value="' + boardID + '">' +
            '</form>').submit();
        });
    }
    $("#add-button").click(function () {
        var boardName = $("#new-board-title").val();
        boards = JSON.parse(localStorage.getItem("boards")) || boards;
        if (boardName  && !boards.includes(boardName)) {
            $("#board-objects").append('<div class="board-box"><p>' + boardName + '</p></div>');
            $("#new-board-title").val('');
            boards.push(boardName);
            console.log(boards);
            localStorage.setItem("boards", JSON.stringify(boards));
            // console.log(localStorage.getItem("boards"));
            // on double click create a get request submit form with string params and hidden params disappear
            $(".board-box").dblclick(function () {
                var boardID = boards.indexOf(boardName);
                $('<form action="/board" method="GET">' + 
                '<input type="hidden" name="boardid" value="' + boardID + '">' +
                '</form>').submit();
            });
        };
    });
});
