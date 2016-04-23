import { $ } from './$';

let i = 1,
	$numbers = $('.numbers'),
	$text = $('.text');

export function addLineNumbers() {

	let height;

	$text.height('');

	height = $text.scrollHeight();

	$text.height(height);

	$numbers.height('');

	if ($numbers.height() < height) {

		while ($numbers.height() < height) {

			$numbers.append(i + '<br>');

			i++;

		}

	} else {

		$numbers.height(height);

	}

};