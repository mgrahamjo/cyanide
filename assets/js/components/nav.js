import tabs from './tabs';
import text from './text';

function onEvent(render, el) {

	if (el) {

		let target,

			path = el.getAttribute('data-path');

		el.classList.toggle('open');

		if ( el.classList.contains('dir') 
			 && (!el.nextElementSibling
			 || !el.nextElementSibling.classList.contains('children'))) {

			$.get('/nav?dir=' + path, data => {

				el.outerHTML += '<div class="children"/>'; 

				render(data, document.querySelector(`[data-path="${path}"] + .children`));

			});

		} else if (el.classList.contains('file')) {

			[...document.querySelectorAll('.file.active')].forEach(e => {
		
				e.classList.remove('active');

			});

			el.classList.add('active');

			$.get('/open?file=' + path, data => {

				text.notify(data.data);
				
			});

			tabs.notify(path, el.innerHTML);
		}

	}

}

const nav = {

	init: render => {

		$.get('/nav', data => {

			render(data);

		});

	},

	onEvent: onEvent,

	listen: onEvent

};

export default nav;