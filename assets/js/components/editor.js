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

function update(data) {

	el.value = data;

	resetHeight();

	loader.hide();

}

function listen(render, path) {

	loader.after('.overlay');

	if (path) {

		$.get('/open?file=' + path, data => {

			update(data.data);

		});

	} else {

		update('');

	}

}

export default {

	onEvent: resetHeight,
	listen: listen

};