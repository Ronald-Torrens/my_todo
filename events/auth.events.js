// frontend/events/auth.events.js
import { login, logout, register, forgotPassword, resetPassword } from '../services/api.js';
import { showLogin, showTasks, showRegister, showForgot, showChangePassword } from '../app.js';
import { setUser, clearUser } from '../state/auth.state.js';
import { DOM } from '../dom/dom.js';
import { renderTasks } from '../ui/render.tasks.js';
import { setTasks } from '../state/tasks.state.js';
import { getTasks } from '../services/api.js';

export function initAuthEvents({
  loginForm = DOM.loginForm,
  registerForm = DOM.registerForm,
  forgotForm = DOM.forgotForm,
  loginError = DOM.loginError,
  loginContainer = DOM.loginContainer,
  taskManager = DOM.taskManager,
  welcomeMessage = DOM.welcomeMessage,
  logoutButton = DOM.logoutButton,
  goRegisterLink = DOM.goRegisterLink,
  goForgotLink = DOM.goForgotLink
}) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.textContent = '';

    const email = loginForm.email.value.trim();
    const password = loginForm.password.value.trim();

    try {
      const user = await login(email, password);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      welcomeMessage.textContent = `Hola ${user.nickname} 👋`;
      
      // Cargar tareas al iniciar sesión
      const tasksFromAPI = await getTasks();
      setTasks(tasksFromAPI);
      renderTasks();

      showTasks();

    } catch (err) {
      loginError.textContent = err.message;
    }
  });

  if (goRegisterLink) {
    goRegisterLink.addEventListener('click', e => {
      e.preventDefault();
      showRegister();
    });
  };

  if (goForgotLink) {
    goForgotLink.addEventListener('click', e => {
      e.preventDefault();
      showForgot();
    });
  };



  logoutButton.addEventListener('click', async () => {
    try {
      await logout();
      clearUser();
      localStorage.removeItem('user');
      showLogin();

    } catch (err) {
      alert(err.message);
    };
  });

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nickname = registerForm.nickname.value.trim();
    const email = registerForm.email.value.trim();
    const password = registerForm.password.value.trim();

    try {
      await register(nickname, email, password);
      alert('Usuario creado. Ahora puedes iniciar sesión.');
      showLogin();

    } catch (err) {
      alert(err.message);
    };
  });

  forgotForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = forgotForm.email.value.trim();

    try {
      await forgotPassword(email);
      alert('Revisa tu correo para recuperar tu contraseña');
      showLogin();

    } catch (err) {
      alert(err.message);
    };
  });
};

export function initChangePasswordFlow(token) {
  const form = DOM.changePasswordForm;
  const errorEl = document.querySelector('#change-password-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.textContent = '';

    const password = form.password.value.trim();
    const rePassword = form['re-password'].value.trim();

    console.log("Token recibido:", token);
    console.log("Password enviada:", password);


    if (password !== rePassword) {
      errorEl.textContent = 'Las contraseñas no coinciden';
      return;
    }

    try {
      await resetPassword(token, password);
      alert('Contraseña cambiada. Ahora puedes iniciar sesión.');

      console.log("Token recibido:", token);
      console.log("Password enviada:", password);

      // limpiar token de la URL
      window.history.replaceState({}, document.title, window.location.pathname);

      showLogin();
    } catch (err) {
      errorEl.textContent = err.message;
    }
  });
};

