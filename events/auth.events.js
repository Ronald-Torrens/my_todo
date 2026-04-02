// frontend/events/auth.events.js

import { login, logout, register, forgotPassword, resetPassword } from '../services/api.js';
import { showLogin, showRegister, showForgot, showChangePassword, showTasks } from '../app.js';
import { setUser, clearUser } from '../state/auth.state.js';
import { getTasks } from '../services/api.js';
import { setTasks } from '../state/tasks.state.js';
import { renderTasks } from '../ui/render.tasks.js';

/* ---------------- LOGIN ---------------- */
export function initLoginEvents() {
  const form = document.querySelector('#login-form');
  const error = document.querySelector('#login-error');
  const goRegister = document.querySelector('#go-register');
  const goForgot = document.querySelector('#go-forgot');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.textContent = '';

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    try {
      const user = await login(email, password);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));

      showTasks();

    } catch (err) {
      error.textContent = err.message;
    }
  });

  goRegister.addEventListener('click', (e) => {
    e.preventDefault();
    showRegister();
  });

  goForgot.addEventListener('click', (e) => {
    e.preventDefault();
    showForgot();
  });
}

/* ---------------- REGISTER ---------------- */
export function initRegisterEvents() {
  const form = document.querySelector('#register-form');
  const error = document.querySelector('#register-error');
  const goLogin = document.querySelector('#go-login');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nickname = form.nickname.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    try {
      await register(nickname, email, password);
      alert('Usuario creado. Ahora puedes iniciar sesión.');
      showLogin();
    } catch (err) {
      error.textContent = err.message;
    }
  });

  goLogin.addEventListener('click', (e) => {
    e.preventDefault();
    showLogin();
  });
}

/* ---------------- FORGOT ---------------- */
export function initForgotEvents() {
  const form = document.querySelector('#forgot-form');
  const error = document.querySelector('#forgot-error');
  const goLogin = document.querySelector('#go-login');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();

    try {
      await forgotPassword(email);
      alert('Revisa tu correo para recuperar tu contraseña');
      showLogin();
    } catch (err) {
      error.textContent = err.message;
    }
  });

  goLogin.addEventListener('click', (e) => {
    e.preventDefault();
    showLogin();
  });
}

/* ---------------- CHANGE PASSWORD ---------------- */
export function initChangePasswordEvents(token) {
  const form = document.querySelector('#change-password-form');
  const error = document.querySelector('#change-password-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.textContent = '';

    const password = form.password.value.trim();
    const rePassword = form['re-password'].value.trim();

    if (password !== rePassword) {
      error.textContent = 'Las contraseñas no coinciden';
      return;
    }

    try {
      await resetPassword(token, password);
      alert('Contraseña cambiada. Ahora puedes iniciar sesión.');

      window.history.replaceState({}, document.title, window.location.pathname);

      showLogin();
    } catch (err) {
      error.textContent = err.message;
    }
  });
}