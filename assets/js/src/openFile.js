import { $ } from './$';
import { addLineNumbers } from './addLineNumbers';

export function openFile(path) {

	let $nav = $(`.file[data-path="${path}"`);

	$('.text').empty();

	addLineNumbers();

	if (!$nav.is('.open')) {

		$('.tabs').append(`<div class="tab" data-path="${path}">${$nav.html()}<a class="close"/></a>`);

	}

	$.get('/open?file=' + path, result => {

		window.token = result.token;

		$('.text').val(result.data);

		addLineNumbers();

	});

	$('.tab.active, .file.active').removeClass('active');

	$(`.tab[data-path="${path}"`).addClass('active');

	$nav.addClass('open active');

};