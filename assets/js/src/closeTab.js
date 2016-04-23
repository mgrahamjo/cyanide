import { $ } from './$';
import {openFile} from './openFile';
import {addLineNumbers} from './addLineNumbers';

export function closeTab(e) {

	let $tab = $(e.target).parent(),
		path = $tab.data('path'),
		$nav = $(`.file[data-path="${path}"]`);

	e.stopImmediatePropagation();

	$tab.remove();

	$nav.removeClass('open active');

	if ($('.tab').length) {

		openFile($('.tab').last().data('path'));
	
	} else {

		$('.text').val('');

		addLineNumbers();

	}

};
