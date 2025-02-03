// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import ollama from "ollama";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  vscode.window.showInformationMessage(
    "ollama-deepseek-extention is now active!"
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "ollama-deepseek-extention.chat",
    () => {
      // The code you place here will be executed every time your command is executed
      const panel = vscode.window.createWebviewPanel(
        "deepChat",
        "Deep Seek Chat",
        vscode.ViewColumn.One,
        { enableScripts: true }
      );

      panel.webview.html = getWebviewContent();

      panel.webview.onDidReceiveMessage(async (message: any) => {
        if (message.command === "chat") {
          console.log("Received chat message:", message.text);
          const userPrompt = `${message.text}\n\nPlease respond in English.`;
          let responseText = "";

          try {
            const streamResponse = await ollama.chat({
              model: "deepseek-r1:7b",
              messages: [
                {
                  role: "system",
                  content:
                    "You are a helpful assistant. Always respond in English, regardless of the input language.",
                },
                { role: "user", content: userPrompt },
              ],
              stream: true,
            });

            for await (const part of streamResponse) {
              responseText += part.message.content.replace(/\<\/?think\>/g, "");
              console.log("Sending response part:", responseText);
              panel.webview.postMessage({
                command: "chatResponse",
                text: responseText,
              });
            }
          } catch (error) {
            console.error("Chat error:", error);
            panel.webview.postMessage({
              command: "chatResponse",
              text: `Error: ${String(error)}`,
            });
          }
        }
      });
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

function getWebviewContent(): string {
  return /*html*/ `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          :root {
            --background-color: var(--vscode-editor-background);
            --text-color: var(--vscode-editor-foreground);
            --border-color: var(--vscode-input-border);
            --button-bg: var(--vscode-button-background);
            --button-fg: var(--vscode-button-foreground);
            --button-hover-bg: var(--vscode-button-hoverBackground);
            --input-bg: var(--vscode-input-background);
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          }

          body {
            background-color: var(--background-color);
            color: var(--text-color);
          }

          #container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            padding: 24px;
            gap: 20px;
          }

          .header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
          }

          .header h2 {
            font-size: 1.5rem;
            font-weight: 500;
            margin: 0;
          }

          .chat-container {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          #prompt {
            padding: 16px;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            background-color: var(--input-bg);
            color: var(--text-color);
            font-size: 16px;
            resize: vertical;
            min-height: 120px;
            width: 100%;
            transition: border-color 0.2s;
          }

          #prompt:focus {
            outline: none;
            border-color: var(--button-bg);
          }

          .button-container {
            display: flex;
            gap: 12px;
          }

          #askBtn {
            padding: 8px 24px;
            height: 40px;
            font-size: 14px;
            border-radius: 6px;
            border: none;
            background-color: var(--button-bg);
            color: var(--button-fg);
            cursor: pointer;
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 500;
          }

          #askBtn:hover {
            background-color: var(--button-hover-bg);
          }

          #askBtn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .response-container {
            position: relative;
          }

          #response {
            padding: 20px;
            padding-right: 50px;
            line-height: 1.6;
            font-size: 16px;
            border-radius: 8px;
            background-color: var(--input-bg);
            border: 1px solid var(--border-color);
            white-space: pre-wrap;
          }

          .copy-button {
            position: absolute;
            top: 12px;
            right: 12px;
            padding: 8px;
            background: transparent;
            border: none;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.2s;
            color: var(--text-color);
          }

          .copy-button:hover {
            opacity: 1;
          }

          .copy-button svg {
            width: 16px;
            height: 16px;
          }

          .copy-tooltip {
            position: absolute;
            top: -30px;
            right: 0;
            background-color: var(--button-bg);
            color: var(--button-fg);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.2s;
          }

          .copy-tooltip.show {
            opacity: 1;
          }

          .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid #ffffff3d;
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 0.8s linear infinite;
            margin-right: 8px;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        </style>
      </head>
      <body>
        <div id="container">
          <div class="header">
            <h2>Local Deepseek Chat</h2>
          </div>
          
          <div class="chat-container">
            <textarea 
              id="prompt" 
              placeholder="Ask anything... (Shift + Enter for new line)"
            ></textarea>
            
            <div class="button-container">
              <button id="askBtn">Send Message</button>
            </div>

            <div class="response-container">
              <div id="response"></div>
              <button class="copy-button" id="copyBtn" style="display: none;" title="Copy to clipboard">
                <div class="copy-tooltip">Copied!</div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <script>
          const vscode = acquireVsCodeApi();
          const askBtn = document.getElementById('askBtn');
          const promptInput = document.getElementById('prompt');
          const responseDiv = document.getElementById('response');
          const copyBtn = document.getElementById('copyBtn');

          function setLoading(isLoading) {
            if (isLoading) {
              askBtn.innerHTML = '<span class="loading"></span>Thinking...';
              askBtn.disabled = true;
              promptInput.disabled = true;
              copyBtn.style.display = 'none';
            } else {
              askBtn.innerHTML = 'Send Message';
              askBtn.disabled = false;
              promptInput.disabled = false;
              if (responseDiv.textContent.trim()) {
                copyBtn.style.display = 'block';
              }
            }
          }

          copyBtn.addEventListener('click', async () => {
            const text = responseDiv.textContent;
            await navigator.clipboard.writeText(text);
            
            const tooltip = copyBtn.querySelector('.copy-tooltip');
            tooltip.classList.add('show');
            
            setTimeout(() => {
              tooltip.classList.remove('show');
            }, 2000);
          });

          promptInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (promptInput.value.trim()) {
                askBtn.click();
              }
            }
          });

          askBtn.addEventListener('click', () => {
            const text = promptInput.value.trim();
            if (!text) return;

            setLoading(true);
            responseDiv.textContent = '';
            vscode.postMessage({ command: 'chat', text });
          });

          window.addEventListener('message', event => {
            const {command, text} = event.data;
            if (command === 'chatResponse') {
              responseDiv.textContent = text;
              setLoading(false);
            }
          });
        </script>
      </body>
    </html>
  `;
}
