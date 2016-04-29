let i = 1,

	el = document.querySelector('.text'),
	
	numbers = document.querySelector('.numbers');

function resetHeight() {

	let height;

	el.style.height = '';

	numbers.style.height = '';

	height = el.scrollHeight;

	el.style.height = height + 'px';

	if (numbers.clientHeight < height) {

		while (numbers.clientHeight < height) {

			numbers.innerHTML += i + '<br>';

			i++;

		}

	} else {

		numbers.style.height = height + 'px';

	}

}

const text = {

	onEvent: resetHeight,

	listen: (render, data) => {

		el.value = data;

		resetHeight();

	}

};

export default text;