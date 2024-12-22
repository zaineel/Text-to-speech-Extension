function initializePopup() {
  let voices = [];

  // Populate voice options
  function populateVoices() {
    voices = speechSynthesis.getVoices();
    const voiceSelect = document.getElementById("voice");

    voiceSelect.innerHTML = voices
      .map(
        (voice, index) =>
          `<option value="${index}">${voice.name} (${voice.lang})</option>`
      )
      .join("");

    // Load saved settings
    chrome.storage.local.get(["voiceIndex", "rate"], (result) => {
      if (result.voiceIndex !== undefined) {
        voiceSelect.value = result.voiceIndex;
      }
      if (result.rate !== undefined) {
        document.getElementById("rate").value = result.rate;
        document.getElementById("rateValue").textContent = `${result.rate}x`;
      }
    });
  }

  // Initialize voices
  speechSynthesis.onvoiceschanged = populateVoices;

  // Save settings when changed
  document.getElementById("voice").addEventListener("change", (e) => {
    chrome.storage.local.set({ voiceIndex: e.target.value }, () => {
      showStatus();
    });
  });

  document.getElementById("rate").addEventListener("input", (e) => {
    const rate = e.target.value;
    document.getElementById("rateValue").textContent = `${rate}x`;
    chrome.storage.local.set({ rate }, () => {
      showStatus();
    });
  });

  function showStatus() {
    const status = document.getElementById("status");
    status.style.display = "block";
    setTimeout(() => {
      status.style.display = "none";
    }, 2000);
  }
}

// Initialize the popup when the script loads
initializePopup();
