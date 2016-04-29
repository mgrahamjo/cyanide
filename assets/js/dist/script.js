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

},{"./components/nav":2,"./components/tabs":3,"./components/text":4,"./src/addKeyboardShortcuts":5,"./src/module":10}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _tabs = require('./tabs');

var _tabs2 = _interopRequireDefault(_tabs);

var _text = require('./text');

var _text2 = _interopRequireDefault(_text);

var _loader = require('../src/loader');

var _loader2 = _interopRequireDefault(_loader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function onEvent(render, el, newFile) {

	if (el) {
		(function () {

			var target = void 0,
			    path = el.getAttribute('data-path');

			if (el.classList.contains('dir')) {

				if (!newFile) {

					if (document.querySelector('.dir.selected')) {

						document.querySelector('.dir.selected').classList.remove('selected');
					}

					el.classList.toggle('open');

					if (el.classList.contains('open')) {

						el.classList.add('selected');
					}
				}

				if (!el.nextElementSibling || !el.nextElementSibling.classList.contains('children')) {

					_loader2.default.after(el);

					$.get('/nav?dir=' + path, function (data) {

						_loader2.default.replace('<div class="children"/>');

						render(data, document.querySelector('[data-path="' + path + '"] + .children'));

						if (newFile) {

							document.querySelector('.file[data-path="' + newFile + '"]').classList.add('open', 'active');
						}
					});
				}
			} else if (el.classList.contains('file')) {

				[].concat(_toConsumableArray(document.querySelectorAll('.file.active'))).forEach(function (e) {

					e.classList.remove('active');
				});

				el.classList.add('active', 'open');

				_text2.default.notify('');

				_loader2.default.after('.overlay');

				$.get('/open?file=' + path, function (data) {

					_text2.default.notify(data.data);
				});

				_tabs2.default.notify(path, el.innerHTML);
			}
		})();
	}
}

var nav = {

	init: function init(render) {

		$.get('/nav', function (data) {

			render(data);
		});
	},

	onEvent: onEvent,

	listen: onEvent

};

exports.default = nav;

},{"../src/loader":8,"./tabs":3,"./text":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _text = require('./text');

var _text2 = _interopRequireDefault(_text);

var _nav = require('./nav');

var _nav2 = _interopRequireDefault(_nav);

var _save = require('../src/save');

var _deleteFile = require('../src/deleteFile');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var tabList = [];

var tabs = {

	onEvent: function onEvent(render, el) {

		if (el.classList.contains('close')) {
			(function () {

				var path = el.parentNode.getAttribute('data-path');

				[].concat(_toConsumableArray(document.querySelectorAll('.file[data-path="' + path + '"]'))).forEach(function (elem) {

					elem.classList.remove('open', 'active');
				});

				tabList = tabList.filter(function (tab) {

					return tab.path !== path;
				});

				_text2.default.notify('');

				_nav2.default.notify(document.querySelector('.file.active') || document.querySelector('.file.open'));

				render({ tabs: tabList });
			})();
		} else if (el.classList.contains('save')) {

			(0, _save.save)();
		} else if (el.classList.contains('new-file')) {

			var activeDir = document.querySelector('.dir.selected'),
			    parentPath = activeDir ? activeDir.getAttribute('data-path') : '',
			    fileName = prompt('New file name:');

			if (fileName) {

				_text2.default.notify('');

				[].concat(_toConsumableArray(document.querySelectorAll('.file.active'))).forEach(function (elem) {

					elem.classList.remove('active');
				});

				tabs.notify(parentPath + '/' + fileName, fileName, true);
			}
		} else if (el.classList.contains('delete')) {

			(0, _deleteFile.deleteFile)();

			tabList = tabList.filter(function (tab) {

				return tab.class.indexOf('active') === -1;
			});

			tabs.notify();
		} else {

			_nav2.default.notify(el);
		}
	},

	listen: function listen(render, path, name, isNew) {

		var tabAlreadyOpen = void 0;

		if (path && name) {

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
					class: isNew ? 'active new' : 'active'
				});
			}
		}

		render({ tabs: tabList });
	}

};

exports.default = tabs;

},{"../src/deleteFile":7,"../src/save":11,"./nav":2,"./text":4}],4:[function(require,module,exports){
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

var text = {

	onEvent: resetHeight,

	listen: function listen(render, data) {

		_loader2.default.hide();

		el.value = data;

		resetHeight();
	}

};

exports.default = text;

},{"../src/loader":8}],5:[function(require,module,exports){
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

},{"./save":11}],6:[function(require,module,exports){
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

				var template = $(pathOrSelector);

				cache[pathOrSelector] = (0, _manila.manila)(template.html());

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

},{"./manila":9}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.deleteFile = deleteFile;

var _text = require('../components/text');

var _text2 = _interopRequireDefault(_text);

var _nav = require('../components/nav');

var _nav2 = _interopRequireDefault(_nav);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bg = document.querySelector('.background');

function deleteFile() {

	var file = document.querySelector('.file.active'),
	    path = file.getAttribute('data-path');

	bg.classList.add('blur');

	file.outerHTML = '';

	file = null;

	_text2.default.notify('');

	_nav2.default.notify(document.querySelector('.file.open'));

	$.post('/delete?file=' + path, function (result) {

		if (result.error) {

			alert(result.error);

			console.error(result.error);
		} else {

			bg.classList.remove('blur');
		}
	});
};

},{"../components/nav":2,"../components/text":4}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.module = undefined;

var _compile = require('./compile');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _module(modules) {

	[].concat(_toConsumableArray(document.querySelectorAll('[data-component]'))).forEach(function (el) {

		var component = modules[el.getAttribute('data-component')],
		    events = el.getAttribute('data-events');

		(0, _compile.compile)(el.getAttribute('data-template')).then(function (render) {

			function resolve(data) {
				var target = arguments.length <= 1 || arguments[1] === undefined ? el : arguments[1];


				target.innerHTML = render(data);
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
				// this only supports one event right now
				el.addEventListener(events, function (e) {

					e.stopPropagation();

					component.onEvent(resolve, e.target);
				});
			}

			if (component.init) {

				component.init(resolve);
			}
		});
	});
}exports.module = _module;
;

},{"./compile":6}],11:[function(require,module,exports){
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

					selectedDir.nextElementSibling.outerHTML = '';

					_nav2.default.notify(selectedDir, path);
				}

				bg.classList.remove('blur');
			}
		});
	}
};

},{"../components/nav":2}]},{},[1]);
