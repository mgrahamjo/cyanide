import tabs from './tabs';
import text from './text';
import loader from '../src/loader';

let dirs = {},
	
	apply;

dirs.clickDir = dir => {

	console.log(dir);

	dir.open = !dir.open;

};

// function click(render, el) {

// 	if (el.classList.contains('dir')) {

// 		let path = el.getAttribute('data-path'),

// 			paths = path.split('/'),

// 			thisDir = dirs;

// 		while (paths.length > 0) {

// 			thisDir = thisDir[paths.shift()];

// 			thisDir.open = 'open';

// 		}

// 		thisDir.selected = 'selected';

// 		$.get('/nav?path=' + path, data => {

// 			thisDir.children = data;

// 			console.log(dirs);

// 			render(dirs);

// 		});

// 	}

// }

let nav = {

	init: render => {

		apply = render;

		$.get('/nav', data => {

			dirs.dir = data;

			render(dirs);

		});

	},

	// click: click,

	// listen: click

};

export default nav;