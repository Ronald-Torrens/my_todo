// frontend/events/task.events.js
import { createTask, deleteAllTasksApi } from '../services/api.js';
import { addTask, clearTasks } from '../state/tasks.state.js';
import { renderTasks } from '../ui/render.tasks.js';
import { setFilter } from '../state/tasks.state.js';
import { lockRequest, unlockRequest } from '../utils/request.lock.js';
import { DOM } from '../dom/dom.js';

export function initTaskEvents({ 
  taskForm = DOM.taskForm, 
  taskList = DOM.taskList,
  taskFilters = DOM.taskFilters,
  clearButton = DOM.clearButton 
}) {
  
  // Añadir tarea
  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!lockRequest('create-task')) return;

    const name = DOM.taskInput.value.trim();
    if (!name) return;

    try {

      const newTask = await createTask(name);
      addTask(newTask);
      renderTasks();
      DOM.taskInput.value = '';

    } catch (err) {
      alert(err.message);

    } finally {
      unlockRequest('create-task');
    };
  });

  // Filtros
  taskFilters.addEventListener('click', (e) => {
    if (!e.target.dataset.filter) return;

    setFilter(e.target.dataset.filter);
    renderTasks();
  });

  // Borrar todas
  clearButton.addEventListener('click', async () => {
    if (!confirm('¿Eliminar todas sus tareas?')) return;
    try {
      await deleteAllTasksApi();
      clearTasks();
      renderTasks(taskList);
    } catch (err) {
      alert(err.message);
    }
  });
}