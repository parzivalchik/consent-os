export class Messaging {
  constructor() {
    this.listeners = new Map();
  }

  sendMessage(message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else if (response && response.success) {
          resolve(response.data);
        } else {
          reject(new Error(response?.error || 'Unknown error'));
        }
      });
    });
  }

  sendMessageToBackground(message) {
    return this.sendMessage(message);
  }

  onMessage(callback) {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      callback(message, sender, sendResponse);
    });
  }
}

export function createMessageHandler(handlers) {
  return (message, sender, sendResponse) => {
    const handler = handlers[message.type];
    if (handler) {
      Promise.resolve(handler(message.payload, sender))
        .then(result => sendResponse({ success: true, data: result }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
    }
    return false;
  };
}