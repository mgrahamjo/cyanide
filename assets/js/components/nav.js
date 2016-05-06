import fileManager from '../src/fileManager';

let vm = {
	selected: '',
	active: '',
	open: {}
};

vm.clickDir = dir => {

	return new Promise(resolve => {

		dir.open = !dir.open;

		vm.selected = dir.path;

		if (!dir.children) {

			$.get('/nav?path=' + dir.path, data => {

				dir.children = data;

				resolve(vm);

			});

		} else {

			resolve(vm);

		}

	});

};

vm.clickFile = file => {

	fileManager.open(file);

};

function listen(path, open) {

	return new Promise(resolve => {

		if (open) {

			vm.open[path] = path;

			vm.active = path;

		} else {

			delete vm.open[path];

		}

		resolve(vm);

	});

}

export default {

	init: () => {

		return new Promise(resolve => {

			$.get('/nav', data => {

				vm.dir = data;

				resolve(vm);

			});

		});

	},

	listen: listen

};