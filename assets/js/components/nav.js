import fileManager from '../src/fileManager';
import ajax from '../src/ajax';

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

			ajax.get('/nav?path=' + dir.path, data => {

				dir.children = data.dir;

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

			vm.dir = JSON.parse(window.manila.json).nav.dir;

			resolve(vm);

		});

	},

	listen: listen

};