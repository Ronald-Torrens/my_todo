// frontend/ui/render.task.item.js
import { updateTask, deleteTaskApi } from '../services/api.js';
import { updateTaskState } from '../state/tasks.state.js';
import { renderTasks } from './render.tasks.js';
import { lockRequest, unlockRequest } from '../utils/request.lock.js';
import { removeTask } from '../state/tasks.state.js';

export function createTaskListElement(task, taskList) {
  const li = document.createElement('li');
  li.dataset.id = task.id;

  const left = document.createElement('div');
  left.className = 'task-left';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  if (task.completed) li.classList.add('task-completed');

  checkbox.addEventListener('change', async () => {
    const completed = checkbox.checked;
    li.classList.toggle('task-completed');
    if (!lockRequest(`task-${task.id}`)) return;

    try {
      await updateTask(task.id, { completed });
      updateTaskState(task.id, { completed });
      task.completed = completed;
      renderTasks()

    } catch (err) {
      alert(err.message);
      checkbox.checked = !completed;
      li.classList.toggle('task-completed');

    } finally {
      unlockRequest(`task-${task.id}`);
    };
  });

  const span = document.createElement('span');
  span.textContent = task.name;

  left.append(checkbox, span);

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const editBtn = document.createElement('span');
  editBtn.className = 'task-list-edit-button';
  editBtn.innerHTML = `<img src="./assets/edit.svg" alt="edit" width="16" height="16">`;
  editBtn.addEventListener('click', async () => {
    const newName = prompt('Editar tarea:', task.name);
    if (!newName) return;
    try {
      const updatedTask = await updateTask(task.id, { name: newName });
      task.name = updatedTask.name;
      span.textContent = updatedTask.name;
    } catch (err) {
      alert(err.message);
    }
  });

  const delBtn = document.createElement('span');
  delBtn.className = 'task-list-del-button';
  delBtn.innerHTML = `<img src="./assets/delete.svg" alt="delete" width="16" height="16">`;
  delBtn.addEventListener('click', async () => {
    if (!confirm('¿Eliminar esta tarea?')) return;
    try {
      await deleteTaskApi(task.id);
      removeTask(task.id);
      li.remove();
      renderTasks();
    } catch (err) {
      alert(err.message);
    }
  });

  actions.append(editBtn, delBtn);
  li.append(left, actions);

  return li;
};