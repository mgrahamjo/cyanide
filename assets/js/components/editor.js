import ajax from '../src/ajax';
import manila from 'mnla/client';
import { loadMode } from '../src/loadMode';

manila.component('editor', vm => {

	let openFiles = {},
		editor,
		currentPath;

	vm.loading = false;

	function showText(text, extension) {

		vm.text = text;

		vm.loading = false;

		vm.render();

		if (text && extension) {

			loadMode(extension).then(mode => {

				editor = CodeMirror.fromTextArea(document.querySelector('.text'), {
					theme: 'monokai',
				 	lineNumbers: true,
				 	lineWrapping: true,
				 	scrollbarStyle: null,
				 	mode: mode
				});

			});

		}



	}

	return {

		update: path => {

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

		},

		close: path => {

			showText('');

			delete openFiles[path];

		}

	};

});
