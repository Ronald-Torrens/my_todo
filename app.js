// frontend/app.js

import { loadView } from './utils/view.loader.js';

import { 
  initLoginEvents, 
  initRegisterEvents, 
  initForgotEvents, 
  initChangePasswordEvents 
} from './events/auth.events.js';

import { initTaskEvents } from './events/task.events.js';

import { getTasks } from './services/api.js';
import { setTasks } from './state/tasks.state.js';
import { renderTasks } from './ui/render.tasks.js';
import { setUser } from './state/auth.state.js';

/* -----------------------------------
   UTILIDAD: obtener token de la URL
----------------------------------- */
function getRecoveryToken() {
  const params = new URLSearchParams(window.location.search);
  return params.get('token');
};

/* -----------------------------------
   RUTAS / VISTAS
----------------------------------- */
export async function showLogin() {
  await loadView('login');
  initLoginEvents();
};

export async function showRegister() {
  await loadView('register');
  initRegisterEvents();
};

export async function showForgot() {
  await loadView('forgot');
  initForgotEvents();
};

export async function showChangePassword() {
  const token = getRecoveryToken();
  await loadView('change.password');
  initChangePasswordEvents(token);
};

export async function showTasks() {
  await loadView('task.manager');
  initTaskEvents();

  // cargar tareas del backend
  const tasks = await getTasks();
  setTasks(tasks);
  renderTasks();
};

/* -----------------------------------
   RESTAURAR SESIÓN
----------------------------------- */
async function restoreSession() {
  const storedUser = localStorage.getItem('user');

  if (!storedUser) {
    showLogin();
    return;
  };

  try {
    const user = JSON.parse(storedUser);
    setUser(user);

    showTasks();

  } catch (err) {
    // sesión expirada
    localStorage.removeItem('user');
    showLogin();
  };
};

/* -----------------------------------
   INICIO DE LA APP
----------------------------------- */
async function initApp() {
  const token = getRecoveryToken();

  if (token) {
    showChangePassword();
    return;
  };

  restoreSession();
}

initApp();