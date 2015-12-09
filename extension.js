/*
 * Copyright (c) Joe Martella All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var Q = require('q');
var fs = require('fs');
var licenses = require('./licenses.json');

// This method is called when your extension is activated.
function activate (context) {
  console.log('License Injector is ready and waiting.');

  var disposableAll = vscode.commands.registerCommand('extension.allFiles', function () {
    // Get the copyright owner to put into the license text.
    var owner = vscode.workspace.getConfiguration('licenseInjector').get('owner');

    // Add the full license to the project root if it doesn't exist.
    addRootLicense(owner);

    // Get target files, taking filepaths to ignore into account.
    getTargetFiles()
      .then(function (targetFiles) {
        for (var i = 0; i < targetFiles.length; i++) {
          addHeaderLicense(targetFiles[i], owner);
        }

        // Display a message box to the user.
        vscode.window.showInformationMessage('Injected license headers into your code.');
      });
  });

  var disposableCurrent = vscode.commands.registerCommand('extension.currentFile', function () {
    // Get the copyright owner to put into the license text.
    var owner = vscode.workspace.getConfiguration('licenseInjector').get('owner');

    // Add the full license to the project root if it doesn't exist.
    addRootLicense(owner);

    var editor = vscode.window.activeTextEditor;

    if (!editor) {
      vscode.window.showErrorMessage('Oops... you don\'t have a file open.');
      return;
    }

    // Get current file and check if it's supported.
    var currentFile = editor.document;
    var licenseText = getLicense(currentFile._languageId, owner);

    if (licenseText === null) {
      vscode.window.showErrorMessage('Sorry, this filetype isn\'t supported yet. Contact @martellaj to get it included.');
    } else {
      editor.edit(function (textEdit) {
        textEdit.insert(currentFile.positionAt(0), licenseText);
      });
    }
  });

  context.subscriptions.push(disposableAll);
  context.subscriptions.push(disposableCurrent);
}

// @name getTargetFiles
// @desc Returns all the files in the workspace, removing ones that the user
// specified to ignore.
// @returns A promise that returns an array of target files.
function getTargetFiles () {
  var deferred = Q.defer();

  // Get tokens to ignore from workspace configuration (trim them in case people used spaces).
  var ignoreTokens = vscode.workspace.getConfiguration('licenseInjector').get('ignore').split(',').map(function (term) {
    return term.trim();
  });

  if (ignoreTokens.length === 1 && ignoreTokens[0] === '') {
    ignoreTokens = [];
  }

  // Get all files in workspace.
  vscode.workspace.findFiles('**')
    .then(function (workspaceFiles) {
      var targetFiles = workspaceFiles.filter(isTargetFile(ignoreTokens));
      deferred.resolve(targetFiles);
    });

  return deferred.promise;
}

// @name isTargetFile
// @desc Filter function to remove files that user wants to ignore.
// @param ignoreTokens An array of strings to ignore in filepaths.
function isTargetFile (ignoreTokens) {
  return function (file) {
    if (ignoreTokens.length === 0) {
      return true;
    }

    for (var i = 0; i < ignoreTokens.length; i++) {
      if (file.path.indexOf(ignoreTokens[i]) > -1) {
        return false;
      }
    }

    return true;
  };
}

// @name addHeaderLicense
// @desc Adds the appropriate license text to given file.
// @param fileInfo An object with file path and language.
// @param owner The name of the copyright owner.
function addHeaderLicense (fileInfo, owner) {
  vscode.workspace.openTextDocument(fileInfo.path)
    .then(function (file) {
      var fileInfo = this;
      var licenseText = getLicense(file._languageId, owner);

      // If filetype is unsupported, just return without touching the file.
      if (licenseText === null) {
        return;
      }

      // Remove extra "/" at beginning of path.
      var truePath = fileInfo.path.substr(1);

      // Open file, add license, save file.
      var data = fs.readFileSync(truePath).toString();
      var fd = fs.openSync(truePath, 'w+');
      var buffer = new Buffer(licenseText + data);
      fs.writeSync(fd, buffer, 0, buffer.length);
      fs.close(fd);
    }.bind(fileInfo));
}

// @name getLicense
// @desc Gets the correctly formatted license text based on filetype.
// @param language The language the file is written in.
// @owner The name of the copyright owner.
function getLicense (language, owner) {
  if (licenses[language]) {
    return licenses[language].replace('<OWNER>', owner);
  } else {
    return null;
  }
}

// @name addRootLicense
// @desc Adds a full license to the project root if one doesn't exist.
// @param owner The name of the copyright owner.
function addRootLicense (owner) {
  var licensePath = vscode.workspace.rootPath + '/LICENSE';

  fs.stat(licensePath, function (err, data) {
    // If no 'LICENSE' is found, add one.
    if (err) {
      var fd = fs.openSync(licensePath, 'w+');
      var buffer = new Buffer(licenses['mit'].replace('<OWNER>', owner));
      fs.writeSync(fd, buffer, 0, buffer.length);
      fs.close(fd);
    } else {
      return;
    }
  });
}

exports.activate = activate;
