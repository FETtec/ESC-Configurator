**FETtec ESC Configuration tool**

FETtec ESC Configurator is a crossplatform configuration tool for the FETtec ESC's.

## Installation

### Standalone

**This is the default installation method, and at some point in the future this will become the only way available for most platforms. Please use this method whenever possible.**

Download the installer from [Releases](https://github.com/FETtec/ESC-Configurator/releases).


## Native app build via NW.js

### Development

1. Install node.js
2. Change to project folder and run `yarn install`.
3. Run `yarn start`.

### App build and release

The tasks are defined in `gulpfile.js` and can be run either `yarn gulp <task-name>`:

2. Run `yarn gulp <taskname> [[platform] [platform] ...]`.

List of possible values of `<task-name>`:
* **dist** copies all the JS and CSS files in the `./dist` folder.
* **apps** builds the apps in the `./apps` folder [1].
* **debug** builds debug version of the apps in the `./debug` folder [1].
* **release** zips up the apps into individual archives in the `./release` folder [1]. 

[1] Running this task on macOS or Linux requires Wine, since it's needed to set the icon for the Windows app (build for specific platform to avoid errors).

#### Build or release app for one specific platform
To build or release only for one specific platform you can append the plaform after the `task-name`.
If no platform is provided, all the platforms will be done in sequence.

* **MacOS** use `yarn gulp <task-name> --osx64`
* **Linux** use `yarn gulp <task-name> --linux64`
* **Windows** use `yarn gulp <task-name> --win32`

You can also use multiple platforms e.g. `yarn gulp <taskname> --osx64 --linux64`.

