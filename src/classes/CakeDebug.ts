import * as vscode from 'vscode';
import * as fs from 'fs';

/**
 * CakeDebug class keeps control of any functionality 
 * of CakePHP's Debug value.  
 */
export default class CakeDebug {
    //private _debugValue : boolean;
	private _filePath : string;
	private _encode : string;
	private _cakeVersion : number;

    constructor(filePath : string, cakeVersion : number) {
		this._filePath = filePath;
		this._encode = "utf8";
		this._cakeVersion = cakeVersion;
    }

	/**
	 * Returns the real debug value from CakePHP's configuration file.
	 * 
	 * @return {any}
	 */
    public getDebugValue() : any {
        let indexOfDebugPattern = 0;
        let debugSubstrVal = "";
		let debugValue = null;

        let fileContent = fs.readFileSync(this._filePath, this._encode);
		
		indexOfDebugPattern = this._getDebugStringPatternIndex(fileContent);
			
		debugSubstrVal = fileContent.substr(indexOfDebugPattern, 19);

		debugValue = this._getDebugValueFromText(debugSubstrVal);

		if(debugValue === undefined) {
			throw new Error("Debug value not found.");
		}

        return debugValue;
    }

	/**
	 * Sets the new CakePHP's debug value and returns it to the caller.
	 * 
	 * @param debugValue 
	 * 
	 * @return {any}
	 */
    public changeDebugValue() : any{
		let debugValue = this.getDebugValue();

		let fileContent = fs.readFileSync(this._filePath, this._encode);		
		
		let result = this._changeFileDebugValue(fileContent, debugValue);
		fileContent = result.text;

		fs.writeFileSync(this._filePath, fileContent, this._encode); 

		return result.value;
	}
	
	/**
	 * Returns the index for the first pattern found where the Debug value
	 * is written.
	 * 
	 * @param sourceText Source text
	 * 
	 * @returns {number}
	 */
	private _getDebugStringPatternIndex(sourceText) : number {
		switch(this._cakeVersion) {
			case 2:
				return sourceText.indexOf("write('debug',");

			case 3:
				return sourceText.indexOf("env('DEBUG',");

		}
	}

	/**
	 * Returns the final value for each CakePHP version.
	 * 
	 * Each CakePHP Version has it's own Debug value types. So this function
	 * treats the return value differently for each version.
	 * 
	 * @param sourceText Source text
	 * 
	 * @return {any}
	 */
	private _getDebugValueFromText(sourceText) : any {
		switch(this._cakeVersion) {
			case 2:
				return (/2/.test(sourceText)) ? 2 : 0;
			case 3:
				return /true/.test(sourceText);
		}
	}

	/**
	 * Changes the debug value of CakePHP config files
	 * 
	 * @param sourceText Config text string.
	 * @param newValue New value for the Debug.
	 * 
	 * @return {any}
	 */
	private _changeFileDebugValue(sourceText, oldValue) : any {
		let newValue = null;
		let oldPattern = null;
		let newPattern = null;

		switch (this._cakeVersion) {
			case 2:
				newValue = (oldValue == "2") ? "0" : "2";
				oldPattern = `write('debug', ${oldValue})`;
				newPattern = `write('debug', ${newValue})`;
				break;
			case 3:
				newValue = !oldValue;
				oldPattern = `env('DEBUG', ${oldValue})`
				newPattern = `env('DEBUG', ${newValue})`
			default:
				break;
		}

		return {
			text: sourceText.replace(oldPattern, newPattern),
			value: newValue
		};
	}
}

