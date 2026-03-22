// app.js
import { getTasks, createTask, updateTask, deleteTaskApi, deleteAllTasksApi } from './api.js';

const taskThemeButton = document.querySelector('#task-theme-button');
const taskForm = document.querySelector('#task-form');
const taskList = document.querySelector('#task-list');
const clearButton = document.querySelector('#clear-button');

// ---- DARK THEME ----
loadTaskTheme();
taskThemeButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
});

function loadTaskTheme() {
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark') document.body.classList.add('dark-theme');
}

// ---- LOAD TASKS ----
async function loadTasks() {
  try {
    const tasks = await getTasks();
    taskList.innerHTML = '';
    tasks.forEach(task => createTaskListElement(task));
    toggleClearButton();
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
}

// ---- CREATE TASK ELEMENT ----
function createTaskListElement(task) {
  const li = document.createElement('li');
  li.dataset.id = task.id;

  const left = document.createElement('div');
  left.className = 'task-left';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';

  const taskText = document.createElement('span');
  taskText.textContent = task.name;
  taskText.className = 'task-text';

  left.append(checkbox, taskText);

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  actions.append(
    createButton('edit', 'task-list-edit-button'),
    createButton('delete', 'task-list-del-button')
  );

  li.append(left, actions);

  taskList.append(li);
  toggleClearButton();
};

function createButton(iconName, className) {
  const btn = document.createElement('span');
  btn.className = className;

  const img = document.createElement('img');
  img.src = `./assets/${iconName}.svg`;
  img.alt = iconName;
  img.width = 16; // tamaño de icono
  img.height = 16;

  btn.appendChild(img);
  return btn;
}

taskList.addEventListener('change', (event) => {
  if (event.target.classList.contains('task-checkbox')) {
    const li = event.target.closest('li');
    li.classList.toggle('task-completed');
  }
});

// ---- ADD TASK ----
taskForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const taskInput = document.querySelector('#task-input');
  const taskName = taskInput.value.trim();
  if (!taskName) return;

  try {
    const newTask = await createTask(taskName);
    createTaskListElement(newTask);
    taskInput.value = '';
  } catch (error) {
    alert(error.message);
  };
});

// ---- TASK LIST CLICK (EDIT & DELETE) ----
taskList.addEventListener('click', async (event) => {
  const li = event.target.closest('li');
  if (!li) return;

  const editBtn = event.target.closest('.task-list-edit-button');
  const delBtn = event.target.closest('.task-list-del-button');

  // EDIT
  if (editBtn) {
    const taskText = li.querySelector('.task-text');
    const newName = prompt('Edite su tarea:', taskText.textContent);
    if (!newName) return;
    try {
      const updatedTask = await updateTask(li.dataset.id, newName);
      taskText.textContent = updatedTask.name;
    } catch (error) {
      alert(error.message);
    };
  };

  // DELETE
  if (delBtn) {
    if (!confirm('¿Usted está seguro de querer eliminar esta tarea?')) return;
    try {
      await deleteTaskApi(li.dataset.id);
      li.remove();
      toggleClearButton();
    } catch (error) {
      alert(error.message);
    };
  };
});

// ---- DELETE ALL TASKS ----
clearButton.addEventListener('click', async () => {
  if (!confirm('¿Usted está seguro de querer eliminar todas sus tareas?')) return;
  try {
    await deleteAllTasksApi();
    taskList.innerHTML = '';
    toggleClearButton();
  } catch (error) {
    alert(error.message);
  };
});

// ---- TOGGLE CLEAR BUTTON ----
function toggleClearButton() {
  const listItemsLength = document.querySelectorAll('#task-list li').length;
  if (listItemsLength > 1) {
    clearButton.classList.add('clear-button-active');
  } else {
    clearButton.classList.remove('clear-button-active');
  };
};

// ---- INITIAL LOAD ----
loadTasks();