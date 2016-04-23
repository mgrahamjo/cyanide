import { $ } from './$';

export function save() {

	$('.background').addClass('blur');

	$.post(

		'/save?file=' + $('.file.active').data('path'),

		{
			data: $('.text').val(),
			token: window.token
		},

		result => {

			if (result.data !== undefined) {

				window.token = result.data.token;
			
				$('.background').removeClass('blur');
			
			} else {

				console.error(result);

			}

		}
		
	);

};