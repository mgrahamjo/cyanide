import { $ } from './$';
import { compile } from './compile';

export function module(modules) {

	$('[data-component]').each(el => {

		el = $(el);

		let component = modules[el.data('component')],

			events = el.data('events');
		
		compile( el.data('template') ).then(render => {

			function resolve(data, target = el) {

				target.html(render(data));

			}

			component.notify = (...args) => {

				if (component.listen) {

					component.listen.apply(component, [resolve, ...args]);

				}

			};

			if (events) {

				el.on(events, e => {
					
					component.onEvent( resolve, $(e.target), e );

				});

			}

			if (component.init) {

				component.init( resolve );

			}

		});

	});

};