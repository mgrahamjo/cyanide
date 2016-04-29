import { manila } from './manila';

let cache = {};

export function compile(pathOrSelector) {

	return new Promise(resolve => {

		if (!pathOrSelector) {

			resolve( ()=>{} );

		} else {

			if (cache[pathOrSelector]) {

				resolve(cache[pathOrSelector]);

			}

			try {

				let template = $(pathOrSelector);

				cache[pathOrSelector] = manila(template.html());

				resolve(cache[pathOrSelector]);

			} catch(err) {
		
				$.get(pathOrSelector, template => {

					cache[pathOrSelector] = manila(template);

					resolve(cache[pathOrSelector]);

				});

			}

		}

	});

};