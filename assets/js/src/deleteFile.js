import text from '../components/text';
import nav from '../components/nav';

let bg = document.querySelector('.background');

export function deleteFile() {

	let file = document.querySelector('.file.active'),
		
		path = file.getAttribute('data-path');

	bg.classList.add('blur');

	file.outerHTML = '';

	file = null;

	text.notify('');

	nav.notify(document.querySelector('.file.open'));

	$.post(

		'/delete?file=' + path,

		result => {

			if (result.error) {

				alert(result.error);
			
				console.error(result.error);
			
			} else {

				bg.classList.remove('blur');

			}

		}
		
	);

};