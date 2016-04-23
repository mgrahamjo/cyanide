import { save } from './save';
import { $ } from './$';

const keymap = {

		91: {
			callback: save,
			pair: 83 
		},

		83: {
			callback: save,
			pair: 91
		}

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

		}

	}

}


function keyup(e) {

	let code = e.keyCode || e.which;

	delete pressed[code];

}


export function addKeyboardShortcuts() {
	
	document.addEventListener('keydown', keydown);
	document.addEventListener('keyup', keyup);

};
