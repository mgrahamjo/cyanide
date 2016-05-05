import { compile } from './compile';

window.component = {};

window.handlers = {};

export function module(modules) {

	[...document.querySelectorAll('[data-component]')].forEach(el => {

		let componentName = el.getAttribute('data-component'),

			component = modules[componentName],

			events = el.getAttribute('data-events');
		
		compile( el.getAttribute('data-template') ).then(render => {

			function resolve(data, target = el) {

				let index = 0;

				window.handlers[componentName] = [];

				data.on = (event, handler, ...args) => {

					let eventString;

					window.handlers[componentName][index] = e => {

						args.push(e);

						handler.apply(data, args);

						resolve(data);

					};

					eventString = `on${event}="handlers.${componentName}[${index}]()"`;

					index++;

					return eventString;

				}

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

				component.reinitialize = () => {

					component.init( resolve );

				};

				component.reinitialize();

			}

		});

	});

};