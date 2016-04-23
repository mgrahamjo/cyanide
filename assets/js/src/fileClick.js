import { $ } from './$';
import { openFile } from './openFile';

export function fileClick(e) {

	e.stopImmediatePropagation();

	openFile($(e.target).data('path'));

};