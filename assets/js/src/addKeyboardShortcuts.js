import { save } from './save';

const keymap = {

		91: {
			callback: save,
			pair: 83 
		},

		83: {
			callback: save,
			pair: 91
		},

	};

let pressed = { };


function keydown(e) {

	let code = e.keyCode || e.which,

		key = keymap[code];

	if (key) {

		pressed[code] = true;

		if (pressed[key.pair]) {

			e.preventDefault();

			key.callback();

			delete pressed[code];
			delete pressed[key.pair];

		}

	}

}


function keyup(e) {

	delete pressed[e.keyCode || e.which];

}


document.addEventListener('keydown', keydown);
document.addEventListener('keyup', keyup);
