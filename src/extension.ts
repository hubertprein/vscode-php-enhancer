import * as vscode from 'vscode';
import Property from './Property';

export function activate(context: vscode.ExtensionContext) {
	const properties = Property.findAll();

	const getterMethods = vscode.languages.registerCompletionItemProvider('php', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
			// Gather all the getter methods based on the available properties
			let getterMethods: vscode.CompletionItem[] = [];

			properties.forEach(property => {
				const snippet = new vscode.SnippetString();
				snippet.appendText(`public function ${property.generateMethodName('get')}(): ${property.getType()}`);
				snippet.appendText("\n{");
				snippet.appendText(`\n\treturn $this->${property.getName()};`);
				snippet.appendText("\n}");

				const getterMethod = new vscode.CompletionItem(property.generateMethodName('get'), vscode.CompletionItemKind.Method);
				getterMethod.insertText = snippet;
				getterMethod.detail = `public function ${property.generateMethodName('get')}`;

				getterMethods.push(getterMethod);
			});

			return getterMethods;
		}
	});

	const setterMethods = vscode.languages.registerCompletionItemProvider('php', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
			// Gather all the setter methods based on the available properties
			let setterMethods: vscode.CompletionItem[] = [];

			properties.forEach(property => {
				const snippet = new vscode.SnippetString();
				snippet.appendText(`public function ${property.generateMethodName('set')}(${property.getType()} $${property.getName()}): void`);
				snippet.appendText("\n{");
				snippet.appendText(`\n\t$this->${property.getName()} = $${property.getName()};`);
				snippet.appendText("\n}");

				const setterMethod = new vscode.CompletionItem(property.generateMethodName('set'), vscode.CompletionItemKind.Method);
				setterMethod.insertText = snippet;
				setterMethod.detail = `public function ${property.generateMethodName('set')}{...}`;

				setterMethods.push(setterMethod);
			});

			return setterMethods;
		}
	});

	context.subscriptions.push(getterMethods);
	context.subscriptions.push(setterMethods);
}
