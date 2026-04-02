// frontend/state/tasks.state.js
const state = {
  allTasks: []
};

export let currentFilter = 'pending';

export function setFilter(filter) {
  currentFilter = filter;
};

export function getTasks() {
  return state.allTasks;
};

export function setTasks(tasks) {
  state.allTasks = tasks;
};

export function addTask(task) {
  state.allTasks.push(task);
};

export function updateTaskState(id, changes) {
  const task = state.allTasks.find(t => t.id === id);
  if (task) Object.assign(task, changes);
};

export function removeTask(id) {
  state.allTasks = state.allTasks.filter(t => t.id != id);
};

export function clearTasks() {
  state.allTasks = [];
};