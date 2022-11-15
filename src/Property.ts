import * as vscode from 'vscode';

export default class Property {
    protected name: string;
    protected type: string;
    protected visibility: string;

    public constructor(
        name: string,
        type: string,
        visibility: string
    ) {
        this.name = name;
        this.type = type;
        this.visibility = visibility;
    }

    static findAll(): Array<Property> {
        let properties: Property[] = [];

        // Get the active text editor
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return properties;
        }

        // Find properties defined in classes
        const propertyMatches = editor.document.getText().matchAll(
            new RegExp(/(?<visibility>public|protected|private) (?<type>[a-zA-Z]*) \$(?<property>[a-zA-Z]*)/, "gm")
        );

        for (const propertyMatch of propertyMatches) {
            const propertyMatchName = propertyMatch?.groups?.property;
            const propertyMatchType = propertyMatch?.groups?.type;
            const propertyMatchVisibility = propertyMatch?.groups?.visibility;

            // Make sure we have a clear property
            if (!propertyMatchName|| !propertyMatchType || !propertyMatchVisibility) {
                continue;
            }

            properties.push(
                new Property(
                    propertyMatchName,
                    propertyMatchType,
                    propertyMatchVisibility
                )
            );
        }

        return properties;
    }
    
    public getName(): string {
        return this.name;
    }
    
    public getType(): string | null {
        return this.type;
    }

    public generateMethodName(prefix: string): string {
        return prefix + this.name.charAt(0).toUpperCase() + this.name.slice(1);
    }
}
