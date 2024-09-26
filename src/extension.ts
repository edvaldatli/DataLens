import * as vscode from 'vscode';
import { showDataTree } from './dataView';
import { fetchDataFromUrl } from './service';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('datalens.open', async () => {
        const url = await vscode.window.showInputBox({
			placeHolder: 'Enter the API URL',
			prompt: 'Please enter the URL of the API you want to fetch data from'
		});

		if (url) {
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
        
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
