'use strict';

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import CakeCored from './classes/CakeCored';

//import {window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode'


export function activate(context: vscode.ExtensionContext) {
    //console.log("lol o q ta conteceno");
    let cakeCored = new CakeCored();

    let changeDebugValue = vscode.commands.registerCommand('extension.changeDebugValue', () => {
        //console.log("ASDASD");
        
        cakeCored.changeDebugValue();
    });

    context.subscriptions.push(changeDebugValue);
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



// class DebugStateController {
//     private _debugState :CakeCored;
//     private _disposable : vscode.Disposable;

//     constructor(debugState: CakeCored) {
//         this._debugState = debugState;
//         this._debugState.update();

//         //Subscribe to selection change and editor activation events
//         let subscriptions: vscode.Disposable[] = [];
//         //vscode.window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
//         //vscode.window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

//         // Create a combined disposable from both event subscriptions
//         //this._disposable = vscode.Disposable.from(...subscriptions);
//     }  

//     public dispose() {
//         this._disposable.dispose();
//     }
// }