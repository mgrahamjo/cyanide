import { compile } from './compile';

export function module(modules) {

	[ ...document.querySelectorAll('[data-component]')].forEach(el => {

		let component = modules[el.getAttribute('data-component')],

			events = el.getAttribute('data-events');
		
		compile( el.getAttribute('data-template') ).then(render => {

			function resolve(data, target = el) {

				target.innerHTML = render(data);

			}

			component.notify = (...args) => {

				if (component.listen) {

					component.listen.apply(component, [resolve, ...args]);

				}

			};

			if (events) {
				// this only supports one event right now
				el.addEventListener(events, e => {

					e.stopPropagation();
					
					component.onEvent( resolve, e.target );

				});

			}

			if (component.init) {

				component.init( resolve );

			}

		});

	});

};