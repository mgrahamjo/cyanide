import loader from '../src/loader';
import ajax from '../src/ajax';
import manila from 'mnla/client';

function resetHeight(e) {

	let el = document.querySelector('.text'),

		numbers = document.querySelector('.numbers'),

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

}

manila.component('editor', vm => {

	vm.resetHeight = resetHeight;

	function showText(text) {

		vm.text = text;

		loader.hide();

		vm.render();

	}

	setTimeout(() => {
		resetHeight();
	});

	return {

		update: path => {

			loader.after('.overlay');

			if (path) {

				ajax.get('/open?file=' + path, data => {

					showText(data.data);

					vm.resetHeight();

				});

			} else {

				showText('');

				vm.resetHeight();

			}

		}

	};

});
