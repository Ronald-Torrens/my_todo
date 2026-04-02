//frontend/api/api.js

import { API_URL } from '../config/config.js';

/**
 * ----------------------------
 * AUTENTICACIÓN
 * ----------------------------
 */

// Login: guarda httpOnly cookies en el navegador automáticamente
export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // importante para cookies
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Error logging in');
  };

  const data = await res.json();
  console.log('Usuario logueado:', data.user);
  return data.user;
};

// Logout
export async function logout() {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Error logging out');
  };

  console.log('Usuario deslogueado');
};

/*
 * -----------------------------------
 * REGISTRO Y RECUPEACIÓN DE USUARIOS
 * -----------------------------------
 */
// Registro de nuevos usuarios
export async function register(nickname, email, password) {
  return safeFetch(`/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify({
      nickname,
      email,
      password
    })
  });
};

// Recuperación de contraseña
export async function forgotPassword(email) {
  return safeFetch(`/auth/recovery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify({ email })
  });
};

export async function resetPassword(token, password) {
  return safeFetch(`/auth/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify({
      token,
      newPassword: password
    })
  });
};

/**
 * ----------------------------
 * SAFE FETCH
 * ----------------------------
 * Maneja expiración de tokens automáticamente.
 */
async function safeFetch(url, options = {}) {
  options.credentials = 'include';

  let res = await fetch(`${API_URL}${url}`, options);

  if (res.status === 401) {
    // Intentar refresh
    const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include'
    });

    if (!refreshRes.ok) throw new Error('Session expired');

    // Reintentar petición original
    res = await fetch(`${API_URL}${url}`, options);
  };

  if (res.status === 409) {
    throw new Error('Ya tienes una tarea con ese nombre');
  };

  if (!res.ok) {
    let message = 'Fetch error';
    try {
      const error = await res.json();
      message = error.message || message;
    } catch {}
    throw new Error(message);
  };
  
  const data = await res.json();
  console.log(data);
  return data;
};

/**
 * ----------------------------
 * TAREAS
 * ----------------------------
 */

export async function getTasks() {
  return safeFetch(`/tasks`);
};

export async function createTask(task) {
  return safeFetch(`/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: task })
  });
};

export async function updateTask(id, data) {
  return safeFetch(`/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify( data )
  });
};

export async function deleteTaskApi(id) {
  return safeFetch(`/tasks/${id}`, { method: 'DELETE' });
};

export async function deleteAllTasksApi() {
  return safeFetch(`/tasks`, { method: 'DELETE' });
};