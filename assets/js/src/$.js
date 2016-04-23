// Splits a string into an array on whitespace
function split(str) {
	return str ? str.replace(/\s+/, ' ').split(' ') : [];
}

// Adds classes to an element if they don't already exist
function addClass(el, classList) {

	let classes = split(el.className);

	classList.forEach(klass => {

		if (classes.indexOf(klass) === -1) {

			classes.push(klass);

		}

	});

	el.className = classes.join(' ');
}

// Removes classes from an element if they exist
function removeClass(el, classList) {

	let classes = split(el.className);

	classList.forEach(klass => {

		let i = classes.indexOf(klass);

		if (i !== -1) {

			classes.splice(i, 1);

		}

	});

	el.className = classes.join(' ');
}

// Accepts a CSS selector and returns an array of DOM nodes
const get = selector => {

	return selector ? [ ...document.querySelectorAll(selector) ] : [];

};


function $(selector) {

	let els = typeof selector === 'string' ? get(selector) : [selector],

		methods = {

			addClass: classList => {

				els.forEach(el => {

					addClass(el, split(classList));

				});

				return methods;

			},

			removeClass: classList => {

				els.forEach(el => {

					removeClass(el, split(classList));

				});

				return methods;

			},

			toggleClass: klass => {

				els.forEach(el => {

					el.classList.toggle(klass);

				});

			},

			hasClass: klass => {

				return els[0].classList.contains(klass);

			},

			html: content => {

				if (content !== undefined) {

					els.forEach(el => {

						el.innerHTML = content;

					});

				} else {

					return els[0].innerHTML;

				}

				return methods;

			},

			empty: () => {

				methods.html('');

				return methods;

			},

			val: val => {

				if (val !== undefined) {

					els.forEach(el => {

						el.value = val;

					});

				} else {

					return els[0].value;
					
				}

				return methods;

			},

			attr: (name, value) => {

				if (value) {

					els.forEach(el => {

						el.setAttribute(name, value);

					});

				} else {

					return els[0].getAttribute(name);

				}

				return methods;

			},

			trigger: events => {

				split(events).forEach(event => {

					event = new Event(event);

					els.forEach(el => {

						el.dispatchEvent(event);

					});

				});

			},

			on: (event, childSelector, fn) => {

				let delegate = typeof childSelector === 'string';

				if (delegate) {

					els.forEach(el => {

						split(event).forEach(e => {

							el.addEventListener(e, ev => {

								if (ev.target.matches(childSelector)) {

									fn(ev);

								}

							});

						});

					});

				} else {

					fn = childSelector;

					els.forEach(el => {

						split(event).forEach(e => {

							el.addEventListener(e, fn);

						});

					});

				}

				return methods;

			},

			off: (event, fn) => {

				if (fn) {

					els.forEach(el => {

						el.removeEventListener(event, fn);

					});

				}

				return methods;

			},

			height: px => {

				if (px === undefined) {

					return els[0].clientHeight;

				} else {

					if (typeof px !== 'string') {

						px += 'px';

					}

					els.forEach(el => {

						el.style.height = px;

					});

				}

				return methods;

			},

			scrollHeight: () => {

				return els[0].scrollHeight;

			},

			append: html => {

				els.forEach(el => {

					el.innerHTML += html;

				});

			},

			after: html => {

				els.forEach(el => {

					el.outerHTML += html;

				});

			},

			parent: parentSelector => {

				let parent = els[0].parentNode;

				if (parentSelector) {

					if (parent.matches(parentSelector)) {

						return $(parent);

					}

				} else {

					return $(parent);

				}

				return $('');

			},

			next: nextSelector => {

				let next = els[0].nextElementSibling || '';

				if (nextSelector && next) {

					if (next.matches(nextSelector)) {

						return $(next);

					}
				
				} else {

					return $(next);

				}

				return $('');

			},

			prev: prevSelector => {

				let prev = els[0].previousElementSibling;

				if (prevSelector) {

					if (prev.matches(prevSelector)) {

						return $(prev);

					}
				
				} else {

					return $(prev);

				}

				return $('');

			},

			is: selector => {

				return els[0].matches(selector);

			},

			data: key => {

				return methods.attr('data-' + key);

			},

			remove: () => {

				els.forEach(el => {

					el.outerHTML = '';

				});

			},

			first: () => {

				return $(els[0]);

			},

			last: () => {

				return $(els[els.length - 1] || '');

			},

			each: callback => {

				els.forEach(callback);

			},

			length: els.length

		};

	return methods;

}

function serialize(data) {

	let parts = [];

	Object.keys(data).forEach(key => {

	    parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));

	});

	return parts.join('&');

}

$.get = (path, data, callback) => {

	let req = new XMLHttpRequest();

	if (typeof data === 'function') {

		callback = data;

		data = {};

	}

	req.onreadystatechange = () => {

		if (req.readyState == 4 && req.status == 200) {

			let result;

			try {

				result = JSON.parse(req.responseText);

			} catch(err) {

				result = req.responseText;

			}

			callback(result);

		}

	};

	req.open('GET', path);

	req.send(serialize(data));

};

$.post = (path, data, callback) => {

	let req = new XMLHttpRequest();

	req.onreadystatechange = () => {

		if (req.readyState == 4 && req.status == 200) {

			let json = JSON.parse(req.responseText);

			if (json) {

				callback(json);

			} else {

				callback(req.responseText);

			}

		}

	};

	req.open('POST', path);

	req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

	req.send(serialize(data));

};

window.$ = $;

export { $ };
