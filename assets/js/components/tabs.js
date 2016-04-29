import text from './text';
import nav from './nav';

let tabList = []

const tabs = {

	onEvent: (render, el) => {

		if (el.classList.contains('close')) {

			let path = el.parentNode.getAttribute('data-path');

			[...document.querySelectorAll(`.file[data-path="${path}"]`)].forEach(elem => {
				
				elem.classList.remove('open', 'active');

			});

			tabList = tabList.filter(tab => {

				return tab.path !== path;

			});

			text.notify('');

			nav.notify(document.querySelector('.file.open'));

			render({ tabs: tabList });

		} else {

			nav.notify(el);

		}

	},

	listen: (render, path, name) => {

		let tabAlreadyOpen;

		tabList.forEach(tab => {

			if (tab.path !== path) {

				tab.class = '';

			} else {

				tabAlreadyOpen = true;

				tab.class = 'active';

			}

		});

		if (!tabAlreadyOpen) {

			tabList.push({
				name: name,
				path: path,
				class: 'active'
			});

		}

		render({ tabs: tabList });

	}

};

export default tabs;