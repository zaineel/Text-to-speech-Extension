// Initialize the extension
chrome.runtime.onInstalled.addListener(() => {
  // Set default settings
  chrome.storage.local.set({
    voiceIndex: 0,
    rate: 1.0
  });
});

