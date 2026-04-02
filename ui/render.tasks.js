// frontend/ui/render.tasks.js
import { getTasks, currentFilter } from '../state/tasks.state.js';
import { createTaskListElement } from './render.task.item.js';
import { DOM } from '../dom/dom.js';

export function renderTasks(taskList = DOM.taskList) {
  let tasks = getTasks();

  if (currentFilter === 'pending') {
    tasks = tasks.filter(t => !t.completed);
  } else if (currentFilter === 'completed') {
    tasks = tasks.filter(t => t.completed);
  }

  taskList.innerHTML = '';
  tasks.forEach(task => taskList.appendChild(createTaskListElement(task, taskList)));

  updateTaskCounter(getTasks()); // siempre sobre todas
  toggleClearButton();
};

// ---------------- TASK COUNTER ----------------
function updateTaskCounter(tasks) {
  const pending = tasks.filter(task => !task.completed).length;
  if (pending === 0) {
    DOM.taskCounter.textContent = '¡No tienes tareas pendientes! 🎉';
  } else if (pending === 1) {
    DOM.taskCounter.textContent = 'Tienes 1 tarea pendiente.';
  } else {
    DOM.taskCounter.textContent = `Tienes ${pending} tareas pendientes.`;
  }
}

// ---------------- TOGGLE CLEAR BUTTON ----------------
function toggleClearButton() {
  const hasTasks = getTasks().length > 0;
  DOM.clearButton.classList.toggle('clear-button-active', hasTasks);
}