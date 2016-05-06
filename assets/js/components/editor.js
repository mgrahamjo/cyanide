import loader from '../src/loader';

let i = 1,

	el = document.querySelector('.text'),
	
	numbers = document.querySelector('.numbers');

function resetHeight() {

	let height;

	el.style.height = '';

	height = el.scrollHeight;

	numbers.style.height = '';

	if (numbers.clientHeight < height) {

		while (numbers.clientHeight < height) {

			numbers.innerHTML += i + '<br>';

			i++;

		}

	} else {

		numbers.style.height = height + 'px';

	}

	el.style.height = height + 'px';

}

function listen(render, file) {

	loader.after('.overlay');

	$.get('/open?file=' + file, data => {

		el.value = data.data;

		resetHeight();

		loader.hide();

	});

}

export default {

	onEvent: resetHeight,

	listen: listen

};