
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
    localStorage.setItem("boards", JSON.stringify(boards));
});


ul.addEventListener('click', (e) => {
    if (e.target.className === 'edit') {
        window.location = "/board/" + e.target.id;
    };
});

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

$(document).ready(function () {


    ul.appendChild(create_card_for_board("Go to mcdonalds ask for directions to burgerking"));
    ul.appendChild(create_card_for_board("Walk into Sea World with a fishing pole"));
    ul.appendChild(create_card_for_board("Sleeping"));

    var boards = JSON.parse(localStorage.getItem("boards")) || [];
    for (var i in boards) {
        var newLI = create_card_for_board(boards[i]);
        ul.appendChild(newLI);
    }


    $('.remove').click(function () {
        $(this).closest('li').remove();
        li = $(this).closest('li')
        id = li.find('input').val();
        remove_board_from_db(id);
    });

});
