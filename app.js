import { DOM } from './dom/dom.js';
import { getTasks } from './services/api.js';
import { setTasks } from './state/tasks.state.js';
import { renderTasks } from './ui/render.tasks.js';
import { initAuthEvents } from './events/auth.events.js';
import { initTaskEvents } from './events/task.events.js';
import { initChangePasswordFlow } from './events/auth.events.js';


function getRecoveryToken() {
  const params = new URLSearchParams(window.location.search);
  return params.get('token');
};

async function initApp() {
  initAuthEvents({});
  initTaskEvents({});

  const token = getRecoveryToken();

  if (token) {
    showChangePassword();
    initChangePasswordFlow(token);
    return;
  };

  await restoreSession();

  // theme
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') document.body.classList.add('dark-theme');

  DOM.taskThemeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');

    const current =
      document.body.classList.contains('dark-theme')
        ? 'dark'
        : 'light';

    localStorage.setItem('theme', current);
  });
};


async function restoreSession() {
  const storedUser = localStorage.getItem('user');

  if (!storedUser) {
    showLogin();
    return;
  };

  try {
    // intentar acceder a la API
    const tasks = await getTasks();
    setTasks(tasks);
    renderTasks();
    showTasks();

  } catch (err) {
    // cookie inválida o sesión expirada
    localStorage.removeItem('user');
    showLogin();
  };
};

// app.js

function showOnly(container) {
  const views = [
    DOM.loginContainer,
    DOM.registerContainer,
    DOM.forgotContainer,
    DOM.changePasswordContainer,
    DOM.taskManager
  ];

  views.forEach(v => v.style.display = 'none');

  if (container) container.style.display = 'block';
};

export function showLogin() {
  showOnly(DOM.loginContainer);
};

export function showTasks() {
  showOnly(DOM.taskManager);
};

export function showRegister() {
  showOnly(DOM.registerContainer);
};

export function showForgot() {
  showOnly(DOM.forgotContainer);
};

export function showChangePassword() {
  showOnly(DOM.changePasswordContainer);
};

initApp();