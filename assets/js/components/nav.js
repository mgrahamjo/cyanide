import tabs from './tabs';
import text from './text';
import loader from '../src/loader';

function onEvent(render, el, newFile) {

	if (el) {

		let target,

			path = el.getAttribute('data-path');

		if (el.classList.contains('dir')) {

			if (!newFile) {

				if (document.querySelector('.dir.selected')) {

					document.querySelector('.dir.selected').classList.remove('selected');

				}

				el.classList.toggle('open');

				if (el.classList.contains('open')) {

					el.classList.add('selected');

				}

			}

			if (!el.nextElementSibling || !el.nextElementSibling.classList.contains('children')) {

				loader.after(el);

				$.get('/nav?dir=' + path, data => {

					loader.replace('<div class="children"/>');

					render(data, document.querySelector(`[data-path="${path}"] + .children`));

					if (newFile) {

						document.querySelector(`.file[data-path="${newFile}"]`).classList.add('open', 'active');

					}

				});

			}

		} else if (el.classList.contains('file')) {

			[...document.querySelectorAll('.file.active')].forEach(e => {
		
				e.classList.remove('active');

			});

			el.classList.add('active', 'open');

			text.notify('');

			loader.after('.overlay');

			$.get('/open?file=' + path, data => {

				text.notify(data.data);
				
			});

			tabs.notify(path, el.innerHTML);
		}

	}

}

let nav = {

	init: render => {

		$.get('/nav', data => {

			render(data);

		});

	},

	onEvent: onEvent,

	listen: onEvent

};

export default nav;