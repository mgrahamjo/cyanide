import fileManager from '../src/fileManager';
import ajax from '../src/ajax';
import manila from 'mnla/client';

manila.component('nav', vm => {

	let cache = vm.dir;

	vm.open = {};

	vm.clickDir = (dir, e) => {

		dir.open = !dir.open;

		if (!dir.children) {

			vm.loading = true;

			ajax.get('/nav?path=' + dir.path, data => {

				dir.children = data.dir;

				delete vm.loading;

				vm.render();

			});

		}

	};

	vm.clickFile = file => {

		fileManager.open(file);

	};

	vm.rightClickDir = (dir, e) => {
	
		manila.components.contextMenu.rightClickDir(dir, e);

	};

	vm.rightClickFile = (file, e) => {
	
		manila.components.contextMenu.rightClickFile(file, e);

	};

	return {

		update: (path, open) => {

			if (open) {

				vm.open[path] = path;

				vm.active = path;

			} else {

				delete vm.open[path];

				delete vm.active;

			}

		},

		getActiveFile: () => {

			return vm.active;

		},

		render: () => {

			vm.render();

		},

		showSearchResults: results => {

			vm.dir = results;

		},

		hideSearchResults: () => {

			vm.dir = cache;

		}

	};

});
