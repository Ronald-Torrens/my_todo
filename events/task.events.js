// frontend/events/task.events.js

import { createTask, updateTask, deleteTaskApi, deleteAllTasksApi, logout } from '../services/api.js';
import { addTask, updateTaskState, removeTask, clearTasks, setFilter } from '../state/tasks.state.js';
import { renderTasks } from '../ui/render.tasks.js';
import { clearUser } from '../state/auth.state.js';
import { showLogin } from '../app.js';

export function initTaskEvents() {
  const form = document.querySelector('#task-form');
  const input = document.querySelector('#task-input');
  const filters = document.querySelector('#task-filters');
  const clearBtn = document.querySelector('#clear-button');
  const logoutBtn = document.querySelector('#logout-button');

  /* Crear tarea */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (!name) return;

    const task = await createTask(name);
    addTask(task);
    renderTasks();
    input.value = '';
  });

  /* Filtros */
  filters.addEventListener('click', (e) => {
    if (!e.target.dataset.filter) return;
    setFilter(e.target.dataset.filter);
    renderTasks();
  });

  /* Borrar todas */
  clearBtn.addEventListener('click', async () => {
    if (!confirm('¿Eliminar todas sus tareas?')) return;
    await deleteAllTasksApi();
    clearTasks();
    renderTasks();
  });

  /* Logout */
  logoutBtn.addEventListener('click', async () => {
    await logout();
    clearUser();
    localStorage.removeItem('user');
    showLogin();
  });
};