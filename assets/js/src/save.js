export function save() {

	let bg = document.querySelector('.background');

	bg.classList.add('blur');

	$.post(

		'/save?file=' + document.querySelector('.file.active').getAttribute('data-path'),

		{
			data: document.querySelector('.text').value,
			token: window.token
		},

		result => {

			window.token = result.token;

			if (result.error) {
			
				console.error(result.error);
			
			} else {

				bg.classList.remove('blur');

			}

		}
		
	);

};