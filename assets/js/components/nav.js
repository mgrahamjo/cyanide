import fileManager from '../src/fileManager';

let vm = {
	selected: '',
	active: '',
	open: {}
};

vm.clickDir = dir => {

	dir.open = !dir.open;

	vm.selected = dir.path;

	if (!dir.children) {

		return new Promise(resolve => {

			$.get('/nav?path=' + dir.path, data => {

				dir.children = data;

				resolve();

			});

		});

	}

};

vm.clickFile = file => {

	fileManager.open(file);

};

function listen(render, path, open) {

	if (open) {

		vm.open[path] = path;

		vm.active = path;

	} else {

		delete vm.open[path];

	}

	render(vm);

}

export default {

	init: render => {

		$.get('/nav', data => {

			vm.dir = data;

			render(vm);

		});

	},

	listen: listen

};