import { $ } from './$';
import { manila } from './manila';

let renderNav;

$.get('/assets/templates/nav.mnla', template => {

	renderNav = manila(template);

	$.get('/nav', data => {

		$('nav').html(renderNav(data));

	});

});

export { renderNav };