let modal = document.getElementById("modal");
let triggerButton = document.getElementById("trigger");
let cancelButton = document.getElementById("cancel");
let form = document.getElementById("todoList");

triggerButton.onclick = function () {
    modal.style.display = "flex";
};

cancelButton.onclick = function () {
    modal.style.display = "none";
};

window.onload = renderItems;

function updateTodos(todoList) {
    localStorage.setItem("todo-list", JSON.stringify(todoList));
    renderItems();
}

function loadTodos() {
    return JSON.parse(localStorage.getItem("todo-list") || "[]");
}

function renderItems() {

    document.getElementsByClassName("root")[0].innerHTML = "";

    loadTodos()
        .forEach((item) => {
            const div = document.createElement('div');
            div.innerHTML = `
                <span onclick='deleteItem(${item.id})'>x</span>
                <p>${item.title}</p>
                <p>${item.priority}</p>
                <p>${item.description}</p>
                <p>${item.deadline}</p>
                <button onclick="switchDone(${item.id})">
                    ${item.done ? "Mark as undone" : "Mark as done"}
                </button>
                <button>Edit</button>
            `;
            div.className = "todo";
            if (item.done)
                div.className += " done";
            document.getElementsByClassName("root")[0].appendChild(div);
        });
}

function switchDone(id) {

    const todoList = loadTodos();
    const todo = todoList.find((item) => (item.id === id));
    todo.done = !todo.done;

    updateTodos(todoList);

}

function deleteItem(id) {

    const newTodoList = loadTodos().filter((item) => (item.id !== id));
    updateTodos(newTodoList);
}

function submitForm() {
    const todo = {
        id: Date.now(),
        title: form["title"].value,
        description: form["description"].value,
        priority: form["priority"].value,
        deadline: form["deadline"].value,
        completed: false
    };

    const todoList = loadTodos();
    todoList.push(todo);
    updateTodos(todoList);

    modal.style.display = "none";

    return false;
}

window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

