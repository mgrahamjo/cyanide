import { $ } from '../src/$';

let i = 1,

	el = $('.text'),
	
	numbers = $('.numbers');

function resetHeight() {

	let height;

	el.height('');

	numbers.height('');

	height = el.scrollHeight();

	el.height(height);

	if (numbers.height() < height) {

		while (numbers.height() < height) {

			numbers.append(i + '<br>');

			i++;

		}

	} else {

		numbers.height(height);

	}

}

const text = {

	onEvent: resetHeight,

	listen: (render, data) => {

		el.val(data);

		resetHeight();

	}

};

export default text;