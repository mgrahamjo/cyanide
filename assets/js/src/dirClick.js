import { $ } from './$';
import {renderNav} from './renderNav';

export function dirClick(e) {

	e.stopImmediatePropagation();

	let $dir = $(e.target);

	$dir.toggleClass('open');

	if ($dir.next('.children').length === 0) {

		$.get('/nav?dir=' + $dir.data('path'), data => {

			window.token = data.token;

			$dir.after(`<div class="children">${renderNav(data)}</div>`)

		});

	}

};