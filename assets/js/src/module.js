import { compile } from './compile';

window.manila.handlers = {};

export function module(modules) {

	[...document.querySelectorAll('[data-component]')].forEach(el => {

		let componentName = el.getAttribute('data-component'),

			component = modules[componentName],

			events = el.getAttribute('data-events');
		
		compile( el.getAttribute('data-template') ).then(render => {

			function resolve(data = {}, target = el) {

				let index = 0;

				window.manila.handlers[componentName] = [];

				data.on = (event, handler, ...args) => {

					let eventString;

					window.manila.handlers[componentName][index] = e => {

						let promise;

						e.stopPropagation();
						
						args.push(e);

						promise = handler.apply(data, args);

						if (promise && typeof promise.then === 'function') {

							promise.then(() => {
								resolve(data);
							});

						} else {

							resolve(data);

						}

					};

					eventString = `on${event}=manila.handlers.${componentName}[${index}](event)`;

					index++;

					return eventString;

				};

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