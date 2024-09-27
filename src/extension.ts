import * as vscode from 'vscode';
import { showDataTree } from './dataView';
import { fetchDataFromUrl } from './service';

export function activate(context: vscode.ExtensionContext) {
    let disposable1 = vscode.commands.registerCommand('datalens.open', async () => {
        const url = await vscode.window.showInputBox({
			placeHolder: 'Enter the API URL',
			prompt: 'Please enter the URL of the API you want to fetch data from'
		});

		if (!url) {
			return;
		} else {
			handleRequest(url);
		}
    });

	const disposable2 = vscode.commands.registerCommand('datalens.seeInDataLens', async () => {
		const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const selectedText = editor.document.getText(selection);
            vscode.window.showInformationMessage(`Fetching data from ${selectedText}...`);
            handleRequest(selectedText);
        }
	});

    context.subscriptions.push(disposable1, disposable2);
}

const handleRequest = async (url: string) => {
	if (url) {
		const variablePattern = /\$\{(\w+)\}/g;
		const variables = [...url.matchAll(variablePattern)];

		if (variables.length > 0) {
			for (let variable of variables) {
				const variableName = variable[1];

				const userInput = await vscode.window.showInputBox({
					prompt: `Enter a value for ${variableName}`,
				});

				if (userInput !== undefined) {
					url = url.replace(variable[0], userInput);
				}
			}
		}

		vscode.window.showInformationMessage(`Fetching data from ${url}...`);

		try {
			const data = await fetchDataFromUrl(url);

			if(data) {
				showDataTree(data, url);
			} else {
				vscode.window.showErrorMessage('Failed to fetch data');
			}
		} catch (error: any) {
			vscode.window.showErrorMessage(error.message);
		}
	}
};

export function deactivate() {}
