

const API_URL = 'https://my-todo-api-rest.onrender.com/api/v1/tasks';  // ajusta según tu servidor

export async function getTasks() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Error fetching tasks');
  return await res.json();
};

export async function createTask(task) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: task })
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error creating task');
  }
  return await res.json();
};

export async function updateTask(id, newName) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: newName })
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error updating task');
  }
  return await res.json();
};

export async function deleteTaskApi(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error deleting task');
  return await res.json();
};

export async function deleteAllTasksApi() {
  const res = await fetch(API_URL, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error deleting all tasks');
  return await res.json();
};