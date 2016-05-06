import tabs from './tabs';
import editor from './editor';

let vm = {
	selected: '',
	active: ''
};

vm.clickDir = dir => {

	dir.open = !dir.open;

	vm.selected = dir.path;

	if (!dir.children) {

		return new Promise(resolve => {

			$.get('/nav?path=' + dir.path, vm => {

				dir.children = vm;

				resolve();

			});

		});

	}

};

vm.clickFile = file => {

	file.open = true;

	vm.active = file.path;

	editor.notify(file.path);

};

export default {

	init: render => {

		$.get('/nav', data => {

			vm.dir = data;

			render(vm);

		});

	}

};