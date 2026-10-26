const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

let tasks = [];

try {
  const savedTasks = JSON.parse(
    localStorage.getItem("tasks") || "[]"
  );

  tasks = Array.isArray(savedTasks) ? savedTasks : [];
} catch {
  tasks = [];
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateStats() {
  totalTasks.textContent = tasks.length;

  const completed = tasks.filter(
    task => task.completed
  ).length;

  completedTasks.textContent = completed;
  pendingTasks.textContent = tasks.length - completed;
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const taskElement = document.createElement("div");

    taskElement.className = task.completed
      ? "task completed"
      : "task";

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const completeButton = document.createElement("button");
    completeButton.className = "complete-btn";
    completeButton.textContent = task.completed
      ? "Undo"
      : "Complete";

    completeButton.addEventListener("click", () => {
      toggleTask(task.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
      deleteTask(task.id);
    });

    actions.appendChild(completeButton);
    actions.appendChild(deleteButton);

    taskElement.appendChild(title);
    taskElement.appendChild(actions);

    taskList.appendChild(taskElement);
  });

  updateStats();
}

function addTask(title) {
  const task = {
    id: crypto.randomUUID(),
    title: title,
    completed: false
  };

  tasks.push(task);

  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return {
        ...task,
        completed: !task.completed
      };
    }

    return task;
  });

  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);

  saveTasks();
  renderTasks();
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = taskInput.value.trim();

  if (!title) return;

  addTask(title);

  taskInput.value = "";
  taskInput.focus();
});

renderTasks();