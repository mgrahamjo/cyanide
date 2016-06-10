import manila from 'mnla/client';
import ajax from '../src/ajax';

let bg = document.querySelector('.background')

export function save() {

	let file = manila.components.nav.getActiveFile();

	if (file) {

		let cm = document.querySelector('.CodeMirror').CodeMirror;

		bg.classList.add('blur');

		ajax.post(

			'/save?file=' + file,

			{
				data: cm.getValue()
			},

			result => {

				if (result.error) {

					alert(result.error);
				
					console.error(result.error);
				
				} else {

					bg.classList.remove('blur');

					cm.markClean();

				}

			}
			
		);

	}

};