# CyanIDE

CyanIDE is a simple web interface for editing files on a remote linux server. It's like a friendly alternative to Vim, Emacs, or mounted filesystems.

## Installation

```
git clone https://github.com/mgrahamjo/cyanide
```

CyanIDE requires Node.js to be installed.

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

On Mac, open the CyanIDE app.

On Windows, double-click `CyanIDE.cmd`.

You will be prompted for the password to your RSA key. The first time you run the app it will take a few moments to run `npm install` before starting up.

Once connected, visit http://localhost:8000 in Chrome.

## Features

#### Search

In the upper-left, you can search for files in the remote project. Click the 'X' to clear the search results.

#### Create new folders or files

Right click on a folder and select "New File" or "New Folder". Enter a name in the dialog box.

#### Delete a folder or file

Right click on a folder or file and click "Delete".

#### Rename a folder or file

Right click on a folder or file and click "Rename". Enter a new name in the dialog box.

#### Save changes

After opening and editing a file, click "save" or press cmd + s on your keyboard.

#### Syntax Highlighting

CyanIDE uses file extensions to determine syntax highlighting rules. To change which file extensions map to which syntaxes, edit `lib/extensions.json`. If the syntax you're using is not currently supported, please [open an issue](https://github.com/mgrahamjo/cyanide/issues/new).