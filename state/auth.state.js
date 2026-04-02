// frontend/state/auth.state.js
export let currentUser = null;

export function setUser(user) {
  currentUser = user;
}

export function clearUser() {
  currentUser = null;
}