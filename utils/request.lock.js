// frontend/utils/request.lock.js

const activeRequests = new Set();

export function lockRequest(key) {

  if (activeRequests.has(key)) {
    return false;
  };

  activeRequests.add(key);
  return true;
};

export function unlockRequest(key) {
  activeRequests.delete(key);
};