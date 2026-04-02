import { login, logout, getTasks, createTask, updateTask, deleteTaskApi, deleteAllTasksApi } from './services/api.js';

const loginContainer = document.querySelector('#login-container');
const loginForm = document.querySelector('#login-form');
const loginError = document.querySelector('#login-error');

const taskManager = document.querySelector('#task-manager');
const welcomeMessage = document.querySelector('#welcome-message');
const taskCounter = document.querySelector('#task-counter');
const taskThemeButton = document.querySelector('#task-theme-button');
const taskForm = document.querySelector('#task-form');
const taskList = document.querySelector('#task-list');
const clearButton = document.querySelector('#clear-button');
const logoutButton = document.querySelector('#logout-button');

let currentUser = null;
let allTasks = [];

// ---------------- LOGIN ----------------
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  loginError.textContent = '';

  const email = loginForm.email.value.trim();
  const password = loginForm.password.value.trim();

  try {
    currentUser = await login(email, password);
    
    setWelcomeMessage(currentUser);
    localStorage.setItem('user', JSON.stringify(currentUser));

    loginContainer.style.display = 'none';
    taskManager.style.display = 'block';

    loadTaskTheme();
    loadTasks();

  } catch (err) {
    loginError.textContent = err.message;
  };
});


// ---------------- LOGOUT ----------------
logoutButton.addEventListener('click', async () => {
  try {
    await logout();

    localStorage.removeItem('user');

    taskManager.style.display = 'none';
    loginContainer.style.display = 'block';

    taskList.innerHTML = '';

  } catch (err) {
    alert(err.message);
  };
});

// ------------- WELCOME MESSAGE --------------
function setWelcomeMessage(user) {
  welcomeMessage.textContent = `Hola ${user.nickname} 👋`;
};

// ---------------- DARK THEME ----------------
function loadTaskTheme() {
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
  };
};

taskThemeButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');

  const theme = document.body.classList.contains('dark-theme')
    ? 'dark'
    : 'light';

  localStorage.setItem('theme', theme);
});


// ---------------- LOAD TASKS ----------------
async function loadTasks() {
  try {
    allTasks = await getTasks();

    renderTasks();

  } catch (error) {
    console.error('Error loading tasks:', error);
  };
};

function renderTasks() {

  taskList.innerHTML = '';

  allTasks.forEach(task => createTaskListElement(task));

  updateTaskCounter(allTasks);

  toggleClearButton();

};


// --------------- TASK COUNTER ---------------
function updateTaskCounter(tasks) {
  const pending = tasks.filter(task => !task.completed).length;
  if(pending === 0) {
    taskCounter.textContent = '¡No tienes tareas pendientes! 🎉';
  } else {
    if(pending >= 2) {
      taskCounter.textContent = `Tienes ${pending} tareas pendientes.`;
    } else {
      taskCounter.textContent = `Tiene ${pending} tarea pendiente.`;
    };
  };    
};

// ---------------- CREATE TASK ELEMENT ----------------
function createTaskListElement(task) {

  const li = document.createElement('li');
  li.dataset.id = task.id;

  const left = document.createElement('div');
  left.className = 'task-left';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';

  if (task.completed) {
    checkbox.checked = true;
    li.classList.add('task-completed');
  };

  checkbox.addEventListener('change', () => {
    li.classList.toggle('task-completed');
  });

  const taskText = document.createElement('span');
  taskText.textContent = task.name;
  taskText.className = 'task-text';

  left.append(checkbox, taskText);

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const editBtn = createButton('edit', 'task-list-edit-button');
  editBtn.addEventListener('click', async () => {

    const newName = prompt('Editar tarea:', taskText.textContent);
    if (!newName) return;

    try {

      const updatedTask = await updateTask(li.dataset.id, newName);

      taskText.textContent = updatedTask.name;

    } catch (err) {
      alert(err.message);
    };
  });

  const delBtn = createButton('delete', 'task-list-del-button');
  delBtn.addEventListener('click', async () => {

    if (!confirm('¿Eliminar esta tarea?')) return;

    try {

      await deleteTaskApi(li.dataset.id);

      allTasks = allTasks.filter(task => task.id != li.dataset.id);

      renderTasks();

      toggleClearButton();

    } catch (err) {
      alert(err.message);
    };
  });

  actions.append(editBtn, delBtn);

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
  img.width = 16;
  img.height = 16;

  btn.appendChild(img);

  return btn;
};


// ---------------- ADD TASK ----------------
taskForm.addEventListener('submit', async (e) => {

  e.preventDefault();

  const taskInput = document.querySelector('#task-input');
  const taskName = taskInput.value.trim();

  if (!taskName) return;

  try {

    const newTask = await createTask(taskName);
    
    allTasks.push(newTask)
    renderTasks()

    taskInput.value = '';    

  } catch (error) {
    alert(error.message);
  };
});


// ---------------- DELETE ALL TASKS ----------------
clearButton.addEventListener('click', async () => {

  if (!confirm('¿Eliminar todas sus tareas?')) return;

  try {

    await deleteAllTasksApi();

    allTasks = [];

    renderTasks();

    toggleClearButton();

  } catch (error) {
    alert(error.message);
  };
});


// ---------------- TOGGLE CLEAR BUTTON ----------------
function toggleClearButton() {

  const listItemsLength = document.querySelectorAll('#task-list li').length;

  if (listItemsLength > 1) {
    clearButton.classList.add('clear-button-active');
  } else {
    clearButton.classList.remove('clear-button-active');
  };
};

async function initApp() {
  try {
    if (localStorage.getItem('user')) {
    loginContainer.style.display = 'none';
    taskManager.style.display = 'block';

    currentUser = JSON.parse(localStorage.getItem('user'));
    setWelcomeMessage(currentUser);

    loadTasks();
  } else {
    loginContainer.style.display = 'block';
  }

  } catch {
    loginContainer.style.display = 'block';
    taskManager.style.display = 'none';
  };
};

initApp();