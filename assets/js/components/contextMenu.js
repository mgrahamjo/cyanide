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

		vm.render();

		if (confirm(`Permanently delete ${current.path}?`)) {

			ajax.post(

				'/delete?path=' + current.path,

				result => {

					if (result.error) {

						alert(result.error);
					
						console.error(result.error);
					
					} else {

						current.deleted = true;

						manila.components.nav.render();

						if (vm.file) {

							fileManager.close(current);

						}

					}

				}
				
			);

		}

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

					let newFile = {
						name: name,
						path: result.data
					};

					current.children = current.children || { files:[] };

					current.children.files.push(newFile);

					fileManager.open(newFile);

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

	vm.refresh = () => {

		vm.visible = false;

		vm.render();

		ajax.get('/nav?path=' + current.path, result => {

			if (result.error) {

				alert(result.error);

				console.error(result.error);

			} else {

				current.children = result.dir;

				manila.components.nav.render();

			}

		})

	};

	return {

		rightClickDir: (dir, e) => {

			vm.file = false;

			vm.parent = dir.parent;

			open(dir, e);

		},

		rightClickFile: (file, e) => {

			vm.file = true;

			vm.parent = false;

			open(file, e)

		}

	}

});
