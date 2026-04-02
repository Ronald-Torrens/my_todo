// frontend/ui/render.tasks.js

import { getTasks, currentFilter } from '../state/tasks.state.js';
import { createTaskListElement } from './render.task.item.js';

export function renderTasks() {
  const taskList = document.querySelector('#task-list');
  const taskCounter = document.querySelector('#task-counter');
  const clearButton = document.querySelector('#clear-button');

  if (!taskList) return; // vista no cargada aún

  let tasks = getTasks();

  if (currentFilter === 'pending') {
    tasks = tasks.filter(t => !t.completed);
  } else if (currentFilter === 'completed') {
    tasks = tasks.filter(t => t.completed);
  }

  taskList.innerHTML = '';
  tasks.forEach(task => taskList.appendChild(createTaskListElement(task)));

  updateTaskCounter(taskCounter, getTasks());
  toggleClearButton(clearButton);
}

function updateTaskCounter(counterEl, tasks) {
  const pending = tasks.filter(t => !t.completed).length;

  if (pending === 0) {
    counterEl.textContent = '¡No tienes tareas pendientes! 🎉';
  } else if (pending === 1) {
    counterEl.textContent = 'Tienes 1 tarea pendiente.';
  } else {
    counterEl.textContent = `Tienes ${pending} tareas pendientes.`;
  }
}

function toggleClearButton(clearButton) {
  const hasTasks = getTasks().length > 0;
  clearButton.classList.toggle('clear-button-active', hasTasks);
}