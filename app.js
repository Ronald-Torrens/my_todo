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
  li.textContent = task.name;

  const liContainer = document.createElement('div');
  liContainer.append(
    createButton('Edit', 'task-list-edit-button'),
    createButton('Del', 'task-list-del-button')
  );
  li.append(liContainer);
  taskList.append(li);
  toggleClearButton();
}

function createButton(text, className) {
  const btn = document.createElement('span');
  btn.textContent = text;
  btn.className = className;
  return btn;
}

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
  }
});

// ---- TASK LIST CLICK (EDIT & DELETE) ----
taskList.addEventListener('click', async (event) => {
  const li = event.target.closest('li');
  if (!li) return;

  // EDIT
  if (event.target.classList.contains('task-list-edit-button')) {
    const newName = prompt('Edite su tarea:', li.firstChild.textContent);
    if (!newName) return;
    try {
      const updatedTask = await updateTask(li.dataset.id, newName);
      li.firstChild.textContent = updatedTask.name;
    } catch (error) {
      alert(error.message);
    }
  }

  // DELETE
  if (event.target.classList.contains('task-list-del-button')) {
    if (!confirm('¿Usted está seguro de querer eliminar esta tarea?')) return;
    try {
      await deleteTaskApi(li.dataset.id);
      li.remove();
      toggleClearButton();
    } catch (error) {
      alert(error.message);
    }
  }
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
  }
});

// ---- TOGGLE CLEAR BUTTON ----
function toggleClearButton() {
  const listItemsLength = document.querySelectorAll('#task-list li').length;
  if (listItemsLength > 1) {
    clearButton.classList.add('clear-button-active');
  } else {
    clearButton.classList.remove('clear-button-active');
  }
}

// ---- INITIAL LOAD ----
loadTasks();