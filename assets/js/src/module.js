import { compile } from './compile';

window.manila.handlers = {};

function resolvePromise(resolve, promise) {

	if (promise && typeof promise.then === 'function') {

		promise.then(data => {

			resolve(data);
			
		});

	}

}

export function module(modules) {

	[...document.querySelectorAll('[data-component]')].forEach(el => {

		let componentName = el.getAttribute('data-component'),

			component = modules[componentName];
		
		compile( el.getAttribute('data-template') ).then(render => {

			function resolve(data = {}) {

				let index = 0;

				window.manila.handlers[componentName] = [];

				data.on = (event, handler, ...args) => {

					let eventString;

					window.manila.handlers[componentName][index] = e => {

						e.stopPropagation();
						
						args.push(e);

						resolvePromise(resolve, handler.apply(data, args));

					};

					eventString = `on${event}=manila.handlers.${componentName}[${index}](event)`;

					index++;

					return eventString;

				};

				let tagName = el.tagName.toLowerCase();

				if (tagName === 'input' || tagName === 'textarea') {
console.log(render.toString());
					el.value = render(data);

				} else {

					el.innerHTML = render(data);

				}

			}

			component.notify = (...args) => {

				if (typeof component.listen === 'function') {

					resolvePromise(resolve, component.listen.apply(component, [...args]))

				}

			};

			if (typeof component.init === 'function') {

				resolvePromise(resolve, component.init());

			}

		});

	});

};