/**
 * Created by kata on 2017.03.13..
 */


const form = document.getElementById('registrar');
const input = form.querySelector('input');
const ul = document.getElementById('invitedList');


function createLI(text) {
  var li = document.createElement('li');
  li.textContent = text;
  const label = document.createElement('label');

  li.appendChild(label);
  const editButton = document.createElement('button');
  editButton.textContent = 'edit';
  li.appendChild(editButton);

  const button = document.createElement('button');
  button.textContent = 'remove';
  li.appendChild(button);
  return li;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value;
    input.value = '';
    const li = createLI(text);
    ul.appendChild(li);

    boards = JSON.parse(localStorage.getItem("boards")) || []
    boards.push(text);
    localStorage.setItem("boards", JSON.stringify(boards));
});



ul.addEventListener('click', (e) => {
  if (e.target.textContent === 'remove') {
    const li = e.target.parentNode;
    const ul = li.parentNode;
    ul.removeChild(li);
  }
});


$(document).ready(function () {
    ul.appendChild(createLI("Bike"));


    var boards = JSON.parse(localStorage.getItem("boards")) || [];
    for (var i in boards) {
        var newLI = createLI(boards[i]);
        ul.append(newLI);
    }
});