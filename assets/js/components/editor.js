import loader from '../src/loader';

let numbers = document.querySelector('.numbers'),

	vm = {
		text: ''
	};

vm.resetHeight = e => {

	let el = document.querySelector('.text'),

		height;

	el.style.height = '';

	height = el.scrollHeight;

	numbers.style.height = '';

	if (numbers.clientHeight < height) {

		while (numbers.clientHeight < height) {

			numbers.innerHTML += '<div class="num"></div>';

		}

	} else {

		numbers.style.height = height + 'px';

	}

	el.style.height = height + 'px';

};

function update(text) {

	vm.text = text;

	loader.hide();

	return vm;

}

function listen(path) {

	return new Promise(resolve => {

		loader.after('.overlay');

		if (path) {

			$.get('/open?file=' + path, data => {

				resolve(update(data.data));

				vm.resetHeight();

			});

		} else {

			resolve(update(''));

			vm.resetHeight();

		}

	});

}

export default {

	init: () => {

		return new Promise(resolve => {

			resolve(vm);

		});

	},

	listen: listen

};