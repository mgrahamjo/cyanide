# CyanIDE

CyanIDE is a simple web interface for editing files on a remote linux server. It's like a friendly alternative to Vim, Emacs, or mounted filesystems.

## Installation

```
git clone https://github.com/mgrahamjo/cyanide
```

or

```
npm install cyanide
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

You will be prompted for the password to your RSA key before the app starts up at http://localhost:8000.

The first time you run the app it will take a moment to run `npm install` before starting up.

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