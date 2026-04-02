// frontend/utils/view.loader.js

export async function loadView(viewName) {
  const html = await fetch(`./views/${viewName}.html`).then(r => r.text());
  document.querySelector('#app').innerHTML = html;
}
