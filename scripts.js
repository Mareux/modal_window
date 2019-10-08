let modal = document.getElementById("modal");
let triggerButton = document.getElementById("trigger");

triggerButton.onclick = function () {
    modal.style.display = "flex";
    renderForm({
        id: Date.now(),
        title: "",
        description: "",
        priority: "",
        deadline: "",
        done: false
    }, false);
};

function closeDialog() {
    modal.style.display = "none";
}

window.onload = () => renderItems(loadTodos());

function updateTodos(todoList) {
    localStorage.setItem("todo-list", JSON.stringify(todoList));
    renderItems(todoList);
}

function loadTodos() {
    return JSON.parse(localStorage.getItem("todo-list") || "[]");
}

function renderForm(todo, edit) {

    modal.innerHTML = `
<div id="modal-content" class="modal-content">
    <div class="modal-header">
        <h3>${edit ? "Edit todo" : "Add todo"}</h3>
    </div>
    <form id="todoList" action="#">
        <div class="modal-body" onsubmit="return false;">
            <input autofocus value="${todo.title}" placeholder="Title" type="text" name="title" maxlength="20"
                   required pattern="^[a-zA-Z0-9_ ]*$">
            <input placeholder="Description" value="${todo.description}" type="text" name="description">
            <select name="priority" required>
                <option value=""  ${todo.priority || "selected"} disabled>Select priority...</option>
                <option value="Low" ${todo.priority !== "Low" || "selected" }>Low</option>
                <option value="Middle" ${todo.priority !== "Middle" || "selected"}>Middle</option>
                <option value="High" ${todo.priority !== "High" || "selected"}>High</option>
            </select>
            <input value="${todo.deadline}" type="date" name="deadline">
        </div>
        <div class="modal-footer">
            <button type="reset" id="cancel" onclick="closeDialog()">Cancel</button>
            <button type="submit" id="ok">Ok</button>
        </div>
    </form>
</div>
    `;

    modal.querySelector("form").onsubmit = () => submitForm(todo);
}

function renderItems(todoList) {

    document.getElementsByClassName("root")[0].innerHTML = "";

    todoList
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
                ${item.done ? "" : `<button onclick='editItem(${item.id})'>Edit</button>
`}
            `;
            div.className = "todo";
            if (item.done)
                div.className += " done";
            document.getElementsByClassName("root")[0].appendChild(div);
        });
}

function sortItemsByPriority() {

    const newList = loadTodos().sort((a,b) => {
       if (a.priority > b.priority)
           return 1;
       if (a.priority < b.priority)
           return -1;
       return 0;
    });

    updateTodos(newList);
}

function sortItemsByCompletion() {

    const newList = loadTodos().sort((a, b) => {
        if (a.done > b.done)
            return -1;
        return 1;
    });

    updateTodos(newList);

}

function itemSearch() {
    const searchString = document.getElementById("search").value;

    const newList = loadTodos().filter((item) => (item.title.includes(searchString)
        || item.description.includes(searchString)
        || item.deadline.includes(searchString)
        || item.priority.includes(searchString)
        ));
    renderItems(newList);
}

function switchDone(id) {

    const todoList = loadTodos();
    const todo = todoList.find((item) => (item.id === id));
    todo.done = !todo.done;

    updateTodos(todoList);

}

function editItem(id) {
    const todoList = loadTodos();
    const todo = todoList.find((item) => (item.id === id));

    renderForm(todo, true);

    modal.style.display = "flex";
}

function deleteItem(id) {

    const newTodoList = loadTodos().filter((item) => (item.id !== id));
    updateTodos(newTodoList);
}

function submitForm(todo) {
    const form = document.getElementById("todoList");

    todo.title = form["title"].value;
    todo.description = form["description"].value;
    todo.priority = form["priority"].value;
    todo.deadline = form["deadline"].value;

    const todoList = loadTodos();

    const oldIndex = todoList.findIndex((item) => (item.id === todo.id));

    if (oldIndex >= 0)
        todoList[oldIndex] = todo;
    else
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

