import * as vscode from 'vscode';
import Method from './Method';
import Property from './Property';

export function activate(context: vscode.ExtensionContext) {
	const methods = Method.findAll();
	const properties = Property.findAll();

	const getterMethods = vscode.languages.registerCompletionItemProvider('php', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
			// Gather all the getter methods based on the available properties
			let getterMethods: vscode.CompletionItem[] = [];

			properties.forEach(property => {
				const methodName = property.generateMethodName('get');

				// Skip adding this snippet if the method already exists
				if (methods.find(method => method.getName() === methodName)) {
					return;
				}

				const snippet = new vscode.SnippetString();
				snippet.appendText(`public function ${methodName}(): ${property.getType()}`);
				snippet.appendText("\n{");
				snippet.appendText(`\n\treturn $this->${property.getName()};`);
				snippet.appendText("\n}");

				const getterMethod = new vscode.CompletionItem(methodName, vscode.CompletionItemKind.Snippet);
				getterMethod.insertText = snippet;
				getterMethod.detail = `public function ${methodName}`;
				getterMethod.documentation = snippet.value.replace(new RegExp(/\\/, 'gm'), '');

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
				const methodName = property.generateMethodName('set');

				// Skip adding this snippet if the method already exists
				if (methods.find(method => method.getName() === methodName)) {
					return;
				}

				const snippet = new vscode.SnippetString();
				snippet.appendText(`public function ${methodName}(${property.getType()} $${property.getName()}): void`);
				snippet.appendText("\n{");
				snippet.appendText(`\n\t$this->${property.getName()} = $${property.getName()};`);
				snippet.appendText("\n}");

				const setterMethod = new vscode.CompletionItem(methodName, vscode.CompletionItemKind.Snippet);
				setterMethod.insertText = snippet;
				setterMethod.detail = `public function ${methodName}{...}`;
				setterMethod.documentation = snippet.value.replace(new RegExp(/\\/, 'gm'), '');

				setterMethods.push(setterMethod);
			});

			return setterMethods;
		}
	});

	context.subscriptions.push(getterMethods);
	context.subscriptions.push(setterMethods);
}
