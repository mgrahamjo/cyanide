import manila from 'mnla/client';
import ajax from '../src/ajax';

let bg = document.querySelector('.background')

export function save() {

	let file = manila.components.nav.getActiveFile();

	if (file) {

		bg.classList.add('blur');

		ajax.post(

			'/save?file=' + file,

			{
				data: document.querySelector('.CodeMirror').CodeMirror.getValue()
			},

			result => {

				if (result.error) {

					alert(result.error);
				
					console.error(result.error);
				
				} else {

					bg.classList.remove('blur');

				}

			}
			
		);

	}

};