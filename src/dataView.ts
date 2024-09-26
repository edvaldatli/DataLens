import * as vscode from 'vscode';

export function showDataTree(data: any, url: string) {
    const panel = vscode.window.createWebviewPanel(
        'dataTree',
        'Data Structure',
        vscode.ViewColumn.Two,
        {
            enableScripts: true
        }
    );

    panel.webview.html = getTreeViewContent(data, url);
}

function getTreeViewContent(data: any, url: string): string {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>DataLens</title>
            <style>
                ul { list-style-type: none; padding-left: 20px; }
                li { margin: 5px 0; cursor: pointer; }
                .collapsible { cursor: pointer; color: lightblue; }
                .nested { display: none; }
                .active { display: block; }
                .key { font-weight: bold; }
                .type { color: grey; font-style: italic; }
                .arrow { color: grey; font-size: 12px; margin-right: 5px; }
            </style>
        </head>
        <body>
            <h1>DataLens</h1>
            <a href="${url}">${url}</a>
            ${buildJsonTree(data)}
            <script>
                // Handle collapsing/expanding nested elements
                document.querySelectorAll('.collapsible').forEach(element => {
                    element.addEventListener('click', function() {
                        const arrow = this.querySelector('.arrow');
                        this.classList.toggle('active');
                        const content = this.nextElementSibling;
                        if (content.style.display === 'block') {
                            content.style.display = 'none';
                            arrow.textContent = '▶';
                        } else {
                            content.style.display = 'block';
                            arrow.textContent = '▼';
                        }
                    });
                });
            </script>
        </body>
        </html>
    `;
}

function buildJsonTree(data: any): string {
    let html = '<ul>';

    for (let key in data) {
        const value = data[key];
        const valueType = Array.isArray(value) ? 'Array' : typeof value === 'object' ? 'Object' : typeof value;

        if (typeof value === 'object' && value !== null) {
            html += `
                <li>
                    <span class="collapsible key">
                        <span class="arrow">▶</span> ${key} <span class="type">(${valueType})</span>
                    </span>
                    <div class="nested">${buildJsonTree(value)}</div>
                </li>
            `;
        } else {
            html += `<li><span class="key">${key}</span>: ${value} <span class="type">(${valueType})</span></li>`;
        }
    }

    html += '</ul>';
    return html;
}
