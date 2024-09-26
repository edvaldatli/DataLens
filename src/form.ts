import * as vscode from 'vscode';

export function showForm(context: vscode.ExtensionContext) {
    const panel = vscode.window.createWebviewPanel(
        'formPanel',
        'DataLens Form',
        vscode.ViewColumn.One,
        {
            enableScripts: true
        }
    );

    panel.webview.html = getWebviewContent();

    return panel;
}

function getWebviewContent() {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>DataLens Form</title>
        </head>
        <body>
            <h1>Submit Your Data</h1>
            <form id="dataForm">
                <label for="url">Url:</label><br>
                <input type="text" id="url" name="url" /><br><br>
                <button type="button" onclick="submitForm()">Submit</button>
            </form>

            <script>
                const vscode = acquireVsCodeApi();

                function submitForm() {
                    const url = document.getElementById('url').value;
                    vscode.postMessage({
                        command: 'submitForm',
                        url: url,
                    });
                }
            </script>
        </body>
        </html>
    `;
}
