import ajax from '../src/ajax';
import manila from 'mnla/client';
import { loadMode } from '../src/loadMode';
import { save } from '../src/save';

manila.component('editor', vm => {

	let openFiles = {},
		editor,
		currentPath;

	vm.loading = false;

	function showText(text, extension) {

		vm.loading = false;

		vm.render();

		loadMode(extension).then(mode => {

			if (editor) {

				editor.setOption('mode', mode);

				editor.setValue(text);

			} else {

				editor = CodeMirror.fromTextArea(document.querySelector('.text'), {
					theme: 'monokai',
				 	lineNumbers: true,
				 	mode: mode,
				 	keyMap: 'sublime',
				 	matchBrackets: true,
				 	autoCloseBrackets: true,
				 	matchTags: true,
				 	extraKeys: {
				 		'Cmd-S': save,
				 		'Ctrl-S': save
				 	}
				});

				editor.setValue(text);

			}

		});

	}

	return {

		update: (path, opening) => {

			if (!opening) {

				if (openFiles[path].clean || confirm(`Discard usaved changes to ${path}?`)) {

					showText('');

					delete openFiles[path];

					// return true to pass confirmation to other components via fileManager
					return true;

				}

			} else {

				let extension = path.split('.');

				extension = extension[extension.length - 1];

				if (currentPath) {

					openFiles[currentPath] = {
						value: editor.getValue(),
						clean: editor.isClean()
					};

				}

				currentPath = path;

				if (openFiles[path]) {

					showText(openFiles[path].value, extension);

				} else {

					showText('');

					vm.loading = true;

					ajax.get('/open?file=' + path, data => {

						showText(data.data, extension);

						openFiles[currentPath] = {
							value: data.data,
							clean: true
						};

					});

				}

			}

		}

	};

});
