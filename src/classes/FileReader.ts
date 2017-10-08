import * as vscode from 'vscode';
import * as fs from 'fs';


export default class FileReader {
    private _disposable : vscode.Disposable;
    private _statusBarItem : vscode.StatusBarItem;
    private _debugValue : boolean;


    constructor() {
        this._debugValue = this._getDebugValue();
        //console.log("The new _debugValue is " + this._debugValue);

    }

    public update() {
        //Create as needed
        if(!this._statusBarItem) {
            this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        }        
        this._statusBarItem.command = "extension.changeDebugValue";

        //let wordCount = this._getWordCount(doc);
        
        //Update the status bar
        this._debugValue = !this._debugValue;

	}
	
	public changeStatusBarValue(value : boolean) {
        this._statusBarItem.text = `CakePHP Debug value is ${this._debugValue}`;
        this._statusBarItem.show();
	}

    private _getDebugValue(): any {
        //console.log("Getting Value...");
        let startingPosition = 0;
        let finalDebugDefinition;

        let fileContent = fs.readFileSync(vscode.workspace.rootPath + '/config/app.php', 'utf8');
        
        startingPosition = fileContent.indexOf("env('DEBUG',");
        

        finalDebugDefinition = fileContent.substr(startingPosition, 19);

        //console.log("Value found: " + /true/.test(finalDebugDefinition));


        return /true/.test(finalDebugDefinition);
    }

    public change() {
        let fileContent = fs.readFileSync(vscode.workspace.rootPath + '/config/app.php', 'utf8');
            //if(err) {
            //    console.error("Could not open file: %s", err);
                //process.exit(1);
            //    return "Erro ao abrir arquivo";
            //}

            let finalDebugDefinition = `env('DEBUG', ${!this._debugValue})`;

            fileContent = fileContent.replace(`env('DEBUG', ${this._debugValue})`, finalDebugDefinition);
            // console.log(`OLD ONE: env('DEBUG', ${this._debugValue})`);
            // console.log("NEXT ONE: " + finalDebugDefinition);
            // console.log("PATH: " + vscode.workspace.rootPath + '/config/app.php');
            // console.log(fileContent);

            fs.writeFileSync(vscode.workspace.rootPath + '/config/app.php', fileContent, 'utf-8');
                //if (err) {
                //    throw err;
                //}

                this.update();
                //console.log('File save complete, Debug mode set to ' + !this._debugValue);
            //});  
    }

    public dispose() {
        this._disposable.dispose();
    }
}

