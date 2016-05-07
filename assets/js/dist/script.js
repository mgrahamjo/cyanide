(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _client = require('mnla/client');

var _client2 = _interopRequireDefault(_client);

var _addKeyboardShortcuts = require('./src/addKeyboardShortcuts');

var _nav = require('./components/nav');

var _nav2 = _interopRequireDefault(_nav);

var _editor = require('./components/editor');

var _editor2 = _interopRequireDefault(_editor);

var _tabs = require('./components/tabs');

var _tabs2 = _interopRequireDefault(_tabs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _addKeyboardShortcuts.addKeyboardShortcuts)();

},{"./components/editor":2,"./components/nav":3,"./components/tabs":4,"./src/addKeyboardShortcuts":5,"mnla/client":10}],2:[function(require,module,exports){
'use strict';

var _loader = require('../src/loader');

var _loader2 = _interopRequireDefault(_loader);

var _ajax = require('../src/ajax');

var _ajax2 = _interopRequireDefault(_ajax);

var _client = require('mnla/client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_client2.default.component('editor', function (vm) {

	var numbers = document.querySelector('.numbers');

	vm.resetHeight = function (e) {

		var el = document.querySelector('.text'),
		    height = void 0;

		el.style.height = '';

		height = el.scrollHeight;

		numbers.style.height = '';

		if (numbers.clientHeight < height) {

			while (numbers.clientHeight < height) {

				numbers.innerHTML += '<div class="num"></div>';
			}
		} else {

			numbers.style.height = height + 'px';
		}

		el.style.height = height + 'px';
	};

	function update(text) {

		vm.text = text;

		_loader2.default.hide();

		vm.render();
	}

	return function (path) {

		_loader2.default.after('.overlay');

		if (path) {

			_ajax2.default.get('/open?file=' + path, function (data) {

				update(data.data);

				vm.resetHeight();
			});
		} else {

			update('');

			vm.resetHeight();
		}
	};
});

},{"../src/ajax":6,"../src/loader":8,"mnla/client":10}],3:[function(require,module,exports){
'use strict';

var _fileManager = require('../src/fileManager');

var _fileManager2 = _interopRequireDefault(_fileManager);

var _ajax = require('../src/ajax');

var _ajax2 = _interopRequireDefault(_ajax);

var _client = require('mnla/client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_client2.default.component('nav', function (vm) {

	vm.open = {};

	vm.clickDir = function (dir) {

		dir.open = !dir.open;

		vm.selected = dir.path;

		if (!dir.children) {

			_ajax2.default.get('/nav?path=' + dir.path, function (data) {

				dir.children = data.dir;

				vm.render();
			});
		}
	};

	vm.clickFile = function (file) {

		_fileManager2.default.open(file);
	};

	return function (path, open) {

		if (open) {

			vm.open[path] = path;

			vm.active = path;
		} else {

			delete vm.open[path];
		}
	};
});

// let vm = {
// 	open: {}
// };

// vm.clickDir = dir => {

// 	return new Promise(resolve => {

// 		dir.open = !dir.open;

// 		vm.selected = dir.path;

// 		if (!dir.children) {

// 			ajax.get('/nav?path=' + dir.path, data => {

// 				dir.children = data.dir;

// 				resolve(vm);

// 			});

// 		} else {

// 			resolve(vm);

// 		}

// 	});

// };

// vm.clickFile = file => {

// 	fileManager.open(file);

// };

// function listen(path, open) {

// 	return new Promise(resolve => {

// 		if (open) {

// 			vm.open[path] = path;

// 			vm.active = path;

// 		} else {

// 			delete vm.open[path];

// 		}

// 		resolve(vm);

// 	});

// }

// export default {

// 	init: () => {

// 		return new Promise(resolve => {

// 			vm.dir = window.manila.data.nav.dir;

// 			resolve(vm);

// 		});

// 	},

// 	listen: listen

// };

},{"../src/ajax":6,"../src/fileManager":7,"mnla/client":10}],4:[function(require,module,exports){
'use strict';

var _fileManager = require('../src/fileManager');

var _fileManager2 = _interopRequireDefault(_fileManager);

var _client = require('mnla/client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_client2.default.component('tabs', function (vm) {

	vm.tabs = {};

	vm.close = function (path) {

		delete vm.tabs[path];

		_fileManager2.default.close({
			path: path,
			name: vm.tabs[path]
		});
	};

	vm.open = function (path) {

		_fileManager2.default.open({
			path: path,
			name: vm.tabs[path]
		});
	};

	return function (file, open) {

		if (open) {

			vm.active = file.path;

			vm.tabs[file.path] = file.name;
		} else {

			delete vm.tabs[file.path];
		}
	};
});

},{"../src/fileManager":7,"mnla/client":10}],5:[function(require,module,exports){
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

},{"./save":9}],6:[function(require,module,exports){
'use strict';

function serialize(data) {

  var parts = [];

  for (var key in data) {

    parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
  }

  return parts.join('&');
}

function get(path, data, callback) {

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
}

function post(path, data, callback) {

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
}

module.exports = {

  get: get,
  post: post

};

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _client = require('mnla/client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var openFiles = {};

function open(file) {

	_client2.default.notify('editor', file.path);

	_client2.default.notify('nav', file.path, true);

	_client2.default.notify('tabs', file, true);

	openFiles[file.path] = file;
}

function close(file) {

	var openList = void 0;

	_client2.default.notify('editor', '');

	_client2.default.notify('nav', file.path, false);

	_client2.default.notify('tabs', file, false);

	delete openFiles[file.path];

	openList = Object.keys(openFiles);

	if (openList.length) {

		open(openFiles[openList[openList.length - 1]]);
	}
}

// function open(file) {

// 	editor.notify(file.path);

// 	nav.notify(file.path, true);

// 	tabs.notify(file, true);

// 	openFiles[file.path] = file;

// }

// function close(file) {

// 	let openList;

// 	editor.notify('');

// 	nav.notify(file.path, false);

// 	tabs.notify(file, false);

// 	delete openFiles[file.path];

// 	openList = Object.keys(openFiles);

// 	if (openList.length) {

// 		open(openFiles[openList[openList.length - 1]]);

// 	}

// }

exports.default = {

	open: open,
	close: close

};

},{"mnla/client":10}],8:[function(require,module,exports){
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
exports.save = save;

var _nav = require('../components/nav');

var _nav2 = _interopRequireDefault(_nav);

var _ajax = require('../src/ajax');

var _ajax2 = _interopRequireDefault(_ajax);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function save() {

	var bg = document.querySelector('.background'),
	    activeFile = document.querySelector('.file.active'),
	    path = void 0;

	if (activeFile) {

		bg.classList.add('blur');

		path = activeFile.getAttribute('data-path');

		_ajax2.default.post('/save?file=' + path, {
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

},{"../components/nav":3,"../src/ajax":6}],10:[function(require,module,exports){
'use strict';

var compile = require('./compile');

window.manila = window.manila || {};

window.manila.handlers = {};

// function resolvePromise(resolve, promise) {

// 	if (promise && typeof promise.then === 'function') {

// 		promise.then(data => {

// 			resolve(data);

// 		});

// 	}

// }

// function component(modules) {

// 	[...document.querySelectorAll('[data-component]')].forEach(el => {

// 		let componentName = el.getAttribute('data-component'),

// 			component = modules[componentName];

// 		compile( el.getAttribute('data-template') ).then(render => {

// 			function resolve(data = {}) {

// 				let index = 0;

// 				window.manila.handlers[componentName] = [];

// 				data.on = (event, handler, ...args) => {

// 					let eventString;

// 					window.manila.handlers[componentName][index] = e => {

// 						e.stopPropagation();

// 						args.push(e);

// 						resolvePromise(resolve, handler.apply(data, args));

// 					};

// 					eventString = `on${event}=manila.handlers.${componentName}[${index}](event)`;

// 					index++;

// 					return eventString;

// 				};

// 				let tagName = el.tagName.toLowerCase();

// 				if (tagName === 'input' || tagName === 'textarea') {

// 					el.value = render(data);

// 				} else {

// 					el.innerHTML = render(data);

// 				}

// 			}

// 			component.notify = (...args) => {

// 				if (typeof component.listen === 'function') {

// 					resolvePromise(resolve, component.listen.apply(component, [...args]))

// 				}

// 			};

// 			if (typeof component.init === 'function') {

// 				resolvePromise(resolve, component.init());

// 			} else if (window.manila.json[componentName]) {

// 				resolve(JSON.parse(window.manila.json)[componentName]);

// 			}

// 		});

// 	});

// };

// TEST

var listeners = {};

function component(componentName, component) {

	var vm = window.manila.data[componentName] || {},
	    el = document.querySelector('.' + componentName + '-component');

	compile(el.getAttribute('data-template')).then(function (render) {

		function resolve(data) {

			var index = 0;

			window.manila.handlers[componentName] = [];

			data.on = function (event, handler) {
				for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
					args[_key - 2] = arguments[_key];
				}

				var eventString = void 0;

				window.manila.handlers[componentName][index] = function (e) {

					e.stopPropagation();

					args.push(e);

					handler.apply(data, args);

					resolve(data);
				};

				eventString = 'on' + event + '=manila.handlers.' + componentName + '[' + index + '](event)';

				index++;

				return eventString;
			};

			el.innerHTML = render(vm);
		}

		vm.render = function () {
			resolve(vm);
		};

		var listener = component(vm);

		listeners[componentName] = function () {
			for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				args[_key2] = arguments[_key2];
			}

			listener.apply(vm, args);

			resolve(vm);
		};

		resolve(vm);
	});
}

function notify(componentName) {
	for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
		args[_key3 - 1] = arguments[_key3];
	}

	listeners[componentName].apply(undefined, args);
}

window.manila.component = component;
window.manila.notify = notify;

module.exports = {
	component: component,
	notify: notify
};

},{"./compile":11}],11:[function(require,module,exports){
'use strict';

var manila = require('manila/parse');

var cache = {},
    escapeMap = {
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	'\'': '&apos;'
};

function htmlEscape(str) {

	return str.replace(/[&<>'"]/g, function (c) {

		return escapeMap[c];
	});
}

window.manila = window.manila || {};

window.manila.e = function (val) {

	return typeof val === 'string' ? htmlEscape(val) : val;
};

module.exports = function compile(selector) {

	return new Promise(function (resolve) {

		if (!selector) {

			resolve(function () {});
		} else {

			if (cache[selector]) {

				resolve(cache[selector]);
			}

			cache[selector] = manila(document.querySelector(selector).innerHTML);

			resolve(cache[selector]);
		}
	});
};

},{"manila/parse":12}],12:[function(require,module,exports){
'use strict';

module.exports = function (template) {

    return new Function('context', "var p=[];with(context){p.push(`" + template.replace(/\\'/g, "\\\\'").replace(/`/g, "\\`").replace(/<--(?!\s*}.*?-->)(?!.*{\s*-->)(.*?)-->/g, "`);try{p.push($1)}catch(e){}p.push(`").replace(/<--\s*(.*?)\s*-->/g, "`);$1\np.push(`").replace(/<-(?!\s*}.*?->)(?!.*{\s*->)(.*?)->/g, "`);try{p.push(manila.e($1))}catch(e){}p.push(`").replace(/<-\s*(.*?)\s*->/g, "`);$1\np.push(`") + "`);}return p.join('');");
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvYXBwLmpzIiwiYXNzZXRzL2pzL2NvbXBvbmVudHMvZWRpdG9yLmpzIiwiYXNzZXRzL2pzL2NvbXBvbmVudHMvbmF2LmpzIiwiYXNzZXRzL2pzL2NvbXBvbmVudHMvdGFicy5qcyIsImFzc2V0cy9qcy9zcmMvYWRkS2V5Ym9hcmRTaG9ydGN1dHMuanMiLCJhc3NldHMvanMvc3JjL2FqYXguanMiLCJhc3NldHMvanMvc3JjL2ZpbGVNYW5hZ2VyLmpzIiwiYXNzZXRzL2pzL3NyYy9sb2FkZXIuanMiLCJhc3NldHMvanMvc3JjL3NhdmUuanMiLCIuLi9tbmxhL2NsaWVudC5qcyIsIi4uL21ubGEvY29tcGlsZS5qcyIsIi4uL21ubGEvbm9kZV9tb2R1bGVzL21hbmlsYS9wYXJzZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBOzs7OztBQ05BOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsaUJBQU8sU0FBUCxDQUFpQixRQUFqQixFQUEyQixjQUFNOztBQUVoQyxLQUFJLFVBQVUsU0FBUyxhQUFULENBQXVCLFVBQXZCLENBQVYsQ0FGNEI7O0FBSWhDLElBQUcsV0FBSCxHQUFpQixhQUFLOztBQUVyQixNQUFJLEtBQUssU0FBUyxhQUFULENBQXVCLE9BQXZCLENBQUw7TUFFSCxlQUZELENBRnFCOztBQU1yQixLQUFHLEtBQUgsQ0FBUyxNQUFULEdBQWtCLEVBQWxCLENBTnFCOztBQVFyQixXQUFTLEdBQUcsWUFBSCxDQVJZOztBQVVyQixVQUFRLEtBQVIsQ0FBYyxNQUFkLEdBQXVCLEVBQXZCLENBVnFCOztBQVlyQixNQUFJLFFBQVEsWUFBUixHQUF1QixNQUF2QixFQUErQjs7QUFFbEMsVUFBTyxRQUFRLFlBQVIsR0FBdUIsTUFBdkIs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QVVBLHdCQVZBLENBRkosQ0FGZ0M7Q0FBbkIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IG1hbmlsYSBmcm9tICdtbmxhL2NsaWVudCc7XG5pbXBvcnQgeyBhZGRLZXlib2FyZFNob3J0Y3V0cyB9IGZyb20gJy4vc3JjL2FkZEtleWJvYXJkU2hvcnRjdXRzJztcbmltcG9ydCBuYXYgZnJvbSAnLi9jb21wb25lbnRzL25hdic7XG5pbXBvcnQgZWRpdG9yIGZyb20gJy4vY29tcG9uZW50cy9lZGl0b3InO1xuaW1wb3J0IHRhYnMgZnJvbSAnLi9jb21wb25lbnRzL3RhYnMnO1xuXG5hZGRLZXlib2FyZFNob3J0Y3V0cygpO1xuIiwiaW1wb3J0IGxvYWRlciBmcm9tICcuLi9zcmMvbG9hZGVyJztcbmltcG9ydCBhamF4IGZyb20gJy4uL3NyYy9hamF4JztcbmltcG9ydCBtYW5pbGEgZnJvbSAnbW5sYS9jbGllbnQnO1xuXG5tYW5pbGEuY29tcG9uZW50KCdlZGl0b3InLCB2bSA9PiB7XG5cblx0bGV0IG51bWJlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubnVtYmVycycpO1xuXG5cdHZtLnJlc2V0SGVpZ2h0ID0gZSA9PiB7XG5cblx0XHRsZXQgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGV4dCcpLFxuXG5cdFx0XHRoZWlnaHQ7XG5cblx0XHRlbC5zdHlsZS5oZWlnaHQgPSAnJztcblxuXHRcdGhlaWdodCA9IGVsLnNjcm9sbEhlaWdodDtcblxuXHRcdG51bWJlcnMuc3R5bGUuaGVpZ2h0ID0gJyc7XG5cblx0XHRpZiAobnVtYmVycy5jbGllbnRIZWlnaHQgPCBoZWlnaHQpIHtcblxuXHRcdFx0d2hpbGUgKG51bWJlcnMuY2xpZW50SGVpZ2h0IDwgaGVpZ2h0KSB7XG5cblx0XHRcdFx0bnVtYmVycy5pbm5lckhUTUwgKz0gJzxkaXYgY2xhc3M9XCJudW1cIj48L2Rpdj4nO1xuXG5cdFx0XHR9XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRudW1iZXJzLnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCc7XG5cblx0XHR9XG5cblx0XHRlbC5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuXG5cdH07XG5cblx0ZnVuY3Rpb24gdXBkYXRlKHRleHQpIHtcblxuXHRcdHZtLnRleHQgPSB0ZXh0O1xuXG5cdFx0bG9hZGVyLmhpZGUoKTtcblxuXHRcdHZtLnJlbmRlcigpO1xuXG5cdH1cblxuXHRyZXR1cm4gcGF0aCA9PiB7XG5cblx0XHRsb2FkZXIuYWZ0ZXIoJy5vdmVybGF5Jyk7XG5cblx0XHRpZiAocGF0aCkge1xuXG5cdFx0XHRhamF4LmdldCgnL29wZW4/ZmlsZT0nICsgcGF0aCwgZGF0YSA9PiB7XG5cblx0XHRcdFx0dXBkYXRlKGRhdGEuZGF0YSk7XG5cblx0XHRcdFx0dm0ucmVzZXRIZWlnaHQoKTtcblxuXHRcdFx0fSk7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHR1cGRhdGUoJycpO1xuXG5cdFx0XHR2bS5yZXNldEhlaWdodCgpO1xuXG5cdFx0fVxuXG5cdH1cblxufSk7XG4iLCJpbXBvcnQgZmlsZU1hbmFnZXIgZnJvbSAnLi4vc3JjL2ZpbGVNYW5hZ2VyJztcbmltcG9ydCBhamF4IGZyb20gJy4uL3NyYy9hamF4JztcbmltcG9ydCBtYW5pbGEgZnJvbSAnbW5sYS9jbGllbnQnO1xuXG5tYW5pbGEuY29tcG9uZW50KCduYXYnLCB2bSA9PiB7XG5cblx0dm0ub3BlbiA9IHt9O1xuXG5cdHZtLmNsaWNrRGlyID0gZGlyID0+IHtcblxuXHRcdGRpci5vcGVuID0gIWRpci5vcGVuO1xuXG5cdFx0dm0uc2VsZWN0ZWQgPSBkaXIucGF0aDtcblxuXHRcdGlmICghZGlyLmNoaWxkcmVuKSB7XG5cblx0XHRcdGFqYXguZ2V0KCcvbmF2P3BhdGg9JyArIGRpci5wYXRoLCBkYXRhID0+IHtcblxuXHRcdFx0XHRkaXIuY2hpbGRyZW4gPSBkYXRhLmRpcjtcblxuXHRcdFx0XHR2bS5yZW5kZXIoKTtcblxuXHRcdFx0fSk7XG5cblx0XHR9XG5cblx0fTtcblxuXHR2bS5jbGlja0ZpbGUgPSBmaWxlID0+IHtcblxuXHRcdGZpbGVNYW5hZ2VyLm9wZW4oZmlsZSk7XG5cblx0fTtcblxuXHRyZXR1cm4gKHBhdGgsIG9wZW4pID0+IHtcblxuXHRcdGlmIChvcGVuKSB7XG5cblx0XHRcdHZtLm9wZW5bcGF0aF0gPSBwYXRoO1xuXG5cdFx0XHR2bS5hY3RpdmUgPSBwYXRoO1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0ZGVsZXRlIHZtLm9wZW5bcGF0aF07XG5cblx0XHR9XG5cblx0fTtcblxufSk7XG5cbi8vIGxldCB2bSA9IHtcbi8vIFx0b3Blbjoge31cbi8vIH07XG5cbi8vIHZtLmNsaWNrRGlyID0gZGlyID0+IHtcblxuLy8gXHRyZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG5cbi8vIFx0XHRkaXIub3BlbiA9ICFkaXIub3BlbjtcblxuLy8gXHRcdHZtLnNlbGVjdGVkID0gZGlyLnBhdGg7XG5cbi8vIFx0XHRpZiAoIWRpci5jaGlsZHJlbikge1xuXG4vLyBcdFx0XHRhamF4LmdldCgnL25hdj9wYXRoPScgKyBkaXIucGF0aCwgZGF0YSA9PiB7XG5cbi8vIFx0XHRcdFx0ZGlyLmNoaWxkcmVuID0gZGF0YS5kaXI7XG5cbi8vIFx0XHRcdFx0cmVzb2x2ZSh2bSk7XG5cbi8vIFx0XHRcdH0pO1xuXG4vLyBcdFx0fSBlbHNlIHtcblxuLy8gXHRcdFx0cmVzb2x2ZSh2bSk7XG5cbi8vIFx0XHR9XG5cbi8vIFx0fSk7XG5cbi8vIH07XG5cbi8vIHZtLmNsaWNrRmlsZSA9IGZpbGUgPT4ge1xuXG4vLyBcdGZpbGVNYW5hZ2VyLm9wZW4oZmlsZSk7XG5cbi8vIH07XG5cbi8vIGZ1bmN0aW9uIGxpc3RlbihwYXRoLCBvcGVuKSB7XG5cbi8vIFx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuXG4vLyBcdFx0aWYgKG9wZW4pIHtcblxuLy8gXHRcdFx0dm0ub3BlbltwYXRoXSA9IHBhdGg7XG5cbi8vIFx0XHRcdHZtLmFjdGl2ZSA9IHBhdGg7XG5cbi8vIFx0XHR9IGVsc2Uge1xuXG4vLyBcdFx0XHRkZWxldGUgdm0ub3BlbltwYXRoXTtcblxuLy8gXHRcdH1cblxuLy8gXHRcdHJlc29sdmUodm0pO1xuXG4vLyBcdH0pO1xuXG4vLyB9XG5cbi8vIGV4cG9ydCBkZWZhdWx0IHtcblxuLy8gXHRpbml0OiAoKSA9PiB7XG5cbi8vIFx0XHRyZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG5cbi8vIFx0XHRcdHZtLmRpciA9IHdpbmRvdy5tYW5pbGEuZGF0YS5uYXYuZGlyO1xuXG4vLyBcdFx0XHRyZXNvbHZlKHZtKTtcblxuLy8gXHRcdH0pO1xuXG4vLyBcdH0sXG5cbi8vIFx0bGlzdGVuOiBsaXN0ZW5cblxuLy8gfTsiLCJpbXBvcnQgZmlsZU1hbmFnZXIgZnJvbSAnLi4vc3JjL2ZpbGVNYW5hZ2VyJztcbmltcG9ydCBtYW5pbGEgZnJvbSAnbW5sYS9jbGllbnQnO1xuXG5tYW5pbGEuY29tcG9uZW50KCd0YWJzJywgdm0gPT4ge1xuXG5cdHZtLnRhYnMgPSB7fTtcblxuXHR2bS5jbG9zZSA9IHBhdGggPT4ge1xuXG5cdFx0ZGVsZXRlIHZtLnRhYnNbcGF0aF07XG5cblx0XHRmaWxlTWFuYWdlci5jbG9zZSh7XG5cdFx0XHRwYXRoOiBwYXRoLFxuXHRcdFx0bmFtZTogdm0udGFic1twYXRoXVxuXHRcdH0pO1xuXG5cdH07XG5cblx0dm0ub3BlbiA9IHBhdGggPT4ge1xuXG5cdFx0ZmlsZU1hbmFnZXIub3Blbih7XG5cdFx0XHRwYXRoOiBwYXRoLFxuXHRcdFx0bmFtZTogdm0udGFic1twYXRoXVxuXHRcdH0pO1xuXG5cdH07XG5cblx0cmV0dXJuIChmaWxlLCBvcGVuKSA9PiB7XG5cblx0XHRpZiAob3Blbikge1xuXG5cdFx0XHR2bS5hY3RpdmUgPSBmaWxlLnBhdGg7XG5cblx0XHRcdHZtLnRhYnNbZmlsZS5wYXRoXSA9IGZpbGUubmFtZTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdGRlbGV0ZSB2bS50YWJzW2ZpbGUucGF0aF07XG5cblx0XHR9XG5cblx0fVxuXG59KTtcbiIsImltcG9ydCB7IHNhdmUgfSBmcm9tICcuL3NhdmUnO1xuXG5jb25zdCBrZXltYXAgPSB7XG5cblx0XHQ5MToge1xuXHRcdFx0Y2FsbGJhY2s6IHNhdmUsXG5cdFx0XHRwYWlyOiA4MyBcblx0XHR9LFxuXG5cdFx0ODM6IHtcblx0XHRcdGNhbGxiYWNrOiBzYXZlLFxuXHRcdFx0cGFpcjogOTFcblx0XHR9XG5cblx0fTtcblxubGV0IHByZXNzZWQgPSB7IH07XG5cblxuZnVuY3Rpb24ga2V5ZG93bihlKSB7XG5cblx0bGV0IGNvZGUgPSBlLmtleUNvZGUgfHwgZS53aGljaCxcblxuXHRcdGtleSA9IGtleW1hcFtjb2RlXTtcblxuXHRpZiAoa2V5KSB7XG5cblx0XHRwcmVzc2VkW2NvZGVdID0gdHJ1ZTtcblxuXHRcdGlmIChwcmVzc2VkW2tleS5wYWlyXSkge1xuXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGtleS5jYWxsYmFjaygpO1xuXG5cdFx0XHRkZWxldGUgcHJlc3NlZFtjb2RlXTtcblx0XHRcdGRlbGV0ZSBwcmVzc2VkW2tleS5wYWlyXTtcblxuXHRcdH1cblxuXHR9XG5cbn1cblxuXG5mdW5jdGlvbiBrZXl1cChlKSB7XG5cblx0ZGVsZXRlIHByZXNzZWRbZS5rZXlDb2RlIHx8IGUud2hpY2hdO1xuXG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEtleWJvYXJkU2hvcnRjdXRzKCkge1xuXHRcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGtleWRvd24pO1xuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGtleXVwKTtcblxufTtcbiIsImZ1bmN0aW9uIHNlcmlhbGl6ZShkYXRhKSB7XG4gXG4gXHRsZXQgcGFydHMgPSBbXTtcbiBcbiBcdGZvciAobGV0IGtleSBpbiBkYXRhKSB7XG4gXG4gXHRcdHBhcnRzLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudChkYXRhW2tleV0pKTtcblxuIFx0fVxuIFxuIFx0cmV0dXJuIHBhcnRzLmpvaW4oJyYnKTtcbn1cbiBcbmZ1bmN0aW9uIGdldChwYXRoLCBkYXRhLCBjYWxsYmFjaykge1xuIFxuIFx0bGV0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuIFxuIFx0aWYgKHR5cGVvZiBkYXRhID09PSAnZnVuY3Rpb24nKSB7XG4gXG4gXHRcdGNhbGxiYWNrID0gZGF0YTtcbiBcbiBcdFx0ZGF0YSA9IHt9O1xuXG4gXHR9XG4gXG4gXHRyZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuIFxuIFx0XHRpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCAmJiByZXEuc3RhdHVzID09IDIwMCkge1xuIFxuIFx0XHRcdGxldCByZXN1bHQgPSB2b2lkIDA7XG4gXG4gXHRcdFx0dHJ5IHtcbiBcbiBcdFx0XHRcdHJlc3VsdCA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG5cbiBcdFx0XHR9IGNhdGNoIChlcnIpIHtcbiBcbiBcdFx0XHRcdHJlc3VsdCA9IHJlcS5yZXNwb25zZVRleHQ7XG5cbiBcdFx0XHR9XG4gXG4gXHRcdFx0Y2FsbGJhY2socmVzdWx0KTtcbiBcdFx0fVxuXG4gXHR9O1xuIFxuIFx0cmVxLm9wZW4oJ0dFVCcsIHBhdGgpO1xuIFxuIFx0cmVxLnNlbmQoc2VyaWFsaXplKGRhdGEpKTtcblxufVxuIFxuZnVuY3Rpb24gcG9zdChwYXRoLCBkYXRhLCBjYWxsYmFjaykge1xuIFxuIFx0bGV0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuIFxuIFx0cmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiBcbiBcdFx0aWYgKHJlcS5yZWFkeVN0YXRlID09IDQgJiYgcmVxLnN0YXR1cyA9PSAyMDApIHtcbiBcbiBcdFx0XHRsZXQganNvbiA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gXG4gXHRcdFx0aWYgKGpzb24pIHtcbiBcbiBcdFx0XHRcdGNhbGxiYWNrKGpzb24pO1xuXG4gXHRcdFx0fSBlbHNlIHtcbiBcbiBcdFx0XHRcdGNhbGxiYWNrKHJlcS5yZXNwb25zZVRleHQpO1xuXG4gXHRcdFx0fVxuXG4gXHRcdH1cblxuIFx0fTtcbiBcbiBcdHJlcS5vcGVuKCdQT1NUJywgcGF0aCk7XG4gXG4gXHRyZXEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xuIFxuIFx0cmVxLnNlbmQoc2VyaWFsaXplKGRhdGEpKTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuIFx0Z2V0OiBnZXQsXG4gXHRwb3N0OiBwb3N0XG4gXG59O1xuIiwiaW1wb3J0IG1hbmlsYSBmcm9tICdtbmxhL2NsaWVudCc7XG5cbmxldCBvcGVuRmlsZXMgPSB7fTtcblxuZnVuY3Rpb24gb3BlbihmaWxlKSB7XG5cblx0bWFuaWxhLm5vdGlmeSgnZWRpdG9yJywgZmlsZS5wYXRoKTtcblxuXHRtYW5pbGEubm90aWZ5KCduYXYnLCBmaWxlLnBhdGgsIHRydWUpO1xuXG5cdG1hbmlsYS5ub3RpZnkoJ3RhYnMnLCBmaWxlLCB0cnVlKTtcblxuXHRvcGVuRmlsZXNbZmlsZS5wYXRoXSA9IGZpbGU7XG5cbn1cblxuZnVuY3Rpb24gY2xvc2UoZmlsZSkge1xuXG5cdGxldCBvcGVuTGlzdDtcblxuXHRtYW5pbGEubm90aWZ5KCdlZGl0b3InLCAnJyk7XG5cblx0bWFuaWxhLm5vdGlmeSgnbmF2JywgZmlsZS5wYXRoLCBmYWxzZSk7XG5cdFxuXHRtYW5pbGEubm90aWZ5KCd0YWJzJywgZmlsZSwgZmFsc2UpO1xuXG5cdGRlbGV0ZSBvcGVuRmlsZXNbZmlsZS5wYXRoXTtcblxuXHRvcGVuTGlzdCA9IE9iamVjdC5rZXlzKG9wZW5GaWxlcyk7XG5cblx0aWYgKG9wZW5MaXN0Lmxlbmd0aCkge1xuXG5cdFx0b3BlbihvcGVuRmlsZXNbb3Blbkxpc3Rbb3Blbkxpc3QubGVuZ3RoIC0gMV1dKTtcblxuXHR9XG5cbn1cblxuLy8gZnVuY3Rpb24gb3BlbihmaWxlKSB7XG5cbi8vIFx0ZWRpdG9yLm5vdGlmeShmaWxlLnBhdGgpO1xuXG4vLyBcdG5hdi5ub3RpZnkoZmlsZS5wYXRoLCB0cnVlKTtcblxuLy8gXHR0YWJzLm5vdGlmeShmaWxlLCB0cnVlKTtcblxuLy8gXHRvcGVuRmlsZXNbZmlsZS5wYXRoXSA9IGZpbGU7XG5cbi8vIH1cblxuLy8gZnVuY3Rpb24gY2xvc2UoZmlsZSkge1xuXG4vLyBcdGxldCBvcGVuTGlzdDtcblxuLy8gXHRlZGl0b3Iubm90aWZ5KCcnKTtcblxuLy8gXHRuYXYubm90aWZ5KGZpbGUucGF0aCwgZmFsc2UpO1xuXG4vLyBcdHRhYnMubm90aWZ5KGZpbGUsIGZhbHNlKTtcblxuLy8gXHRkZWxldGUgb3BlbkZpbGVzW2ZpbGUucGF0aF07XG5cbi8vIFx0b3Blbkxpc3QgPSBPYmplY3Qua2V5cyhvcGVuRmlsZXMpO1xuXG4vLyBcdGlmIChvcGVuTGlzdC5sZW5ndGgpIHtcblxuLy8gXHRcdG9wZW4ob3BlbkZpbGVzW29wZW5MaXN0W29wZW5MaXN0Lmxlbmd0aCAtIDFdXSk7XG5cbi8vIFx0fVxuXG4vLyB9XG5cbmV4cG9ydCBkZWZhdWx0IHtcblxuXHRvcGVuOiBvcGVuLFxuXHRjbG9zZTogY2xvc2VcblxufTsiLCJsZXQgbG9hZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xvYWRlci10ZW1wbGF0ZScpLmlubmVySFRNTDtcblxuZnVuY3Rpb24gZmFkZUluKCkge1xuXG5cdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuXHRcdFxuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXInKS5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG5cblx0fSk7XG5cbn1cblxuZnVuY3Rpb24gcmVwbGFjZShodG1sKSB7XG5cblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxvYWRlcicpLm91dGVySFRNTCA9IGh0bWw7XG5cbn1cblxuZnVuY3Rpb24gYWZ0ZXIoZWwpIHtcblxuXHRpZiAodHlwZW9mIGVsID09PSAnc3RyaW5nJykge1xuXG5cdFx0ZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKTtcblxuXHR9XG5cblx0ZWwub3V0ZXJIVE1MICs9IGxvYWRlcjtcblxuXHRmYWRlSW4oKTtcblxufVxuXG5cbmZ1bmN0aW9uIGhpZGUoKSB7XG5cblx0bGV0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxvYWRlcicpO1xuXG5cdGlmIChlbCkge1xuXG5cdFx0ZWwuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpO1xuXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblxuXHRcdFx0ZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XG5cblx0XHR9LCA2MDApO1xuXG5cdH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG5cdFxuXHRyZXBsYWNlOiByZXBsYWNlLFxuXHRhZnRlcjogYWZ0ZXIsXG5cdGhpZGU6IGhpZGVcblxufTsiLCJpbXBvcnQgbmF2IGZyb20gJy4uL2NvbXBvbmVudHMvbmF2JztcbmltcG9ydCBhamF4IGZyb20gJy4uL3NyYy9hamF4JztcblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmUoKSB7XG5cblx0bGV0IGJnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJhY2tncm91bmQnKSxcblxuXHRcdGFjdGl2ZUZpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmlsZS5hY3RpdmUnKSxcblxuXHRcdHBhdGg7XG5cblx0aWYgKGFjdGl2ZUZpbGUpIHtcblxuXHRcdGJnLmNsYXNzTGlzdC5hZGQoJ2JsdXInKTtcblxuXHRcdHBhdGggPSBhY3RpdmVGaWxlLmdldEF0dHJpYnV0ZSgnZGF0YS1wYXRoJyk7XG5cblx0XHRhamF4LnBvc3QoXG5cblx0XHRcdCcvc2F2ZT9maWxlPScgKyBwYXRoLFxuXG5cdFx0XHR7XG5cdFx0XHRcdGRhdGE6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZXh0JykudmFsdWVcblx0XHRcdH0sXG5cblx0XHRcdHJlc3VsdCA9PiB7XG5cblx0XHRcdFx0aWYgKHJlc3VsdC5lcnJvcikge1xuXG5cdFx0XHRcdFx0YWxlcnQocmVzdWx0LmVycm9yKTtcblx0XHRcdFx0XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihyZXN1bHQuZXJyb3IpO1xuXHRcdFx0XHRcblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdGlmIChhY3RpdmVGaWxlLmNsYXNzTGlzdC5jb250YWlucygnbmV3JykpIHtcblxuXHRcdFx0XHRcdFx0bGV0IHNlbGVjdGVkRGlyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRpci5zZWxlY3RlZCcpO1xuXG5cdFx0XHRcdFx0XHRhY3RpdmVGaWxlLmNsYXNzTGlzdC5yZW1vdmUoJ25ldycpO1xuXG5cdFx0XHRcdFx0XHRpZiAoc2VsZWN0ZWREaXIpIHtcblxuXHRcdFx0XHRcdFx0XHRzZWxlY3RlZERpci5uZXh0RWxlbWVudFNpYmxpbmcub3V0ZXJIVE1MID0gJyc7XG5cblx0XHRcdFx0XHRcdFx0bmF2Lm5vdGlmeShzZWxlY3RlZERpciwgcGF0aCk7XG5cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdFx0bmF2LnJlaW5pdGlhbGl6ZSgpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0YmcuY2xhc3NMaXN0LnJlbW92ZSgnYmx1cicpO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0KTtcblxuXHR9XG5cbn07IiwiY29uc3QgY29tcGlsZSA9IHJlcXVpcmUoJy4vY29tcGlsZScpO1xuXG53aW5kb3cubWFuaWxhID0gd2luZG93Lm1hbmlsYSB8fCB7fTtcblxud2luZG93Lm1hbmlsYS5oYW5kbGVycyA9IHt9O1xuXG4vLyBmdW5jdGlvbiByZXNvbHZlUHJvbWlzZShyZXNvbHZlLCBwcm9taXNlKSB7XG5cbi8vIFx0aWYgKHByb21pc2UgJiYgdHlwZW9mIHByb21pc2UudGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuXG4vLyBcdFx0cHJvbWlzZS50aGVuKGRhdGEgPT4ge1xuXG4vLyBcdFx0XHRyZXNvbHZlKGRhdGEpO1xuXHRcdFx0XG4vLyBcdFx0fSk7XG5cbi8vIFx0fVxuXG4vLyB9XG5cbi8vIGZ1bmN0aW9uIGNvbXBvbmVudChtb2R1bGVzKSB7XG5cbi8vIFx0Wy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWNvbXBvbmVudF0nKV0uZm9yRWFjaChlbCA9PiB7XG5cbi8vIFx0XHRsZXQgY29tcG9uZW50TmFtZSA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1jb21wb25lbnQnKSxcblxuLy8gXHRcdFx0Y29tcG9uZW50ID0gbW9kdWxlc1tjb21wb25lbnROYW1lXTtcblx0XHRcbi8vIFx0XHRjb21waWxlKCBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGVtcGxhdGUnKSApLnRoZW4ocmVuZGVyID0+IHtcblxuLy8gXHRcdFx0ZnVuY3Rpb24gcmVzb2x2ZShkYXRhID0ge30pIHtcblxuLy8gXHRcdFx0XHRsZXQgaW5kZXggPSAwO1xuXG4vLyBcdFx0XHRcdHdpbmRvdy5tYW5pbGEuaGFuZGxlcnNbY29tcG9uZW50TmFtZV0gPSBbXTtcblxuLy8gXHRcdFx0XHRkYXRhLm9uID0gKGV2ZW50LCBoYW5kbGVyLCAuLi5hcmdzKSA9PiB7XG5cbi8vIFx0XHRcdFx0XHRsZXQgZXZlbnRTdHJpbmc7XG5cbi8vIFx0XHRcdFx0XHR3aW5kb3cubWFuaWxhLmhhbmRsZXJzW2NvbXBvbmVudE5hbWVdW2luZGV4XSA9IGUgPT4ge1xuXG4vLyBcdFx0XHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdFx0XG4vLyBcdFx0XHRcdFx0XHRhcmdzLnB1c2goZSk7XG5cbi8vIFx0XHRcdFx0XHRcdHJlc29sdmVQcm9taXNlKHJlc29sdmUsIGhhbmRsZXIuYXBwbHkoZGF0YSwgYXJncykpO1xuXG4vLyBcdFx0XHRcdFx0fTtcblxuLy8gXHRcdFx0XHRcdGV2ZW50U3RyaW5nID0gYG9uJHtldmVudH09bWFuaWxhLmhhbmRsZXJzLiR7Y29tcG9uZW50TmFtZX1bJHtpbmRleH1dKGV2ZW50KWA7XG5cbi8vIFx0XHRcdFx0XHRpbmRleCsrO1xuXG4vLyBcdFx0XHRcdFx0cmV0dXJuIGV2ZW50U3RyaW5nO1xuXG4vLyBcdFx0XHRcdH07XG5cbi8vIFx0XHRcdFx0bGV0IHRhZ05hbWUgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cbi8vIFx0XHRcdFx0aWYgKHRhZ05hbWUgPT09ICdpbnB1dCcgfHwgdGFnTmFtZSA9PT0gJ3RleHRhcmVhJykge1xuXG4vLyBcdFx0XHRcdFx0ZWwudmFsdWUgPSByZW5kZXIoZGF0YSk7XG5cbi8vIFx0XHRcdFx0fSBlbHNlIHtcblxuLy8gXHRcdFx0XHRcdGVsLmlubmVySFRNTCA9IHJlbmRlcihkYXRhKTtcblxuLy8gXHRcdFx0XHR9XG5cbi8vIFx0XHRcdH1cblxuLy8gXHRcdFx0Y29tcG9uZW50Lm5vdGlmeSA9ICguLi5hcmdzKSA9PiB7XG5cbi8vIFx0XHRcdFx0aWYgKHR5cGVvZiBjb21wb25lbnQubGlzdGVuID09PSAnZnVuY3Rpb24nKSB7XG5cbi8vIFx0XHRcdFx0XHRyZXNvbHZlUHJvbWlzZShyZXNvbHZlLCBjb21wb25lbnQubGlzdGVuLmFwcGx5KGNvbXBvbmVudCwgWy4uLmFyZ3NdKSlcblxuLy8gXHRcdFx0XHR9XG5cbi8vIFx0XHRcdH07XG5cbi8vIFx0XHRcdGlmICh0eXBlb2YgY29tcG9uZW50LmluaXQgPT09ICdmdW5jdGlvbicpIHtcblxuLy8gXHRcdFx0XHRyZXNvbHZlUHJvbWlzZShyZXNvbHZlLCBjb21wb25lbnQuaW5pdCgpKTtcblxuLy8gXHRcdFx0fSBlbHNlIGlmICh3aW5kb3cubWFuaWxhLmpzb25bY29tcG9uZW50TmFtZV0pIHtcblxuLy8gXHRcdFx0XHRyZXNvbHZlKEpTT04ucGFyc2Uod2luZG93Lm1hbmlsYS5qc29uKVtjb21wb25lbnROYW1lXSk7XG5cbi8vIFx0XHRcdH1cblxuLy8gXHRcdH0pO1xuXG4vLyBcdH0pO1xuXG4vLyB9O1xuXG4vLyBURVNUXG5cbmxldCBsaXN0ZW5lcnMgPSB7fTtcblxuZnVuY3Rpb24gY29tcG9uZW50KGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudCkge1xuXG5cdGxldCB2bSA9IHdpbmRvdy5tYW5pbGEuZGF0YVtjb21wb25lbnROYW1lXSB8fCB7fSxcblxuXHRcdGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLiR7Y29tcG9uZW50TmFtZX0tY29tcG9uZW50YCk7XG5cblx0Y29tcGlsZSggZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXRlbXBsYXRlJykgKS50aGVuKHJlbmRlciA9PiB7XG5cblx0XHRmdW5jdGlvbiByZXNvbHZlKGRhdGEpIHtcblxuXHRcdFx0bGV0IGluZGV4ID0gMDtcblxuXHRcdFx0d2luZG93Lm1hbmlsYS5oYW5kbGVyc1tjb21wb25lbnROYW1lXSA9IFtdO1xuXG5cdFx0XHRkYXRhLm9uID0gKGV2ZW50LCBoYW5kbGVyLCAuLi5hcmdzKSA9PiB7XG5cblx0XHRcdFx0bGV0IGV2ZW50U3RyaW5nO1xuXG5cdFx0XHRcdHdpbmRvdy5tYW5pbGEuaGFuZGxlcnNbY29tcG9uZW50TmFtZV1baW5kZXhdID0gZSA9PiB7XG5cblx0XHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGFyZ3MucHVzaChlKTtcblxuXHRcdFx0XHRcdGhhbmRsZXIuYXBwbHkoZGF0YSwgYXJncyk7XG5cblx0XHRcdFx0XHRyZXNvbHZlKGRhdGEpO1xuXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0ZXZlbnRTdHJpbmcgPSBgb24ke2V2ZW50fT1tYW5pbGEuaGFuZGxlcnMuJHtjb21wb25lbnROYW1lfVske2luZGV4fV0oZXZlbnQpYDtcblxuXHRcdFx0XHRpbmRleCsrO1xuXG5cdFx0XHRcdHJldHVybiBldmVudFN0cmluZztcblxuXHRcdFx0fTtcblxuXHRcdFx0ZWwuaW5uZXJIVE1MID0gcmVuZGVyKHZtKTtcblxuXHRcdH1cblxuXHRcdHZtLnJlbmRlciA9ICgpID0+IHtcblx0XHRcdHJlc29sdmUodm0pO1xuXHRcdH07XG5cblx0XHRsZXQgbGlzdGVuZXIgPSBjb21wb25lbnQodm0pO1xuXG5cdFx0bGlzdGVuZXJzW2NvbXBvbmVudE5hbWVdID0gKC4uLmFyZ3MpID0+IHtcblx0XHRcdFxuXHRcdFx0bGlzdGVuZXIuYXBwbHkodm0sIGFyZ3MpO1xuXG5cdFx0XHRyZXNvbHZlKHZtKTtcblxuXHRcdH07XG5cblx0XHRyZXNvbHZlKHZtKTtcblxuXHR9KTtcblxufVxuXG5mdW5jdGlvbiBub3RpZnkoY29tcG9uZW50TmFtZSwgLi4uYXJncykge1xuXG5cdGxpc3RlbmVyc1tjb21wb25lbnROYW1lXS5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuXG59XG5cbndpbmRvdy5tYW5pbGEuY29tcG9uZW50ID0gY29tcG9uZW50O1xud2luZG93Lm1hbmlsYS5ub3RpZnkgPSBub3RpZnk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRjb21wb25lbnQ6IGNvbXBvbmVudCxcblx0bm90aWZ5OiBub3RpZnlcbn07XG4iLCJjb25zdCBtYW5pbGEgPSByZXF1aXJlKCdtYW5pbGEvcGFyc2UnKTtcblxubGV0IGNhY2hlID0ge30sXG5cblx0ZXNjYXBlTWFwID0ge1xuICAgICAgICAnPCc6ICcmbHQ7JyxcbiAgICAgICAgJz4nOiAnJmd0OycsXG4gICAgICAgICdcIic6ICcmcXVvdDsnLFxuICAgICAgICAnXFwnJzogJyZhcG9zOydcbiAgICB9O1xuXG5mdW5jdGlvbiBodG1sRXNjYXBlKHN0cikge1xuXG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bJjw+J1wiXS9nLCBjID0+IHtcblxuICAgICAgICByZXR1cm4gZXNjYXBlTWFwW2NdO1xuXG4gICAgfSk7XG5cbn1cblxud2luZG93Lm1hbmlsYSA9IHdpbmRvdy5tYW5pbGEgfHwge307XG5cbndpbmRvdy5tYW5pbGEuZSA9IGZ1bmN0aW9uKHZhbCkge1xuXG4gICAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnID8gaHRtbEVzY2FwZSh2YWwpIDogdmFsO1xuICAgIFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21waWxlKHNlbGVjdG9yKSB7XG5cblx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuXG5cdFx0aWYgKCFzZWxlY3Rvcikge1xuXG5cdFx0XHRyZXNvbHZlKCAoKT0+e30gKTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdGlmIChjYWNoZVtzZWxlY3Rvcl0pIHtcblxuXHRcdFx0XHRyZXNvbHZlKGNhY2hlW3NlbGVjdG9yXSk7XG5cblx0XHRcdH1cblxuXHRcdFx0Y2FjaGVbc2VsZWN0b3JdID0gbWFuaWxhKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpLmlubmVySFRNTCk7XG5cblx0XHRcdHJlc29sdmUoY2FjaGVbc2VsZWN0b3JdKTtcblxuXHRcdH1cblxuXHR9KTtcblxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0ZW1wbGF0ZSkge1xuXG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbignY29udGV4dCcsXG5cbiAgICAgICAgXCJ2YXIgcD1bXTt3aXRoKGNvbnRleHQpe3AucHVzaChgXCIgK1xuICAgICAgIFxuICAgICAgICB0ZW1wbGF0ZVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFwnL2csIFwiXFxcXFxcXFwnXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvYC9nLCBcIlxcXFxgXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvPC0tKD8hXFxzKn0uKj8tLT4pKD8hLip7XFxzKi0tPikoLio/KS0tPi9nLCBcImApO3RyeXtwLnB1c2goJDEpfWNhdGNoKGUpe31wLnB1c2goYFwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoLzwtLVxccyooLio/KVxccyotLT4vZywgXCJgKTskMVxcbnAucHVzaChgXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvPC0oPyFcXHMqfS4qPy0+KSg/IS4qe1xccyotPikoLio/KS0+L2csIFwiYCk7dHJ5e3AucHVzaChtYW5pbGEuZSgkMSkpfWNhdGNoKGUpe31wLnB1c2goYFwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoLzwtXFxzKiguKj8pXFxzKi0+L2csIFwiYCk7JDFcXG5wLnB1c2goYFwiKVxuXG4gICAgICArIFwiYCk7fXJldHVybiBwLmpvaW4oJycpO1wiKTtcbn07Il19
