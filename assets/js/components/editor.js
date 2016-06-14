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

		vm.text = text;

		vm.loading = false;

		vm.render();

		if (extension) {

			loadMode(extension).then(mode => {

				editor = CodeMirror(el => {
					let txt = document.querySelector('.text');
					txt.parentNode.replaceChild(el, txt);
				}, {
					theme: 'monokai',
				 	lineNumbers: true,
				 	mode: mode,
				 	keyMap: 'sublime',
				 	value: text,
				 	extraKeys: {
				 		'Cmd-S': save,
				 		'Ctrl-S': save
				 	}
				});

			});

		}



	}

	return {

		update: (path, opening) => {

			if (!opening) {

				showText('');

				delete openFiles[path];

				if (editor) {

					editor.setValue('');

				}

			} else {

				let extension = path.split('.');

				extension = extension[extension.length - 1];

				showText('');

				if (currentPath && editor) {

					openFiles[currentPath] = editor.getValue();

				}

				currentPath = path;

				if (openFiles[path]) {

					showText(openFiles[path], extension);

				} else {

					vm.loading = true;

					ajax.get('/open?file=' + path, data => {

						showText(data.data, extension);

					});

				}

			}

		}

	};

});
