import { $ } from '../src/$';
import text from './text';
import nav from './nav';

let tabList = []

const tabs = {

	onEvent: (render, el) => {

		if (el.is('.close')) {

			let path = el.parent().data('path');

			$(`.file[data-path="${path}"]`).removeClass('open active');

			tabList = tabList.filter(tab => {

				return tab.path !== path;

			});

			text.notify('');

			nav.notify($('.file.open').last());

			render({ tabs: tabList });

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