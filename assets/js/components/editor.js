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

	}

	numbers.style.height = height + 'px';

	el.style.height = height + 'px';

}

manila.component('editor', vm => {

	vm.resetHeight = resetHeight;

	vm.loading = false;

	function showText(text) {

		vm.text = text;

		vm.loading = false;

		vm.render();

	}

	setTimeout(resetHeight);

	return {

		update: path => {

			showText('');

			if (path) {

				vm.loading = true;

				vm.disabled = false;

				ajax.get('/open?file=' + path, data => {

					showText(data.data);

					vm.resetHeight();

				});

			} else {

				vm.disabled = true;

				showText('');

				vm.resetHeight();

			}

		}

	};

});
