const STORAGE_KEYS = {
  SERVICES: 'consent_os_services',
  HISTORY: 'consent_os_history',
  INITIALIZED: 'consent_os_initialized'
};

export class Storage {
  async get(key) {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (result) => {
        resolve(result[key] || null);
      });
    });
  }

  async set(key, value) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, () => {
        resolve(true);
      });
    });
  }

  async remove(key) {
    return new Promise((resolve) => {
      chrome.storage.local.remove(key, () => {
        resolve(true);
      });
    });
  }

  async getAll() {
    return new Promise((resolve) => {
      chrome.storage.local.get(null, (result) => {
        resolve(result);
      });
    });
  }
}