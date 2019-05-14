# CakeCORED README

Simple vs-code Extension integrates some of CakePHP Framework's common tasks into the editor.

## Features

**DEBUG HELPER**: Creates a status bar label that shows the current Debug value from your current open project.
When clicked, it changes the Debug value from app.php or core.php automatically.

![Changing debug value by clicking over status bar](https://github.com/crhraphael/cake-cored/blob/master/repo/debug_plugin.gif?raw=true "Debug Plugin")

*Requirements*: Works while the ./config/app.php or the ./app/Config/core.php files exists. 
Since the logic is based on string pattern search, it's recommended not to change the configuration lines of the file.

If you're wondering how does it works here are the steps:

* Basicaly it searches **\env('DEBUG',\\** or **\write('debug',\\** pattern;
* Then it holds the index and do a str_split for proccessing the value written on the file.
* After that, there are functions that translate and change the value accordingly to CakePHP's version.

**DATABASE HELPER**: Coming soon!!


## Requirements

Works with CakePHP 2^ and CakePHP 3^.

## Extension Settings

* `cake-cored.enable`: {true/false} enable/disable this extension.
* `cake-cored.debugHelper`: {true/false} enable/disable the Debug Helper interface.

## General Feedback

Please, if you want to contribute to this project somehow (organization, development or even providing sugestions for future implementations) send an email to **crhistian_raphael@hotmail.com**. 

Any kind of support would be appreciated!

## Release Notes

## Known Issues

**Code design choice**: There are tons of design patterns that I could use when developing this plugin, but at first glance, I had to draw some diagrams to connect some dots and finnaly ended with this design choice.

The basic thoughts on it was: 

* Having a *main class* that controls functions of this plugin was a necessity.
* Every functionality has its own classes and libs if needed.

Surely there may be weak spots somewhere. I would like suggestions about it. Share your thoughts if you want to. Let's get better coding together! =)

### 0.0.1

Initial release of CakeCORED with basic functions and concepts.

### 1.0.0

Debug change functionality working properly and code design revised for new implementations.


### 1.2.0

Database functionality operational, but limited.
