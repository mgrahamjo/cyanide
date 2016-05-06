import fileManager from '../src/fileManager';

let vm = {

	tabs: {}

};

vm.close = path => {

	delete vm.tabs[path];

	fileManager.close({
		path: path,
		name: vm.tabs[path]
	});

};

vm.open = path => {

	fileManager.open({
		path: path,
		name: vm.tabs[path]
	});

};

function listen(file, open) {

	return new Promise(resolve => {

		if (open) {

			vm.active = file.path;

			vm.tabs[file.path] = file.name;

		} else {

			delete vm.tabs[file.path];

		}

		resolve(vm);

	});

}

export default {
	
	init: () => {

		return new Promise(resolve => {

			resolve(vm);

		});

	},

	listen: listen

};