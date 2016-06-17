# CyanIDE

CyanIDE is a basic Sublime-like interface for editing files on a remote linux server. 

![CyanIDE Screenshot](https://raw.githubusercontent.com/mgrahamjo/cyanide/master/lib/screenshot.png)

## Installation

First, make sure Node.js version 4 or later is installed on your system:

```
node -v
```

Then clone the project:

```
git clone https://github.com/mgrahamjo/cyanide
```

On Windows, you will get an error: `Invalid path: 'CyanIDE.app/Icon'`. No worries, that's a Mac-only path.

## Setup

Save your connection settings in config.json:

```javascript
{
	"host": "your.remote.host",
	"username": "yourUsername",
	"privateKey": "/Users/You/.ssh/id_rsa",
	"cwd": "/path/to/remote/directory",
	// optionally, you can override the default port on which the app runs:
	"port": 8000
}
```

## Running the app

Double-click the CyanIDE app for your platform (there's one for Windows and one for Mac).

You will be prompted for the password to your RSA key. The first time you run the app it will take a few moments to run `npm install` before starting up.

Once connected, visit http://localhost:8000 in Chrome.

## Features

#### Search

In the upper-left, you can search for files in the remote project. Click the 'X' to clear the search results.

When the cursor is in the editor, you can press cmd + f to search the currently opened file for text matches, optionally with regex.

#### Create new folders or files

Right click on a folder and select "New File" or "New Folder". Enter a name in the dialog box.

#### Delete a folder or file

Right click on a folder or file and click "Delete".

#### Rename a folder or file

Right click on a folder or file and click "Rename". Enter a new name in the dialog box.

#### Save changes

After editing a file, click "save" or press cmd + s.

#### Refresh directory

If changes have been made on the remote filesystem, you can right click on a directory and click "Refresh" to get the current folders and files.

#### Syntax Highlighting

CyanIDE uses file extensions to determine syntax highlighting rules. To change which file extensions map to which syntaxes, edit `lib/extensions.json`. If the syntax you're using is not currently supported, please [open an issue](https://github.com/mgrahamjo/cyanide/issues/new).

## Common Issues

#### All I can see are the files and folders in my home directory

Something is wrong with the `cwd` setting in `config.json`. If the folder you want to load is in your home directory, the `cwd` setting should just be `"My-Project"`.

#### I get the error "No value for $TERM ..."

This means that your remote machine is not configured to be compatible with non-interactive shell sessions. Check to see if there are shell configuration rules on the remote machine in `~/.profile`, `~/.bashrc`, or `~/.bash_profile`. If so, change the rules to only apply when an interactive shell is available. For example, the rule:

`export PS1=""`

could be rewritten as:

`tty -s && export PS1=""`