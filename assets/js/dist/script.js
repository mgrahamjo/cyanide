(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _module2 = require('./src/module');

var _addKeyboardShortcuts = require('./src/addKeyboardShortcuts');

var _nav = require('./components/nav');

var _nav2 = _interopRequireDefault(_nav);

var _editor = require('./components/editor');

var _editor2 = _interopRequireDefault(_editor);

var _tabs = require('./components/tabs');

var _tabs2 = _interopRequireDefault(_tabs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _module2.module)({

	nav: _nav2.default,
	editor: _editor2.default,
	tabs: _tabs2.default

});

(0, _addKeyboardShortcuts.addKeyboardShortcuts)();

},{"./components/editor":2,"./components/nav":3,"./components/tabs":4,"./src/addKeyboardShortcuts":5,"./src/module":9}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _loader = require('../src/loader');

var _loader2 = _interopRequireDefault(_loader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var i = 1,
    el = document.querySelector('.text'),
    numbers = document.querySelector('.numbers');

function resetHeight() {

	var height = void 0;

	el.style.height = '';

	height = el.scrollHeight;

	numbers.style.height = '';

	if (numbers.clientHeight < height) {

		while (numbers.clientHeight < height) {

			numbers.innerHTML += i + '<br>';

			i++;
		}
	} else {

		numbers.style.height = height + 'px';
	}

	el.style.height = height + 'px';
}

function listen(render, file) {

	_loader2.default.after('.overlay');

	$.get('/open?file=' + file, function (data) {

		el.value = data.data;

		resetHeight();

		_loader2.default.hide();
	});
}

exports.default = {

	onEvent: resetHeight,

	listen: listen

};

},{"../src/loader":7}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _tabs = require('./tabs');

var _tabs2 = _interopRequireDefault(_tabs);

var _editor = require('./editor');

var _editor2 = _interopRequireDefault(_editor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vm = {
	selected: '',
	active: ''
};

vm.clickDir = function (dir) {

	dir.open = !dir.open;

	vm.selected = dir.path;

	if (!dir.children) {

		return new Promise(function (resolve) {

			$.get('/nav?path=' + dir.path, function (vm) {

				dir.children = vm;

				resolve();
			});
		});
	}
};

vm.clickFile = function (file) {

	file.open = true;

	vm.active = file.path;

	_editor2.default.notify(file.path);
};

exports.default = {

	init: function init(render) {

		$.get('/nav', function (data) {

			vm.dir = data;

			render(vm);
		});
	}

};

},{"./editor":2,"./tabs":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var vm = {

	tabs: []

};

exports.default = {

	init: function init(render) {

		render(vm);
	}

};

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.addKeyboardShortcuts = addKeyboardShortcuts;

var _save = require('./save');

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

			delete pressed[code];
			delete pressed[key.pair];
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

},{"./save":10}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.compile = compile;

var _manila = require('./manila');

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

				cache[pathOrSelector] = (0, _manila.manila)(document.querySelector(pathOrSelector).innerHTML);

				resolve(cache[pathOrSelector]);
			} catch (err) {

				$.get(pathOrSelector, function (template) {

					cache[pathOrSelector] = (0, _manila.manila)(template);

					resolve(cache[pathOrSelector]);
				});
			}
		}
	});
};

},{"./manila":8}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var loader = document.querySelector('#loader-template').innerHTML;

function fadeIn() {

	window.requestAnimationFrame(function () {

		document.querySelector('.loader').classList.add('visible');
	});
}

function replace(html) {

	document.querySelector('.loader').outerHTML = html;
}

function after(el) {

	if (typeof el === 'string') {

		el = document.querySelector(el);
	}

	el.outerHTML += loader;

	fadeIn();
}

function hide() {

	var el = document.querySelector('.loader');

	if (el) {

		el.classList.remove('visible');

		setTimeout(function () {

			el.parentNode.removeChild(el);
		}, 600);
	}
}

exports.default = {

	replace: replace,
	after: after,
	hide: hide

};

},{}],8:[function(require,module,exports){
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

    return new Function('context', "var p=[];with(context){p.push(`" + template.replace(/\\'/g, "\\\\'").replace(/`/g, "\\`").replace(/\<--(?!\s*}.*?-->)(?!.*{\s*-->)(.*?)-->/g, "`,$1,`").replace(/\<--\s*(.*?)\s*-->/g, "`);$1\np.push(`").replace(/\<-(?!\s*}.*?->)(?!.*{\s*->)(.*?)->/g, "`,manila.e($1),`").replace(/\<-\s*(.*?)\s*->/g, "`);$1\np.push(`") + "`);}return p.join('');");
}

function esc(str) {

    return str.replace(/[&<>'"]/g, function (c) {

        return escapeMap[c];
    });
}

function e(val) {

    return typeof val === 'string' ? esc(val) : val;
}

manila.e = e;

window.manila = manila;

exports.manila = manila;

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.module = undefined;

var _compile = require('./compile');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

window.manila.handlers = {};

function _module(modules) {

	[].concat(_toConsumableArray(document.querySelectorAll('[data-component]'))).forEach(function (el) {

		var componentName = el.getAttribute('data-component'),
		    component = modules[componentName],
		    events = el.getAttribute('data-events');

		(0, _compile.compile)(el.getAttribute('data-template')).then(function (render) {

			function resolve() {
				var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
				var target = arguments.length <= 1 || arguments[1] === undefined ? el : arguments[1];


				var index = 0;

				window.manila.handlers[componentName] = [];

				data.on = function (event, handler) {
					for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
						args[_key - 2] = arguments[_key];
					}

					var eventString = void 0;

					window.manila.handlers[componentName][index] = function (e) {

						var promise = void 0;

						e.stopPropagation();

						args.push(e);

						promise = handler.apply(data, args);

						if (promise && typeof promise.then === 'function') {

							promise.then(function () {
								resolve(data);
							});
						} else {

							resolve(data);
						}
					};

					eventString = 'on' + event + '=manila.handlers.' + componentName + '[' + index + '](event)';

					index++;

					return eventString;
				};

				target.innerHTML = render(data);
			}

			component.notify = function () {
				for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
					args[_key2] = arguments[_key2];
				}

				if (component.listen) {

					component.listen.apply(component, [resolve].concat(args));
				}
			};

			if (events) {
				// this only supports one event right now
				el.addEventListener(events, function (e) {

					e.stopPropagation();

					component.onEvent(resolve, e.target);
				});
			}

			if (component.init) {

				component.reinitialize = function () {

					component.init(resolve);
				};

				component.reinitialize();
			}
		});
	});
}exports.module = _module;
;

},{"./compile":6}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.save = save;

var _nav = require('../components/nav');

var _nav2 = _interopRequireDefault(_nav);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function save() {

	var bg = document.querySelector('.background'),
	    activeFile = document.querySelector('.file.active'),
	    path = void 0;

	if (activeFile) {

		bg.classList.add('blur');

		path = activeFile.getAttribute('data-path');

		$.post('/save?file=' + path, {
			data: document.querySelector('.text').value
		}, function (result) {

			if (result.error) {

				alert(result.error);

				console.error(result.error);
			} else {

				if (activeFile.classList.contains('new')) {

					var selectedDir = document.querySelector('.dir.selected');

					activeFile.classList.remove('new');

					if (selectedDir) {

						selectedDir.nextElementSibling.outerHTML = '';

						_nav2.default.notify(selectedDir, path);
					} else {

						_nav2.default.reinitialize();
					}
				}

				bg.classList.remove('blur');
			}
		});
	}
};

},{"../components/nav":3}]},{},[1]);
