import text from './text';
import nav from './nav';
import { save } from '../src/save';
import { deleteFile } from '../src/deleteFile';

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

			nav.notify(document.querySelector('.file.active') || document.querySelector('.file.open'));

			render({ tabs: tabList });

		} else if (el.classList.contains('save')) {

			save();

		} else if (el.classList.contains('new-file')) {

			let activeDir = document.querySelector('.dir.selected'),

				parentPath = activeDir ? activeDir.getAttribute('data-path') : '',

				fileName = prompt('New file name:');

			if (fileName) {

				text.notify('');

				[...document.querySelectorAll(`.file.active`)].forEach(elem => {
					
					elem.classList.remove('active');

				});

				tabs.notify(parentPath + '/' + fileName, fileName, true);

			}

		} else if (el.classList.contains('delete')) {

			deleteFile();

			tabList = tabList.filter(tab => {

				return tab.class.indexOf('active') === -1;

			});

			tabs.notify();

		} else {

			nav.notify(el);

		}

	},

	listen: (render, path, name, isNew) => {

		let tabAlreadyOpen;

		if (path && name) {

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
					class: isNew ? 'active new' : 'active'
				});

			}

		}

		render({ tabs: tabList });

	}

};

export default tabs;