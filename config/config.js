// URL`s
const DEV_API = 'http://localhost:3000/api/v1/tasks';
const PROD_API = 'https://my-todo-api-rest.onrender.com/api/v1/tasks';

const hostname = window.location.hostname;

const isLocal =
  hostname === 'localhost' ||
  hostname === '127.0.0.1';

export const API_URL = isLocal ? DEV_API : PROD_API;

console.log('Running on:', hostname);
console.log('Using API:', API_URL);