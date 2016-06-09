let body = document.querySelector('body'),

	loadedModes = {
		xml: true,
		css: true,
		javascript: true,
		htmlmixed: true
	};

export function loadMode(extension) {

	return new Promise(resolve => {

		let mode = modes[extension] ? modes[extension].name || modes[extension] : 'shell';

		if (!loadedModes[mode]) {

			loadedModes[mode] = true;

			let script  = document.createElement('script');

			script.type = 'text/javascript';

			script.src  = `/assets/js/dist/${mode}.js`;

			script.onload = () => {

				resolve(mode);

			};

			body.appendChild(script);

		} else {

			resolve(mode);

		}

	});
};