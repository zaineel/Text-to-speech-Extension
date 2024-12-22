function initializeTextToSpeech() {
  const speechSynth = window.speechSynthesis;
  let currentUtterance = null;
  let highlightedElements = [];
  let selectionInfo = null;

  // Function to ensure voices are loaded
  function getVoices() {
    return new Promise((resolve) => {
      const voices = speechSynth.getVoices();
      if (voices.length > 0) {
        resolve(voices);
      } else {
        speechSynth.addEventListener(
          "voiceschanged",
          () => {
            resolve(speechSynth.getVoices());
          },
          { once: true }
        );
      }
    });
  }

  document.addEventListener("mouseup", async () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText) {
      // Cancel any ongoing speech
      speechSynth.cancel();
      removeHighlights();

      // Store selection information
      if (selection.rangeCount > 0) {
        selectionInfo = {
          range: selection.getRangeAt(0).cloneRange(),
          text: selectedText,
        };
      }

      try {
        const voices = await getVoices();
        const settings = await new Promise((resolve) =>
          chrome.storage.local.get(["voiceIndex", "rate"], resolve)
        );

        // Create and configure utterance
        const utterance = new SpeechSynthesisUtterance(selectedText);

        // Set default rate if none specified
        utterance.rate = settings.rate ? parseFloat(settings.rate) : 1.0;

        // Set voice if available
        if (settings.voiceIndex !== undefined && voices[settings.voiceIndex]) {
          utterance.voice = voices[settings.voiceIndex];
        }

        // Split text into words
        const words = selectedText.split(/\s+/);
        let currentWordIndex = 0;

        utterance.onboundary = (event) => {
          if (event.name === "word" && selectionInfo) {
            removeHighlights();

            // Calculate current word index
            if (event.charIndex !== undefined) {
              let textUpToIndex = selectedText.substring(0, event.charIndex);
              currentWordIndex = textUpToIndex.split(/\s+/).length - 1;
              if (currentWordIndex >= 0 && currentWordIndex < words.length) {
                highlightWord(currentWordIndex, words[currentWordIndex]);
              }
            }
          }
        };

        utterance.onend = () => {
          removeHighlights();
          currentUtterance = null;
          selectionInfo = null;
        };

        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event);
          removeHighlights();
          currentUtterance = null;
          selectionInfo = null;

          // Attempt to recover by resetting speech synthesis
          speechSynth.cancel();
          if (event.error !== "canceled") {
            // Wait a bit and try again with default settings
            setTimeout(() => {
              const retryUtterance = new SpeechSynthesisUtterance(selectedText);
              speechSynth.speak(retryUtterance);
            }, 100);
          }
        };

        currentUtterance = utterance;
        speechSynth.speak(utterance);
      } catch (err) {
        console.error("Speech synthesis initialization error:", err);
        // Fallback to basic speech synthesis
        try {
          const basicUtterance = new SpeechSynthesisUtterance(selectedText);
          speechSynth.speak(basicUtterance);
        } catch (fallbackErr) {
          console.error("Fallback speech synthesis failed:", fallbackErr);
        }
      }
    }
  });

  function highlightWord(wordIndex, wordText) {
    if (!selectionInfo || !wordText) return;

    try {
      const range = selectionInfo.range.cloneRange();
      let textContent = range.toString();
      let startIndex = 0;
      let wordCount = 0;

      // Find the starting position of our target word
      while (wordCount < wordIndex && startIndex < textContent.length) {
        if (/\s/.test(textContent[startIndex])) {
          while (
            startIndex < textContent.length &&
            /\s/.test(textContent[startIndex])
          ) {
            startIndex++;
          }
          if (startIndex < textContent.length) {
            wordCount++;
          }
        } else {
          startIndex++;
        }
      }

      // Skip any leading whitespace
      while (
        startIndex < textContent.length &&
        /\s/.test(textContent[startIndex])
      ) {
        startIndex++;
      }

      const highlight = document.createElement("span");
      highlight.style.backgroundColor = "#ffeb3b";
      highlight.style.transition = "background-color 0.2s";

      const tempRange = document.createRange();
      tempRange.setStart(range.startContainer, range.startOffset + startIndex);
      tempRange.setEnd(
        range.startContainer,
        range.startOffset + startIndex + wordText.length
      );

      tempRange.surroundContents(highlight);
      highlightedElements.push(highlight);
    } catch (e) {
      console.warn("Failed to highlight word:", e);
    }
  }

  function removeHighlights() {
    highlightedElements.forEach((element) => {
      if (element && element.parentNode) {
        const parent = element.parentNode;
        while (element.firstChild) {
          parent.insertBefore(element.firstChild, element);
        }
        parent.removeChild(element);
      }
    });
    highlightedElements = [];
  }

  window.addEventListener("beforeunload", () => {
    if (currentUtterance) {
      speechSynth.cancel();
      removeHighlights();
    }
  });
}

// Initialize with error handling
try {
  initializeTextToSpeech();
} catch (err) {
  console.error("Failed to initialize text-to-speech:", err);
}
