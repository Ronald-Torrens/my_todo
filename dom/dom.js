
// frontend/dom/dom.js

const $ = (selector) => document.querySelector(selector);

export const DOM = {

  // auth
  loginContainer: $('#login-container'),
  loginForm: $('#login-form'),
  loginError: $('#login-error'),

  // Register
  registerContainer: $('#register-container'),
  registerForm: $('#register-form'),
  goRegisterLink: $('#go-register'),
  goForgotLink: $('#go-forgot'),  

  // Forgot password (no implementado aún, pero preparado para el futuro)
  forgotContainer: $('#forgot-container'),
  forgotForm: $('#forgot-form'),

  // Change password (no implementado aún, pero preparado para el futuro)
  changePasswordContainer: $('#change-password-container'),
  changePasswordForm: $('#change-password-form'),

  // task manager
  taskManager: $('#task-manager'),
  welcomeMessage: $('#welcome-message'),
  taskCounter: $('#task-counter'),
  taskThemeButton: $('#task-theme-button'),
  logoutButton: $('#logout-button'),

  // tasks
  taskForm: $('#task-form'),
  taskFilters: $('#task-filters'),
  taskInput: $('#task-input'),
  taskList: $('#task-list'),
  clearButton: $('#clear-button')  
};