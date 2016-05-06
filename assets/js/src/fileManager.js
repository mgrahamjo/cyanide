import tabs from '../components/tabs';
import editor from '../components/editor';
import nav from '../components/nav';

let openFiles = {};

function open(file) {

	editor.notify(file.path);

	nav.notify(file.path, true);

	tabs.notify(file, true);

	openFiles[file.path] = file;

}

function close(file) {

	let openList;

	editor.notify('');

	nav.notify(file.path, false);

	tabs.notify(file, false);

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