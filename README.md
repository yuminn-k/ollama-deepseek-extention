# Ollama DeepSeek Extension for VS Code

A VS Code extension that integrates Ollama's DeepSeek model for local AI assistance. This extension provides a chat interface within VS Code to interact with the DeepSeek language model running locally on your machine.

## Features

- 🚀 Local AI processing - all operations run on your machine
- 💻 Native VS Code integration
- 🔒 Privacy-focused - no data sent to external servers
- ⚡ Real-time streaming responses
- 📋 One-click copy functionality
- 🎨 Adaptive theme support - matches your VS Code theme
- ⌨️ Keyboard shortcuts for efficient interaction

https://github.com/user-attachments/assets/8a51a6f0-249e-4476-8fe8-c905c984bf32

## Requirements

Before using this extension, please ensure you have:

1. [Ollama](https://ollama.ai) installed on your system
2. DeepSeek model pulled locally:
```bash
ollama pull deepseek-coder:7b
```

## Installation

1. Install the extension from VS Code Marketplace
2. Ensure Ollama is running on your system
3. Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
4. Type "Deep Seek Chat" to start using the extension

## Usage

1. Open the chat interface using Command Palette or the keyboard shortcut
2. Type your question in the input field
3. Press Enter or click "Send Message" to get a response
4. Use the copy button to copy the response to clipboard
5. Use Shift+Enter for new lines in the input field

## Extension Settings

This extension contributes the following settings:

* `ollamaDeepseek.model`: Choose the DeepSeek model variant (default: "deepseek-r1:7b")
* `ollamaDeepseek.maxTokens`: Maximum tokens in response (default: 2048)

## Known Issues

- The extension requires Ollama to be running locally
- Initial model loading might take a few seconds
- Responses are currently limited to English language

## Release Notes

### 1.0.0
- Initial release
- Basic chat functionality
- Copy to clipboard feature
- Theme-aware styling

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Ollama](https://ollama.ai)
- Uses [DeepSeek](https://deepseek.ai) language model
- Inspired by the VS Code Extension community

---

**Enjoy coding with your local AI assistant!**
