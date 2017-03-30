
const form = document.getElementById('registrar');
const input = form.querySelector('input');
const ul = document.getElementById('boards');


function create_card_for_board(text) {
    const list_item = document.createElement('li');
    list_item.textContent = text;
    const label = document.createElement('label');

    list_item.appendChild(label);
    const editButton = document.createElement('button');
    editButton.className = 'edit';
    editButton.id = text;
    list_item.appendChild(editButton);

    const removeButton = document.createElement('button');
    removeButton.className = 'remove';
    list_item.appendChild(removeButton);

    const hidden_board_id = document.createElement('input');
    hidden_board_id.type = 'hidden';
    hidden_board_id.value = text;
    list_item.appendChild(hidden_board_id);
    return list_item;

}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value;
    input.value = '';
    const new_list_item = create_card_for_board(text);
    ul.appendChild(new_list_item);

    boards = JSON.parse(localStorage.getItem("boards")) || [];
    boards.push(text);
    let boardIdx = boards.indexOf(text);
    localStorage.setItem("boards", JSON.stringify(boards));

    saveNewBoardToDB(text, boardIdx);
});

// SAVE NEW BOARD TO POSTGREDB
saveNewBoardToDB = function (text, boardIdx) {
    newBoard = { board_title: text, board_id: boardIdx };
    let url = "http://127.0.0.1:5000/boards/" + boardIdx;
    $.post(url, JSON.stringify(newBoard), function (data) {
        //console.log(data);
    });
};

// OPEN SELECTED BOARD
ul.addEventListener('click', (e) => {
    if (e.target.className === 'edit') {
        window.location = "/board/" + e.target.id;
    };
});

// REMOVE BOARD FROM LOCAL STR
function remove_board_from_db(board_id) {
    var boards = JSON.parse(localStorage.getItem("boards")) || [];
    for (i = 0; i < boards.length; i++) {
        if (boards[i] === board_id) {
            boards.splice(i, 1);
            break;
        }
    }
    localStorage.setItem("boards", JSON.stringify(boards));
}

// REMOVE BOARD FROM POSTGRE DB
deleteBoardFromDB = function (boardTitle) {
    $.ajax({
        url: 'http://127.0.0.1:5000/boards/' + boardTitle,
        type: 'DELETE',
        //data: JSON.stringify({ board_title : boardTitle }),
        //contentType:'application/json',
        //dataType: 'text',
        success: function (data) { console.log(data); }
    });
};

//DISPLAY SAVED BOARDS
displayBoardsFromLocalStg = function () {
    var boards = JSON.parse(localStorage.getItem("boards")) || [];
    for (var i in boards) {
        var newLI = create_card_for_board(boards[i]);
        ul.appendChild(newLI);
    };
};

displayBoardsFromServerDb = function () {
    var boards_list = JSONObject.saved_boards;
    for (var i in boards_list) {
        var newLI = create_card_for_board(boards_list[i]);
        ul.appendChild(newLI);
    };
};

$(document).ready(function () {
    /*
    ul.appendChild(create_card_for_board("Go to mcdonalds ask for directions to burgerking"));
        ul.appendChild(create_card_for_board("Walk into Sea World with a fishing pole"));
        ul.appendChild(create_card_for_board("Sleeping"));
    */

    //displayBoardsFromLocalStg();
    displayBoardsFromServerDb();

    $('.remove').click(function () {
        $(this).closest('li').remove();
        li = $(this).closest('li')
        id = li.find('input').val();
        remove_board_from_db(id);
        deleteBoardFromDB(id);
    });

    //DELETE BOARD FROM POSTGRE DB
    deleteBoardFromDB = function (boardTitle) {
        $.ajax({
            url: 'http://127.0.0.1:5000/boards/' + boardTitle,
            type: 'DELETE',
            //data: JSON.stringify({ board_title : boardTitle }),
            //contentType:'application/json',
            //dataType: 'text',
            success: function (data) { console.log(data); }
        });
    };
});