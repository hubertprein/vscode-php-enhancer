import * as vscode from 'vscode';

export default class Method {
    protected name: string;
    protected visibility: string;

    public constructor(
        name: string,
        visibility: string
    ) {
        this.name = name;
        this.visibility = visibility;
    }

    static findAll(): Array<Method> {
        let methods: Method[] = [];

        // Get the active text editor
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return methods;
        }

        // Find methods defined in classes
        const methodMatches = editor.document.getText().matchAll(
            new RegExp(/(?<visibility>public|protected|private) function (?<method>[a-zA-Z]*)/, "gm")
        );

        for (const methodMatch of methodMatches) {
            const methodMatchName = methodMatch?.groups?.method;
            const methodMatchVisibility = methodMatch?.groups?.visibility;

            // Make sure we have a clear method
            if (!methodMatchName || !methodMatchVisibility) {
                continue;
            }

            methods.push(
                new Method(methodMatchName, methodMatchVisibility)
            );
        }

        return methods;
    }

    public getName(): string {
        return this.name;
    }

    public getVisibility(): string {
        return this.visibility;
    }
}
