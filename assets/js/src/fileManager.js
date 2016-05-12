import manila from 'mnla/client';

let openFiles = {};

function open(file) {

	manila.notify('editor', file.path);

	manila.notify('nav', file.path, true);

	manila.notify('tabs', file, true);

	openFiles[file.path] = file;

}

function close(file) {

	let openList;

	manila.notify('editor', '');

	manila.notify('nav', file.path, false);
	
	manila.notify('tabs', file, false);

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