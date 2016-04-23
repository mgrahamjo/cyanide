(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _module2 = require('./src/module');

var _addKeyboardShortcuts = require('./src/addKeyboardShortcuts');

var _nav = require('./components/nav');

var _nav2 = _interopRequireDefault(_nav);

var _text = require('./components/text');

var _text2 = _interopRequireDefault(_text);

var _tabs = require('./components/tabs');

var _tabs2 = _interopRequireDefault(_tabs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _module2.module)({

	nav: _nav2.default,
	text: _text2.default,
	tabs: _tabs2.default

});

(0, _addKeyboardShortcuts.addKeyboardShortcuts)();

},{"./components/nav":2,"./components/tabs":3,"./components/text":4,"./src/addKeyboardShortcuts":6,"./src/module":9}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _$ = require('../src/$');

var _tabs = require('./tabs');

var _tabs2 = _interopRequireDefault(_tabs);

var _text = require('./text');

var _text2 = _interopRequireDefault(_text);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function onEvent(render, el) {

	if (el.length) {

		var target = void 0,
		    path = el.data('path');

		el.toggleClass('open');

		(0, _$.$)('.file.active').removeClass('active');

		el.addClass('active');

		if (el.hasClass('dir') && el.next('.children').length === 0) {

			_$.$.get('/nav?dir=' + path, function (data) {

				window.token = data.token;

				el.after('<div class="children"/>');

				render(data, (0, _$.$)('[data-path="' + el.data('path') + '"] + .children'));
			});
		} else if (el.hasClass('file')) {

			_$.$.get('/open?file=' + path, function (data) {

				window.token = data.token;

				_text2.default.notify(data.data);
			});

			_tabs2.default.notify(path, el.html());
		}
	}
}

var nav = {

	init: function init(render) {

		_$.$.get('/nav', function (data) {

			window.token = data.token;

			render(data);
		});
	},

	onEvent: onEvent,

	listen: onEvent

};

exports.default = nav;

},{"../src/$":5,"./tabs":3,"./text":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _$ = require('../src/$');

var _text = require('./text');

var _text2 = _interopRequireDefault(_text);

var _nav = require('./nav');

var _nav2 = _interopRequireDefault(_nav);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tabList = [];

var tabs = {

	onEvent: function onEvent(render, el) {

		if (el.is('.close')) {
			(function () {

				var path = el.parent().data('path');

				(0, _$.$)('.file[data-path="' + path + '"]').removeClass('open active');

				tabList = tabList.filter(function (tab) {

					return tab.path !== path;
				});

				_text2.default.notify('');

				_nav2.default.notify((0, _$.$)('.file.open').last());

				render({ tabs: tabList });
			})();
		} else {

			_nav2.default.notify(el);
		}
	},

	listen: function listen(render, path, name) {

		var tabAlreadyOpen = void 0;

		tabList.forEach(function (tab) {

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

exports.default = tabs;

},{"../src/$":5,"./nav":2,"./text":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _$ = require('../src/$');

var i = 1,
    el = (0, _$.$)('.text'),
    numbers = (0, _$.$)('.numbers');

function resetHeight() {

	var height = void 0;

	el.height('');

	numbers.height('');

	height = el.scrollHeight();

	el.height(height);

	if (numbers.height() < height) {

		while (numbers.height() < height) {

			numbers.append(i + '<br>');

			i++;
		}
	} else {

		numbers.height(height);
	}
}

var text = {

	onEvent: resetHeight,

	listen: function listen(render, data) {

		el.val(data);

		resetHeight();
	}

};

exports.default = text;

},{"../src/$":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Splits a string into an array on whitespace
function split(str) {
	return str ? str.replace(/\s+/, ' ').split(' ') : [];
}

// Adds classes to an element if they don't already exist
function _addClass(el, classList) {

	var classes = split(el.className);

	classList.forEach(function (klass) {

		if (classes.indexOf(klass) === -1) {

			classes.push(klass);
		}
	});

	el.className = classes.join(' ');
}

// Removes classes from an element if they exist
function _removeClass(el, classList) {

	var classes = split(el.className);

	classList.forEach(function (klass) {

		var i = classes.indexOf(klass);

		if (i !== -1) {

			classes.splice(i, 1);
		}
	});

	el.className = classes.join(' ');
}

// Accepts a CSS selector and returns an array of DOM nodes
var get = function get(selector) {

	return selector ? [].concat(_toConsumableArray(document.querySelectorAll(selector))) : [];
};

function $(selector) {

	var els = typeof selector === 'string' ? get(selector) : [selector],
	    methods = {

		addClass: function addClass(classList) {

			els.forEach(function (el) {

				_addClass(el, split(classList));
			});

			return methods;
		},

		removeClass: function removeClass(classList) {

			els.forEach(function (el) {

				_removeClass(el, split(classList));
			});

			return methods;
		},

		toggleClass: function toggleClass(klass) {

			els.forEach(function (el) {

				el.classList.toggle(klass);
			});
		},

		hasClass: function hasClass(klass) {

			return els[0].classList.contains(klass);
		},

		html: function html(content) {

			if (content !== undefined) {

				els.forEach(function (el) {

					el.innerHTML = content;
				});
			} else {

				return els[0].innerHTML;
			}

			return methods;
		},

		empty: function empty() {

			methods.html('');

			return methods;
		},

		val: function val(_val) {

			if (_val !== undefined) {

				els.forEach(function (el) {

					el.value = _val;
				});
			} else {

				return els[0].value;
			}

			return methods;
		},

		attr: function attr(name, value) {

			if (value) {

				els.forEach(function (el) {

					el.setAttribute(name, value);
				});
			} else {

				return els[0].getAttribute(name);
			}

			return methods;
		},

		trigger: function trigger(events) {

			split(events).forEach(function (event) {

				event = new Event(event);

				els.forEach(function (el) {

					el.dispatchEvent(event);
				});
			});
		},

		on: function on(event, childSelector, fn) {

			var delegate = typeof childSelector === 'string';

			if (delegate) {

				els.forEach(function (el) {

					split(event).forEach(function (e) {

						el.addEventListener(e, function (ev) {

							if (ev.target.matches(childSelector)) {

								fn(ev);
							}
						});
					});
				});
			} else {

				fn = childSelector;

				els.forEach(function (el) {

					split(event).forEach(function (e) {

						el.addEventListener(e, fn);
					});
				});
			}

			return methods;
		},

		off: function off(event, fn) {

			if (fn) {

				els.forEach(function (el) {

					el.removeEventListener(event, fn);
				});
			}

			return methods;
		},

		height: function height(px) {

			if (px === undefined) {

				return els[0].clientHeight;
			} else {

				if (typeof px !== 'string') {

					px += 'px';
				}

				els.forEach(function (el) {

					el.style.height = px;
				});
			}

			return methods;
		},

		scrollHeight: function scrollHeight() {

			return els[0].scrollHeight;
		},

		append: function append(html) {

			els.forEach(function (el) {

				el.innerHTML += html;
			});
		},

		after: function after(html) {

			els.forEach(function (el) {

				el.outerHTML += html;
			});
		},

		parent: function parent(parentSelector) {

			var parent = els[0].parentNode;

			if (parentSelector) {

				if (parent.matches(parentSelector)) {

					return $(parent);
				}
			} else {

				return $(parent);
			}

			return $('');
		},

		next: function next(nextSelector) {

			var next = els[0].nextElementSibling || '';

			if (nextSelector && next) {

				if (next.matches(nextSelector)) {

					return $(next);
				}
			} else {

				return $(next);
			}

			return $('');
		},

		prev: function prev(prevSelector) {

			var prev = els[0].previousElementSibling;

			if (prevSelector) {

				if (prev.matches(prevSelector)) {

					return $(prev);
				}
			} else {

				return $(prev);
			}

			return $('');
		},

		is: function is(selector) {

			return els[0].matches(selector);
		},

		data: function data(key) {

			return methods.attr('data-' + key);
		},

		remove: function remove() {

			els.forEach(function (el) {

				el.outerHTML = '';
			});
		},

		first: function first() {

			return $(els[0]);
		},

		last: function last() {

			return $(els[els.length - 1] || '');
		},

		each: function each(callback) {

			els.forEach(callback);
		},

		length: els.length

	};

	return methods;
}

function serialize(data) {

	var parts = [];

	Object.keys(data).forEach(function (key) {

		parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
	});

	return parts.join('&');
}

$.get = function (path, data, callback) {

	var req = new XMLHttpRequest();

	if (typeof data === 'function') {

		callback = data;

		data = {};
	}

	req.onreadystatechange = function () {

		if (req.readyState == 4 && req.status == 200) {

			var result = void 0;

			try {

				result = JSON.parse(req.responseText);
			} catch (err) {

				result = req.responseText;
			}

			callback(result);
		}
	};

	req.open('GET', path);

	req.send(serialize(data));
};

$.post = function (path, data, callback) {

	var req = new XMLHttpRequest();

	req.onreadystatechange = function () {

		if (req.readyState == 4 && req.status == 200) {

			var json = JSON.parse(req.responseText);

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

exports.$ = $;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.addKeyboardShortcuts = addKeyboardShortcuts;

var _save = require('./save');

var _$ = require('./$');

var keymap = {

	91: {
		callback: _save.save,
		pair: 83
	},

	83: {
		callback: _save.save,
		pair: 91
	}

};

var pressed = {};

function keydown(e) {

	var code = e.keyCode || e.which,
	    key = keymap[code];

	if (key) {

		pressed[code] = true;

		if (pressed[key.pair]) {

			e.preventDefault();

			key.callback();
		}
	}
}

function keyup(e) {

	delete pressed[e.keyCode || e.which];
}

function addKeyboardShortcuts() {

	document.addEventListener('keydown', keydown);
	document.addEventListener('keyup', keyup);
};

},{"./$":5,"./save":10}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.compile = compile;

var _manila = require('./manila');

var _$ = require('./$');

var cache = {};

function compile(pathOrSelector) {

	return new Promise(function (resolve) {

		if (!pathOrSelector) {

			resolve(function () {});
		} else {

			if (cache[pathOrSelector]) {

				resolve(cache[pathOrSelector]);
			}

			try {

				var template = (0, _$.$)(pathOrSelector);

				cache[pathOrSelector] = (0, _manila.manila)(template.html());

				resolve(cache[pathOrSelector]);
			} catch (err) {

				_$.$.get(pathOrSelector, function (template) {

					cache[pathOrSelector] = (0, _manila.manila)(template);

					resolve(cache[pathOrSelector]);
				});
			}
		}
	});
};

},{"./$":5,"./manila":8}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var escapeMap = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;'
};

function manila(template) {

    return new Function('context', "var p=[];with(context){p.push(`" + template.replace(/\\'/g, "\\\\'").replace(/`/g, "\\`").replace(/\<<<(?!\s*}.*?>>>)(?!.*{\s*>>>)(.*?)>>>/g, "`,(typeof $1==='undefined'?'':$1),`").replace(/\<<<\s*(.*?)\s*>>>/g, "`);$1\np.push(`").replace(/\<<(?!\s*}.*?>>)(?!.*{\s*>>)(.*?)>>/g, "`,(typeof $1==='undefined'?'':manila.e($1)),`").replace(/\<<\s*(.*?)\s*>>/g, "`);$1\np.push(`") + "`);}return p.join('');");
}

function esc(str) {

    return str.replace(/[&<>'"]/g, function (c) {

        return escapeMap[c];
    });
}

function e(val) {

    return typeof val === 'string' ? manila.esc(val) : val;
}

manila.esc = esc;

manila.e = e;

window.manila = manila;

exports.manila = manila;

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.module = undefined;

var _$ = require('./$');

var _compile = require('./compile');

function _module(modules) {

	(0, _$.$)('[data-component]').each(function (el) {

		el = (0, _$.$)(el);

		var component = modules[el.data('component')],
		    events = el.data('events');

		(0, _compile.compile)(el.data('template')).then(function (render) {

			function resolve(data) {
				var target = arguments.length <= 1 || arguments[1] === undefined ? el : arguments[1];


				target.html(render(data));
			}

			component.notify = function () {
				for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
					args[_key] = arguments[_key];
				}

				if (component.listen) {

					component.listen.apply(component, [resolve].concat(args));
				}
			};

			if (events) {

				el.on(events, function (e) {

					component.onEvent(resolve, (0, _$.$)(e.target), e);
				});
			}

			if (component.init) {

				component.init(resolve);
			}
		});
	});
}exports.module = _module;
;

},{"./$":5,"./compile":7}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.save = save;

var _$ = require('./$');

function save() {

	(0, _$.$)('.background').addClass('blur');

	_$.$.post('/save?file=' + (0, _$.$)('.file.active').data('path'), {
		data: (0, _$.$)('.text').val(),
		token: window.token
	}, function (result) {

		if (result.data !== undefined) {

			window.token = result.data.token;

			(0, _$.$)('.background').removeClass('blur');
		} else {

			console.error(result);
		}
	});
};

},{"./$":5}]},{},[1]);
