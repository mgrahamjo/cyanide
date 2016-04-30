import nav from '../components/nav';

export function save() {

	let bg = document.querySelector('.background'),

		activeFile = document.querySelector('.file.active'),

		path;

	if (activeFile) {

		bg.classList.add('blur');

		path = activeFile.getAttribute('data-path');

		$.post(

			'/save?file=' + path,

			{
				data: document.querySelector('.text').value
			},

			result => {

				if (result.error) {

					alert(result.error);
				
					console.error(result.error);
				
				} else {

					if (activeFile.classList.contains('new')) {

						let selectedDir = document.querySelector('.dir.selected');

						activeFile.classList.remove('new');

						if (selectedDir) {

							selectedDir.nextElementSibling.outerHTML = '';

							nav.notify(selectedDir, path);

						} else {

							nav.reinitialize();
						}

					}

					bg.classList.remove('blur');

				}

			}
			
		);

	}

};