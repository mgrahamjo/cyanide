import { $ } from '../src/$';
import tabs from './tabs';
import text from './text';

function onEvent(render, el) {

	if (el.length) {

		let target,

			path = el.data('path');

		el.toggleClass('open');

		$('.file.active').removeClass('active');

		el.addClass('active');

		if (el.hasClass('dir') && el.next('.children').length === 0) {

			$.get('/nav?dir=' + path, data => {

				window.token = data.token;

				el.after('<div class="children"/>');

				render(data, $(`[data-path="${el.data('path')}"] + .children`));

			});

		} else if (el.hasClass('file')) {

			$.get('/open?file=' + path, data => {

				window.token = data.token;

				text.notify(data.data);
				
			});

			tabs.notify(path, el.html());
		}

	}

}

const nav = {

	init: render => {

		$.get('/nav', data => {

			window.token = data.token;

			render(data);

		});

	},

	onEvent: onEvent,

	listen: onEvent

};

export default nav;