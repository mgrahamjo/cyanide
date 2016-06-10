import fileManager from '../src/fileManager';
import manila from 'mnla/client';
import { save } from '../src/save';

manila.component('tabs', vm => {

	vm.tabs = {};

	vm.close = path => {

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

	vm.save = save;

	return {

		update: (file, open) => {

			if (open) {

				vm.active = file.path;

				vm.tabs[file.path] = file.name;

			} else {

				delete vm.tabs[file.path];

			}

		}

	};

});
