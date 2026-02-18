const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const searchInput = document.getElementById("searchInput");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let searchText = "";

renderTasks();

// Add task
document.getElementById("addBtn").onclick = () => {
    const text = taskInput.value.trim();
    if (!text) return;

    tasks.push({ text, completed: false });
    taskInput.value = "";
    saveAndRender();
};

// Search filter
searchInput.addEventListener("input", (e) => {
    searchText = e.target.value.toLowerCase();
    renderTasks();
});

// Render tasks
function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {
        // Status filter
        if (currentFilter === "active" && task.completed) return false;
        if (currentFilter === "completed" && !task.completed) return false;

        // Search filter
        return task.text.toLowerCase().includes(searchText);
    });

    filteredTasks.forEach((task, index) => {
        const li = document.createElement("li");
        if (task.completed) li.classList.add("completed");

        const span = document.createElement("span");
        span.textContent = task.text;

        const btns = document.createElement("div");
        btns.className = "task-buttons";

        const completeBtn = document.createElement("button");
        completeBtn.textContent = task.completed ? "Undo" : "Completed";
        completeBtn.className = "complete";
        completeBtn.onclick = () => toggleTask(index);

        const renameBtn = document.createElement("button");
        renameBtn.textContent = "Rename";
        renameBtn.className = "rename";
        renameBtn.onclick = () => renameTask(index);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete";
        deleteBtn.onclick = () => deleteTask(index);

        btns.append(completeBtn, renameBtn, deleteBtn);
        li.append(span, btns);
        taskList.appendChild(li);
    });

    taskCount.textContent = `${filteredTasks.length} tasks`;
}

// Toggle completed
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveAndRender();
}

// Rename task
function renameTask(index) {
    const newText = prompt("Rename task:", tasks[index].text);
    if (newText && newText.trim()) {
        tasks[index].text = newText.trim();
        saveAndRender();
    }
}

// Delete task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveAndRender();
}

// Filter by status
function filterTasks(type) {
    currentFilter = type;

    document.querySelectorAll(".filters button")
        .forEach(btn => btn.classList.remove("active"));

    event.target.classList.add("active");
    renderTasks();
}

// Clear completed
function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveAndRender();
}

// Save & render
function saveAndRender() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}