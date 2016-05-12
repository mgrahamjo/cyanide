import fileManager from '../src/fileManager';
import ajax from '../src/ajax';
import manila from 'mnla/client';

manila.component('nav', vm => {

	vm.open = {};

	vm.clickDir = dir => {

		dir.open = !dir.open;

		vm.selected = dir.path;

		if (!dir.children) {

			ajax.get('/nav?path=' + dir.path, data => {

				dir.children = data.dir;

				vm.render();

			});

		}

	};

	vm.clickFile = file => {

		fileManager.open(file);

	};

	return (path, open) => {

		if (open) {

			vm.open[path] = path;

			vm.active = path;

		} else {

			delete vm.open[path];

		}

	};

});
