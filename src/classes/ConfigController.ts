import * as vscode from 'vscode';
import * as fs from 'fs';
import CakeDebug from './CakeDebug';

/**
 * ConfigController class controls which plugin functionality
 * is enabled.
 * 
 * It enables and disables any function that is operable 
 * within this extension.
 * 
 * Every configuration is saved inside cakecored.json.
 */
export default class ConfigController {
    private _debugValue : boolean;

	private _version : number;

	private _debugFilePath : string;
	private _databaseFilePath : string;

	private cakeDebug : CakeDebug;

    constructor() {		
		this._version = this._getCakePHPVersion();
		
		this._setFilesPaths(this._version);
		
		this.cakeDebug = new CakeDebug(this._debugFilePath, this._version);
		
		this._debugValue = this.cakeDebug.getDebugValue();
	}

	/**
	 * Sets the debug file path and the database file path variables 
	 * based on Cake's configs default locations.
	 */
	private _setFilesPaths(version : number) {
		let file_config_path = vscode.workspace.rootPath + "/config/app.php";
		let file_cake2_core_path = vscode.workspace.rootPath + "/app/Config/core.php";
		let file_cake2_db_path = vscode.workspace.rootPath + "/app/Config/database.php";

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
		if(fs.existsSync(vscode.workspace.rootPath + "/config/app.php")) {
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
		this.cakeDebug.changeDebugValue();
	}
}

