# Text-to-Speech Everywhere

A powerful Chrome extension that converts selected text to speech with real-time word highlighting and customizable voice settings.

## Features

- 🎯 Instantly convert any selected text to speech
- 🎨 Real-time word highlighting during playback
- 🎤 Multiple voice options support
- ⚡ Adjustable speech rate
- 💾 Persistent settings across browser sessions
- 🌐 Works on any website

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## Usage

1. Select any text on any webpage
2. The extension will automatically start reading the selected text
3. Words are highlighted in yellow as they're being read
4. Access settings by clicking the extension icon in your toolbar:
   - Choose from available voices
   - Adjust reading speed (0.5x - 2.0x)

## Configuration

Click the extension icon to access the settings popup:

- Voice Selection: Choose from available system voices
- Speech Rate: Adjust the reading speed using the slider

## Technical Details

The extension is built using:

- Manifest V3
- Chrome Storage API for settings persistence
- Web Speech API for text-to-speech functionality
- Content Scripts for webpage integration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Built using the Web Speech API
- Inspired by the need for accessible web content
