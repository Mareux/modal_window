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
        completed: false
    }, false);
};

function closeDialog() {
    modal.style.display = "none";
}

window.onload = renderItems;

function updateTodos(todoList) {
    localStorage.setItem("todo-list", JSON.stringify(todoList));
    renderItems();
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
                   required>
            <input placeholder="Description" value="${todo.description}" type="text" name="description">
            <select name="priority" required>
                <option value=""  ${todo.priority || "selected"} disabled>Select priority...</option>
                <option value="Low" ${todo.priority !== "Low" || "selected" }>Low</option>
                <option value="Middle" ${todo.priority !== "Middle" || "selected"}>Middle</option>
                <option value="High" ${todo.priority !== "High" || "selected"}>High</option>
            </select>
            <input value="${todo.deadline}" type="datetime-local" name="deadline">
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
                ${item.done ? "" : `<button onclick='editItem(${item.id})'>Edit</button>
`}
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

