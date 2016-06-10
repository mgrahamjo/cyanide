import manila from 'mnla/client';

let openFiles = {};

function open(file) {

	manila.components.editor.update(file.path, true);

	manila.components.nav.update(file.path, true);

	manila.components.tabs.update(file, true);

	openFiles[file.path] = file;

}

function close(file) {

	let cm = document.querySelector('.CodeMirror');

	cm = cm ? cm.CodeMirror : cm;

	if ((cm && !cm.isClean()) && !confirm(`Discard usaved changes to ${file.path}?`)) {

		return;

	}

	let openList;

	manila.components.editor.update(file.path, false);

	manila.components.nav.update(file.path, false);
	
	manila.components.tabs.update(file, false);

	delete openFiles[file.path];

	openList = Object.keys(openFiles);

	if (openList.length) {

		open(openFiles[openList[openList.length - 1]]);

	}

}

export default {

	open: open,
	close: close

};