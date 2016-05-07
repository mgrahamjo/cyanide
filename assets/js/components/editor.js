import loader from '../src/loader';
import ajax from '../src/ajax';
import manila from 'mnla/client';

manila.component('editor', vm => {

	let numbers = document.querySelector('.numbers');

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

		vm.render();

	}

	return path => {

		loader.after('.overlay');

		if (path) {

			ajax.get('/open?file=' + path, data => {

				update(data.data);

				vm.resetHeight();

			});

		} else {

			update('');

			vm.resetHeight();

		}

	}

});
