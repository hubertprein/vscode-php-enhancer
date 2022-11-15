import * as vscode from 'vscode';
import Property from './Property';

export function activate(context: vscode.ExtensionContext) {
	const methodsForPropertiesProvider = vscode.languages.registerCompletionItemProvider(
		'php',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

				// Make sure we want to add getter methods
				const linePrefix = document.lineAt(position).text.substr(0, position.character);
				if (!linePrefix.endsWith('get')) {
					// return undefined;
				}

				let newMethods: any = [];

				Property.findAll().forEach(property => {
					newMethods.push(new vscode.CompletionItem(property.generateMethodName('get'), vscode.CompletionItemKind.Method));
				});

				return newMethods;
				
				// // Get the active text editor
				// const editor = vscode.window.activeTextEditor;
				// if (!editor) {
				// 	return undefined;
				// }

				// // Find properties defined in classes
				// const classPropertyMatches = editor.document.getText().matchAll(
				// 	new RegExp(/public [a-zA-Z]* \$(?<property>[a-zA-Z]*);/, "gm")
				// );
				
				// let newMethods = [];

				// for (const classPropertyMatch of classPropertyMatches) {
				// 	const classPropertyMatchName = classPropertyMatch?.groups?.property;

				// 	// Make sure we have a property name
				// 	if (!classPropertyMatchName) {
				// 		continue;
				// 	}

				// 	const propertyName = classPropertyMatchName.charAt(0).toUpperCase() + classPropertyMatchName.slice(1);

				// 	newMethods.push(new vscode.CompletionItem('get' + propertyName, vscode.CompletionItemKind.Method));
				// };

				// return newMethods;
			}
		},
	);

	context.subscriptions.push(methodsForPropertiesProvider);
}
