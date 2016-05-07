import fileManager from '../src/fileManager';
import manila from 'mnla/client';

manila.component('tabs', vm => {

	vm.tabs = {};

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

	return (file, open) => {

		if (open) {

			vm.active = file.path;

			vm.tabs[file.path] = file.name;

		} else {

			delete vm.tabs[file.path];

		}

	}

});
