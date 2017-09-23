'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
//import {window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    //console.log('Congratulations, your extension "cake-cored" is now active!');

    //let wordCounter = new WordCounter();
    //let controller = new WordCounterController(wordCounter);
    
    let debugState = new DebugState();
    let debugStateController = new DebugStateController(debugState);

    //wordCounter.updateWordCount();
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.changeDebugValue', () => {
    //    wordCounter.updateWordCount();
        //console.log('HELLO WORLD!');
    
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        //vscode.window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(debugState);
    context.subscriptions.push(debugStateController);
    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

class WordCounter {
    private _statusBarItem: vscode.StatusBarItem;

    public updateWordCount() {
        //Create as needed
        if(!this._statusBarItem) {
            this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        }

        //Get the current text editor
        let editor = vscode.window.activeTextEditor;
        if(!editor) {
            this._statusBarItem.hide();
            return;
        }

        let doc = editor.document;

        this._statusBarItem.command = "extension.sayHello";
        //Only update status if an Markdown file
        //if(doc.languageId === "markdown") {
            let wordCount = this._getWordCount(doc);

            //Update the status bar
            this._statusBarItem.text = wordCount !== 1 ? `${wordCount} Words` : '1 Word';

            this._statusBarItem.show();
        //} else {
        //    this._statusBarItem.hide();
        //}
    }

    public _getWordCount(doc: vscode.TextDocument): number {
        let docContent = doc.getText();

        //Parse out unwanted whitespace so te split is accurate
        docContent = docContent.replace('/(< ([^>]+)<)/g', '').replace('/\s\s*$/', '');
        docContent = docContent.replace('/^\s\s*/', '').replace('/\s\s*$/', '');

        let wordCount = 0;

        if(docContent != "") {
            wordCount = docContent.split(" ").length;
        }

        return wordCount;
    }

    dispose() {
        this._statusBarItem.dispose();
    }
}



class WordCounterController {
    private _wordCounter: WordCounter;
    private _disposable: vscode.Disposable;

    constructor(wordCounter: WordCounter) {
        this._wordCounter = wordCounter;
        this._wordCounter.updateWordCount();

        //Subscribe to selection change and editor activation events
        let subscriptions: vscode.Disposable[] = [];
        vscode.window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        vscode.window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        // Create a combined disposable from both event subscriptions
        this._disposable = vscode.Disposable.from(...subscriptions);
    }

    private _onEvent() {
        this._wordCounter.updateWordCount();
    }

    public dispose() {
        this._disposable.dispose();
    }
}

class DebugState {
    private _disposable : vscode.Disposable;
    
    public dispose() {
        this._disposable.dispose();
    }
}

class DebugStateController {
    private _debugState :DebugState;
    private _disposable : vscode.Disposable;

    constructor(debugState: DebugState) {
        this._debugState = debugState;
        //this._debugState.updateWordCount();

        //Subscribe to selection change and editor activation events
        let subscriptions: vscode.Disposable[] = [];
        //vscode.window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        //vscode.window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        // Create a combined disposable from both event subscriptions
        //this._disposable = vscode.Disposable.from(...subscriptions);
    }  

    public dispose() {
        this._disposable.dispose();
    }
}