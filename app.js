let section = document.querySelector("section");
let add = document.querySelector("form button");
add.addEventListener("click", (e) => {
  e.preventDefault();

  let form = e.target.parentElement;
  let todoText = form.children[0].value;
  let todoMonth = form.children[1].value;
  let todoDate = form.children[2].value;

  if (todoText === "") {
    alert("Please Enter Some Text.");
    return;
  }

  let todo = document.createElement("div");
  let text = document.createElement("p");
  let date = document.createElement("p");
  todo.classList.add("todo");
  text.classList.add("todo-text");
  date.classList.add("todo-date");
  text.innerText = todoText;
  date.innerText = todoMonth + "/" + todoDate;
  todo.appendChild(text);
  todo.appendChild(date);
  //CLEAR THE TEXT INPUT
  form.children[0].value = "";
  form.children[1].value = "";
  form.children[2].value = "";

  let completeButton = document.createElement("button");
  let trashButton = document.createElement("button");
  completeButton.classList.add("complete");
  trashButton.classList.add("trash");
  completeButton.innerHTML = '<i class="fas fa-check"></i>';
  trashButton.innerHTML = '<i class="fas fa-trash"></i>';
  todo.appendChild(completeButton);
  todo.appendChild(trashButton);
  todo.style.animation = "scaleUp 0.5s forwards";

  completeButton.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    todoItem.classList.toggle("done");
  });
  trashButton.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    todoItem.addEventListener("animationend", () => {
      let text = todoItem.children[0].innerText;
      let myListArray = JSON.parse(localStorage.getItem("list"));
      myListArray.forEach((item, index) => {
        if (item.todoText == text) {
          myListArray.splice(index, 1);
          localStorage.setItem("list", JSON.stringify(myListArray));
        }
      });
      todoItem.remove();
    });
    todoItem.style.animation = "scaleDown 0.5s forwards";
  });

  section.appendChild(todo);

  let myTodo = {
    todoText: todoText,
    todoMonth: todoMonth,
    todoDate: todoDate,
  };

  let mylist = localStorage.getItem("list");

  if (mylist == null) {
    localStorage.setItem("list", JSON.stringify([myTodo]));
  } else {
    let myListArray = JSON.parse(mylist);
    myListArray.push(myTodo);
    localStorage.setItem("list", JSON.stringify(myListArray));
  }
});

loadData();
function loadData() {
  let mylist = localStorage.getItem("list");
  if (mylist !== null) {
    let myListArray = JSON.parse(mylist);
    myListArray.forEach((items) => {
      let todo = document.createElement("div");
      let text = document.createElement("p");
      let date = document.createElement("p");
      todo.classList.add("todo");
      text.classList.add("todo-text");
      date.classList.add("todo-date");
      text.innerText = items.todoText;
      date.innerText = items.todoMonth + "/" + items.todoDate;
      todo.appendChild(text);
      todo.appendChild(date);
      let completeButton = document.createElement("button");
      let trashButton = document.createElement("button");
      completeButton.classList.add("complete");
      trashButton.classList.add("trash");
      completeButton.innerHTML = '<i class="fas fa-check"></i>';
      trashButton.innerHTML = '<i class="fas fa-trash"></i>';
      todo.appendChild(completeButton);
      todo.appendChild(trashButton);
      todo.style.animation = "scaleUp 0.5s forwards";

      completeButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done");
      });
      trashButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        todoItem.addEventListener("animationend", () => {
          let text = todoItem.children[0].innerText;
          let myListArray = JSON.parse(localStorage.getItem("list"));
          myListArray.forEach((item, index) => {
            if (item.todoText == text) {
              myListArray.splice(index, 1);
              localStorage.setItem("list", JSON.stringify(myListArray));
            }
          });
          todoItem.remove();
        });
        todoItem.style.animation = "scaleDown 0.5s forwards";
      });

      section.appendChild(todo);
    });
  }
}

function mergeTime(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
      result.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
      result.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
      if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
        result.push(arr2[j]);
        j++;
      } else {
        result.push(arr1[i]);
        i++;
      }
    }
  }

  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }
  return result;
}

function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let right = arr.slice(0, middle);
    let left = arr.slice(middle, arr.length);
    return mergeTime(mergeSort(right), mergeSort(left));
  }
}

console.log(mergeSort(JSON.parse(localStorage.getItem("list"))));

let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
  let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
  localStorage.setItem("list", JSON.stringify(sortedArray));

  let len = section.children.length;
  for (let i = 0; i < len; i++) {
    section.children[0].remove();
  }

  loadData();
});
