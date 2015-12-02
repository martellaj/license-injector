# License Injector

[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)

License Injector was born of necessity and laziness. If you ever have to add license information to all of your source files, you understand the painful monotony of copying and pasting the correctly formatted comment string to the top of every file. Next time, use *License Injector* to do the work for you!

License Injector is currently in *super beta* and there might be bugs. Please log them on [GitHub](https://github.com/martellaj/license-injector/issues) if you find any!

## Features
* Insert a full license to the root of your project.
* Insert informational headers to every file in your project (can configure paths to ignore).
* Insert an informational header to the current file you're working on (useful for new files in a project that's already had licenses added everywhere else).
* Language detection so comments are inserted intelligently based on the context. This file has the currently supported languages (contact me if I'm missing one you want).

## How to install

1. Open up the `Command Palette` (`F1`, `CTRL+SHIFT+P`).
2. Type `ext install` and hit `ENTER`.
3. Type `License Injector` and click the download icon (![download icon](readme-assets/download.png)).
4. Restart VS Code to make the extension available.

## Configuration options

There are a few configuration options that the extension relies on per project. When you're ready to add licenses, open up `User Settings` and search for `License Injector` to find the configuration options.

| **Option**                 | **Description**      |
|------------------------|----------------------------------------------------|
| `licenseInjector.owner`  | The person or organization the copyright belongs to.                                                                      |
| `licenseInjector.ignore` | A comma-delimited string of tokens to ignore in file paths. Files with these tokens in their paths will not be processed. |

## Usage

### Inject all files
The first way to use License Injector is to add license information to all of your source files at the same time. I recommend this way so you don't even have to worry about licensing until you're ready to show the world. This option will add the appropriate comment (determined by filetype) to the top of each file and add a full license to the project root if one doesn't exist.

1. Configure options in `User Settings`. Don't forget to add directories that you don't want touched (i.e. *node_modules* or *bin*).
2. Open up the `Command Palette` (`F1`, `CTRL+SHIFT+P`).
3. Type `inject all` and hit `ENTER`.

### Inject the current file
The second way to use License Injector is to add license information to the current file you have open. I recommend this way if you're adding new files to a project that already is properly licensed. This option will add the appropriate comment (determined by filetype) to the top of the current file and add a full license to the project root if one doesn't exist.

1. Configure options in `User Settings`.
2. Open up the `Command Palette` (`F1`, `CTRL+SHIFT+P`).
3. Type `inject current` and hit `ENTER`.

## Feedback and bugs
This project is hosted on [GitHub](https://github.com/martellaj/license-injector). Please use the [Issues](https://github.com/martellaj/license-injector/issues) section of the repository if you have feedback or found a bug.

## Copyright
Copyright (c) Joe Martella. All rights reserved.