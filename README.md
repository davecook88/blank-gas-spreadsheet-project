This repo was made to help me to get set up quickly with Typescript when starting a new Google Apps Script project.

If you don't already have clasp, you should download it. It's great. You'll need it for this repo to be of use.

In order to set this up, create a new blank Apps Script project and a new empty folder in your local directory.

Run this to clone the repo into your empty folder: `git clone https://github.com/davecook88/blank-gas-spreadsheet-project .`

Open a terminal in your new folder and run `npm i` to download the types npm library (you'll need node.js installed)

Copy the script id from your Apps Script project and update the value in `clasp.json`.

Run `clasp push` to make sure everything is working.

This repo also includes my SpreadsheetManager class, which has saved me a lot of time. It has it's own repo and readme here: [SpreadsheetManager](https://github.com/davecook88/SpreadsheetManager)

Pull requests more than welcome!
