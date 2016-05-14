import manila from 'mnla/client';
import ajax from '../src/ajax';
import fileManager from '../src/fileManager';

let current;

manila.component('contextMenu', vm => {

	vm.file = true;

	function open(item, e) {

		e.preventDefault();

		current = item;

		vm.left = e.clientX;

		vm.top = e.clientY;

		vm.visible = true;

	}

	document.addEventListener('click', () => {

		if (vm.visible) {

			vm.visible = false;

			vm.render();

		}

	});

	vm.rename = () => {

		vm.visible = false;

		vm.render();

		let name = prompt('New name:');

		if (name) {

			ajax.post(

				'/rename?path=' + current.path,

				{
					name: name
				},

				result => {

					if (result.error) {

						alert(result.error);
					
						console.error(result.error);
					
					} else {

						vm.render();

						fileManager.close(current);

						current.name = name;

						current.path = result.data;

						fileManager.open(current);

					}

				}
				
			);

		}

	};

	vm.deletePath = () => {

		vm.visible = false;

		ajax.post(

			'/delete?path=' + current.path,

			result => {

				if (result.error) {

					alert(result.error);
				
					console.error(result.error);
				
				} else {

					if (vm.file) {

						fileManager.close(current);

					}

					current.deleted = true;

					manila.components.nav.render();

				}

			}
			
		);

	};

	vm.newFile = () => {

		vm.visible = false;

		vm.render();

		let name = prompt('File name:');

		ajax.post(

			'/new-file?path=' + current.path,

			{
				name: name
			},

			result => {

				if (result.error) {

					alert(result.error);
				
					console.error(result.error);
				
				} else {

					current.children = current.children || { files:[] };

					current.children.files.push({
						name: name,
						path: result.data
					});

					manila.components.nav.render();

				}

			}
			
		);

	};

	vm.newDir = () => {

		vm.visible = false;

		vm.render();

		let name = prompt('Folder name:');

		ajax.post(

			'/new-dir?path=' + current.path,

			{
				name: name
			},

			result => {

				if (result.error) {

					alert(result.error);
				
					console.error(result.error);
				
				} else {

					current.children = current.children || { dirs:[] };

					current.children.dirs.push({
						name: name,
						path: result.data
					});

					manila.components.nav.render();

				}

			}
			
		);

	};

	return {

		rightClickDir: (dir, e) => {

			vm.file = false;

			open(dir, e);

		},

		rightClickFile: (file, e) => {

			vm.file = true;

			open(file, e)

		}

	}

});
