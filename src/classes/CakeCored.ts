import {
    commands, Disposable, StatusBarItem, workspace, 
    StatusBarAlignment, window, WorkspaceConfiguration
} from 'vscode';

import * as fs from 'fs';

//import VersionValidator from './CakeVersionReader';
import ConfigController from './ConfigController';
import CakeDebug from './CakeDebug';

export default class CakeCored {
    private _debugValue : boolean;
    
    private _version : number;
    
    private _debugFilePath : string;
    private _databaseFilePath : string;
        
    //TODO: Não foi implementado ainda...
    private _configController : ConfigController; 
    private cakeDebug : CakeDebug;

    private _statusBarItem : StatusBarItem;

    private _settings : WorkspaceConfiguration;
    
    constructor() {		
        this._version = this._getCakePHPVersion();
        
        this._setFilesPaths(this._version);
        
        this._settings = workspace.getConfiguration("cake-cored");

        if(this._settings.get<boolean>("debugHelper")) {
            this.cakeDebug = new CakeDebug(this._debugFilePath, this._version);
        
            this._debugValue = this.cakeDebug.getDebugValue();
            this._showCakeDebugLabel();
        }
    }
    
    /**
     * Sets the debug file path and the database file path variables 
     * based on Cake's configs default locations.
     */
    private _setFilesPaths(version : number) {
        let file_config_path = workspace.rootPath + "/config/app.php";
        let file_cake2_core_path = workspace.rootPath + "/app/Config/core.php";
        let file_cake2_db_path = workspace.rootPath + "/app/Config/database.php";

        switch (this._version) {
            case 3:
                this._debugFilePath = file_config_path;
                this._databaseFilePath = file_config_path;
                break;
            case 2:			
                this._debugFilePath = file_cake2_core_path;
                this._databaseFilePath = file_cake2_db_path;
                break;
        }
    }
    
    /**
     * Returns the CakePHP version based on it's files location.
     */
    private _getCakePHPVersion() : number {
        if(fs.existsSync(workspace.rootPath + "/config/app.php")) {
            return 3;
        } else {// if (fs.existsSync(vscode.workspace.rootPath + "/app/Config/core.php")) {
            return 2;
        }
    }
    
    /**
     * Returns the debug value.
     */
    public getDebugValue() : any {
        return this._debugValue;
    }

    /**
     * Changes the debug value.
     */
    public changeDebugValue() {
        this._debugValue = this.cakeDebug.changeDebugValue();

        this._statusBarItem.text = `CakePHP Debug value is ${this._debugValue}`;
    }

    /**
     * Enables Cake Debug Status bar indicator.
     */
    private _showCakeDebugLabel() {
        if(!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
            this._statusBarItem.command = "extension.changeDebugValue";
            this._statusBarItem.text = `CakePHP Debug value is ${this._debugValue}`;
        }

        this._statusBarItem.show();
    }

}

