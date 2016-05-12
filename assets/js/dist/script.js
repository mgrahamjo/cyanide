(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _addKeyboardShortcuts = require('./src/addKeyboardShortcuts');

var _addKeyboardShortcuts2 = _interopRequireDefault(_addKeyboardShortcuts);

var _nav = require('./components/nav');

var _nav2 = _interopRequireDefault(_nav);

var _editor = require('./components/editor');

var _editor2 = _interopRequireDefault(_editor);

var _tabs = require('./components/tabs');

var _tabs2 = _interopRequireDefault(_tabs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./components/editor":2,"./components/nav":3,"./components/tabs":4,"./src/addKeyboardShortcuts":5}],2:[function(require,module,exports){
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

document.addEventListener('keydown', keydown);
document.addEventListener('keyup', keyup);

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

var listeners = {};

function component(componentName, component) {

	var vm = window.manila.data[componentName] || {},
	    el = document.querySelector('[data-component="' + componentName + '"]');

	compile('#' + componentName + '-template').then(function (render) {

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

			el.innerHTML = render(data);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvYXBwLmpzIiwiYXNzZXRzL2pzL2NvbXBvbmVudHMvZWRpdG9yLmpzIiwiYXNzZXRzL2pzL2NvbXBvbmVudHMvbmF2LmpzIiwiYXNzZXRzL2pzL2NvbXBvbmVudHMvdGFicy5qcyIsImFzc2V0cy9qcy9zcmMvYWRkS2V5Ym9hcmRTaG9ydGN1dHMuanMiLCJhc3NldHMvanMvc3JjL2FqYXguanMiLCJhc3NldHMvanMvc3JjL2ZpbGVNYW5hZ2VyLmpzIiwiYXNzZXRzL2pzL3NyYy9sb2FkZXIuanMiLCJhc3NldHMvanMvc3JjL3NhdmUuanMiLCIuLi9tbmxhL2NsaWVudC5qcyIsIi4uL21ubGEvY29tcGlsZS5qcyIsIi4uL21ubGEvbm9kZV9tb2R1bGVzL21hbmlsYS9wYXJzZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7OztBQ0hBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsaUJBQU8sU0FBUCxDQUFpQixRQUFqQixFQUEyQixjQUFNOztBQUVoQyxLQUFJLFVBQVUsU0FBUyxhQUFULENBQXVCLFVBQXZCLENBQVYsQ0FGNEI7O0FBSWhDLElBQUcsV0FBSCxHQUFpQixhQUFLOztBQUVyQixNQUFJLEtBQUssU0FBUyxhQUFULENBQXVCLE9BQXZCLENBQUw7TUFFSCxlQUZELENBRnFCOztBQU1yQixLQUFHLEtBQUgsQ0FBUyxNQUFULEdBQWtCLEVBQWxCLENBTnFCOztBQVFyQixXQUFTLEdBQUcsWUFBSCxDQVJZOztBQVVyQixVQUFRLEtBQVIsQ0FBYyxNQUFkLEdBQXVCLEVBQXZCLENBVnFCOztBQVlyQixNQUFJLFFBQVEsWUFBUixHQUF1QixNQUF2QixFQUErQjs7QUFFbEMsVUFBTyxRQUFRLFlBQVIsR0FBdUIsTUFBdkIsRUFBK0I7O0FBRXJD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RUFBMkI7O0FBRTNDLFFBQU8sSUFBSSxPQUFKLENBQVksbUJBQVc7O0FBRTdCLE1BQUksQ0FBQyxRQUFELEVBQVc7O0FBRWQsV0FBUyxZQUFJLEVBQUosQ0FBVCxDQUZjO0dBQWYsTUFJTzs7QUFFTixPQUFJLE1BQU0sUUFBTixDQUFKLEVBQXFCOztBQUVwQixZQUFRLE1BQU0sUUFBTixDQUFSLEVBRm9CO0lBQXJCOztBQU1BLFNBQU0sUUFBTixJQUFrQixPQUFPLFNBQVMsYUFBVCxDQUF1QixRQUF2QixFQUFpQyxTQUFqQyxDQUF6QixDQVJNOztBQVVOLFdBQVEsTUFBTSxRQUFOLENBQVIsRUFWTTtHQUpQO0VBRmtCLENBQW5CLENBRjJDO0NBQTNCOzs7QUM3QmpCOztBQUVBLE9BQU8sT0FBUCxHQUFpQixVQUFTLFFBQVQsRUFBbUI7O0FBRWhDLFdBQU8sSUFBSSxRQUFKLENBQWEsU0FBYixFQUVILG9DQUVBLFNBQ0ssT0FETCxDQUNhLE1BRGIsRUFDcUIsT0FEckIsRUFFSyxPQUZMLENBRWEsSUFGYixFQUVtQixLQUZuQixFQUdLLE9BSEwsQ0FHYSx5Q0FIYixFQUd3RCxzQ0FIeEQsRUFJSyxPQUpMLENBSWEsb0JBSmIsRUFJbUMsaUJBSm5DLEVBS0ssT0FMTCxDQUthLHFDQUxiLEVBS29ELGdEQUxwRCxFQU1LLE9BTkwsQ0FNYSxrQkFOYixFQU1pQyxpQkFOakMsQ0FGQSxHQVVBLHdCQVZBLENBRkosQ0FGZ0M7Q0FBbkIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IGFkZEtleWJvYXJkU2hvcnRjdXRzIGZyb20gJy4vc3JjL2FkZEtleWJvYXJkU2hvcnRjdXRzJztcbmltcG9ydCBuYXYgZnJvbSAnLi9jb21wb25lbnRzL25hdic7XG5pbXBvcnQgZWRpdG9yIGZyb20gJy4vY29tcG9uZW50cy9lZGl0b3InO1xuaW1wb3J0IHRhYnMgZnJvbSAnLi9jb21wb25lbnRzL3RhYnMnO1xuIiwiaW1wb3J0IGxvYWRlciBmcm9tICcuLi9zcmMvbG9hZGVyJztcbmltcG9ydCBhamF4IGZyb20gJy4uL3NyYy9hamF4JztcbmltcG9ydCBtYW5pbGEgZnJvbSAnbW5sYS9jbGllbnQnO1xuXG5tYW5pbGEuY29tcG9uZW50KCdlZGl0b3InLCB2bSA9PiB7XG5cblx0bGV0IG51bWJlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubnVtYmVycycpO1xuXG5cdHZtLnJlc2V0SGVpZ2h0ID0gZSA9PiB7XG5cblx0XHRsZXQgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGV4dCcpLFxuXG5cdFx0XHRoZWlnaHQ7XG5cblx0XHRlbC5zdHlsZS5oZWlnaHQgPSAnJztcblxuXHRcdGhlaWdodCA9IGVsLnNjcm9sbEhlaWdodDtcblxuXHRcdG51bWJlcnMuc3R5bGUuaGVpZ2h0ID0gJyc7XG5cblx0XHRpZiAobnVtYmVycy5jbGllbnRIZWlnaHQgPCBoZWlnaHQpIHtcblxuXHRcdFx0d2hpbGUgKG51bWJlcnMuY2xpZW50SGVpZ2h0IDwgaGVpZ2h0KSB7XG5cblx0XHRcdFx0bnVtYmVycy5pbm5lckhUTUwgKz0gJzxkaXYgY2xhc3M9XCJudW1cIj48L2Rpdj4nO1xuXG5cdFx0XHR9XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRudW1iZXJzLnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCc7XG5cblx0XHR9XG5cblx0XHRlbC5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuXG5cdH07XG5cblx0ZnVuY3Rpb24gdXBkYXRlKHRleHQpIHtcblxuXHRcdHZtLnRleHQgPSB0ZXh0O1xuXG5cdFx0bG9hZGVyLmhpZGUoKTtcblxuXHRcdHZtLnJlbmRlcigpO1xuXG5cdH1cblxuXHRyZXR1cm4gcGF0aCA9PiB7XG5cblx0XHRsb2FkZXIuYWZ0ZXIoJy5vdmVybGF5Jyk7XG5cblx0XHRpZiAocGF0aCkge1xuXG5cdFx0XHRhamF4LmdldCgnL29wZW4/ZmlsZT0nICsgcGF0aCwgZGF0YSA9PiB7XG5cblx0XHRcdFx0dXBkYXRlKGRhdGEuZGF0YSk7XG5cblx0XHRcdFx0dm0ucmVzZXRIZWlnaHQoKTtcblxuXHRcdFx0fSk7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHR1cGRhdGUoJycpO1xuXG5cdFx0XHR2bS5yZXNldEhlaWdodCgpO1xuXG5cdFx0fVxuXG5cdH1cblxufSk7XG4iLCJpbXBvcnQgZmlsZU1hbmFnZXIgZnJvbSAnLi4vc3JjL2ZpbGVNYW5hZ2VyJztcbmltcG9ydCBhamF4IGZyb20gJy4uL3NyYy9hamF4JztcbmltcG9ydCBtYW5pbGEgZnJvbSAnbW5sYS9jbGllbnQnO1xuXG5tYW5pbGEuY29tcG9uZW50KCduYXYnLCB2bSA9PiB7XG5cblx0dm0ub3BlbiA9IHt9O1xuXG5cdHZtLmNsaWNrRGlyID0gZGlyID0+IHtcblxuXHRcdGRpci5vcGVuID0gIWRpci5vcGVuO1xuXG5cdFx0dm0uc2VsZWN0ZWQgPSBkaXIucGF0aDtcblxuXHRcdGlmICghZGlyLmNoaWxkcmVuKSB7XG5cblx0XHRcdGFqYXguZ2V0KCcvbmF2P3BhdGg9JyArIGRpci5wYXRoLCBkYXRhID0+IHtcblxuXHRcdFx0XHRkaXIuY2hpbGRyZW4gPSBkYXRhLmRpcjtcblxuXHRcdFx0XHR2bS5yZW5kZXIoKTtcblxuXHRcdFx0fSk7XG5cblx0XHR9XG5cblx0fTtcblxuXHR2bS5jbGlja0ZpbGUgPSBmaWxlID0+IHtcblxuXHRcdGZpbGVNYW5hZ2VyLm9wZW4oZmlsZSk7XG5cblx0fTtcblxuXHRyZXR1cm4gKHBhdGgsIG9wZW4pID0+IHtcblxuXHRcdGlmIChvcGVuKSB7XG5cblx0XHRcdHZtLm9wZW5bcGF0aF0gPSBwYXRoO1xuXG5cdFx0XHR2bS5hY3RpdmUgPSBwYXRoO1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0ZGVsZXRlIHZtLm9wZW5bcGF0aF07XG5cblx0XHR9XG5cblx0fTtcblxufSk7XG4iLCJpbXBvcnQgZmlsZU1hbmFnZXIgZnJvbSAnLi4vc3JjL2ZpbGVNYW5hZ2VyJztcbmltcG9ydCBtYW5pbGEgZnJvbSAnbW5sYS9jbGllbnQnO1xuXG5tYW5pbGEuY29tcG9uZW50KCd0YWJzJywgdm0gPT4ge1xuXG5cdHZtLnRhYnMgPSB7fTtcblxuXHR2bS5jbG9zZSA9IHBhdGggPT4ge1xuXG5cdFx0ZGVsZXRlIHZtLnRhYnNbcGF0aF07XG5cblx0XHRmaWxlTWFuYWdlci5jbG9zZSh7XG5cdFx0XHRwYXRoOiBwYXRoLFxuXHRcdFx0bmFtZTogdm0udGFic1twYXRoXVxuXHRcdH0pO1xuXG5cdH07XG5cblx0dm0ub3BlbiA9IHBhdGggPT4ge1xuXG5cdFx0ZmlsZU1hbmFnZXIub3Blbih7XG5cdFx0XHRwYXRoOiBwYXRoLFxuXHRcdFx0bmFtZTogdm0udGFic1twYXRoXVxuXHRcdH0pO1xuXG5cdH07XG5cblx0cmV0dXJuIChmaWxlLCBvcGVuKSA9PiB7XG5cblx0XHRpZiAob3Blbikge1xuXG5cdFx0XHR2bS5hY3RpdmUgPSBmaWxlLnBhdGg7XG5cblx0XHRcdHZtLnRhYnNbZmlsZS5wYXRoXSA9IGZpbGUubmFtZTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdGRlbGV0ZSB2bS50YWJzW2ZpbGUucGF0aF07XG5cblx0XHR9XG5cblx0fVxuXG59KTtcbiIsImltcG9ydCB7IHNhdmUgfSBmcm9tICcuL3NhdmUnO1xuXG5jb25zdCBrZXltYXAgPSB7XG5cblx0XHQ5MToge1xuXHRcdFx0Y2FsbGJhY2s6IHNhdmUsXG5cdFx0XHRwYWlyOiA4MyBcblx0XHR9LFxuXG5cdFx0ODM6IHtcblx0XHRcdGNhbGxiYWNrOiBzYXZlLFxuXHRcdFx0cGFpcjogOTFcblx0XHR9XG5cblx0fTtcblxubGV0IHByZXNzZWQgPSB7IH07XG5cblxuZnVuY3Rpb24ga2V5ZG93bihlKSB7XG5cblx0bGV0IGNvZGUgPSBlLmtleUNvZGUgfHwgZS53aGljaCxcblxuXHRcdGtleSA9IGtleW1hcFtjb2RlXTtcblxuXHRpZiAoa2V5KSB7XG5cblx0XHRwcmVzc2VkW2NvZGVdID0gdHJ1ZTtcblxuXHRcdGlmIChwcmVzc2VkW2tleS5wYWlyXSkge1xuXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGtleS5jYWxsYmFjaygpO1xuXG5cdFx0XHRkZWxldGUgcHJlc3NlZFtjb2RlXTtcblx0XHRcdGRlbGV0ZSBwcmVzc2VkW2tleS5wYWlyXTtcblxuXHRcdH1cblxuXHR9XG5cbn1cblxuXG5mdW5jdGlvbiBrZXl1cChlKSB7XG5cblx0ZGVsZXRlIHByZXNzZWRbZS5rZXlDb2RlIHx8IGUud2hpY2hdO1xuXG59XG5cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGtleWRvd24pO1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBrZXl1cCk7XG4iLCJmdW5jdGlvbiBzZXJpYWxpemUoZGF0YSkge1xuIFxuIFx0bGV0IHBhcnRzID0gW107XG4gXG4gXHRmb3IgKGxldCBrZXkgaW4gZGF0YSkge1xuIFxuIFx0XHRwYXJ0cy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQoZGF0YVtrZXldKSk7XG5cbiBcdH1cbiBcbiBcdHJldHVybiBwYXJ0cy5qb2luKCcmJyk7XG59XG4gXG5mdW5jdGlvbiBnZXQocGF0aCwgZGF0YSwgY2FsbGJhY2spIHtcbiBcbiBcdGxldCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiBcbiBcdGlmICh0eXBlb2YgZGF0YSA9PT0gJ2Z1bmN0aW9uJykge1xuIFxuIFx0XHRjYWxsYmFjayA9IGRhdGE7XG4gXG4gXHRcdGRhdGEgPSB7fTtcblxuIFx0fVxuIFxuIFx0cmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiBcbiBcdFx0aWYgKHJlcS5yZWFkeVN0YXRlID09IDQgJiYgcmVxLnN0YXR1cyA9PSAyMDApIHtcbiBcbiBcdFx0XHRsZXQgcmVzdWx0ID0gdm9pZCAwO1xuIFxuIFx0XHRcdHRyeSB7XG4gXG4gXHRcdFx0XHRyZXN1bHQgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuXG4gXHRcdFx0fSBjYXRjaCAoZXJyKSB7XG4gXG4gXHRcdFx0XHRyZXN1bHQgPSByZXEucmVzcG9uc2VUZXh0O1xuXG4gXHRcdFx0fVxuIFxuIFx0XHRcdGNhbGxiYWNrKHJlc3VsdCk7XG4gXHRcdH1cblxuIFx0fTtcbiBcbiBcdHJlcS5vcGVuKCdHRVQnLCBwYXRoKTtcbiBcbiBcdHJlcS5zZW5kKHNlcmlhbGl6ZShkYXRhKSk7XG5cbn1cbiBcbmZ1bmN0aW9uIHBvc3QocGF0aCwgZGF0YSwgY2FsbGJhY2spIHtcbiBcbiBcdGxldCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiBcbiBcdHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gXG4gXHRcdGlmIChyZXEucmVhZHlTdGF0ZSA9PSA0ICYmIHJlcS5zdGF0dXMgPT0gMjAwKSB7XG4gXG4gXHRcdFx0bGV0IGpzb24gPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuIFxuIFx0XHRcdGlmIChqc29uKSB7XG4gXG4gXHRcdFx0XHRjYWxsYmFjayhqc29uKTtcblxuIFx0XHRcdH0gZWxzZSB7XG4gXG4gXHRcdFx0XHRjYWxsYmFjayhyZXEucmVzcG9uc2VUZXh0KTtcblxuIFx0XHRcdH1cblxuIFx0XHR9XG5cbiBcdH07XG4gXG4gXHRyZXEub3BlbignUE9TVCcsIHBhdGgpO1xuIFxuIFx0cmVxLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcbiBcbiBcdHJlcS5zZW5kKHNlcmlhbGl6ZShkYXRhKSk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiBcdGdldDogZ2V0LFxuIFx0cG9zdDogcG9zdFxuIFxufTtcbiIsImltcG9ydCBtYW5pbGEgZnJvbSAnbW5sYS9jbGllbnQnO1xuXG5sZXQgb3BlbkZpbGVzID0ge307XG5cbmZ1bmN0aW9uIG9wZW4oZmlsZSkge1xuXG5cdG1hbmlsYS5ub3RpZnkoJ2VkaXRvcicsIGZpbGUucGF0aCk7XG5cblx0bWFuaWxhLm5vdGlmeSgnbmF2JywgZmlsZS5wYXRoLCB0cnVlKTtcblxuXHRtYW5pbGEubm90aWZ5KCd0YWJzJywgZmlsZSwgdHJ1ZSk7XG5cblx0b3BlbkZpbGVzW2ZpbGUucGF0aF0gPSBmaWxlO1xuXG59XG5cbmZ1bmN0aW9uIGNsb3NlKGZpbGUpIHtcblxuXHRsZXQgb3Blbkxpc3Q7XG5cblx0bWFuaWxhLm5vdGlmeSgnZWRpdG9yJywgJycpO1xuXG5cdG1hbmlsYS5ub3RpZnkoJ25hdicsIGZpbGUucGF0aCwgZmFsc2UpO1xuXHRcblx0bWFuaWxhLm5vdGlmeSgndGFicycsIGZpbGUsIGZhbHNlKTtcblxuXHRkZWxldGUgb3BlbkZpbGVzW2ZpbGUucGF0aF07XG5cblx0b3Blbkxpc3QgPSBPYmplY3Qua2V5cyhvcGVuRmlsZXMpO1xuXG5cdGlmIChvcGVuTGlzdC5sZW5ndGgpIHtcblxuXHRcdG9wZW4ob3BlbkZpbGVzW29wZW5MaXN0W29wZW5MaXN0Lmxlbmd0aCAtIDFdXSk7XG5cblx0fVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcblxuXHRvcGVuOiBvcGVuLFxuXHRjbG9zZTogY2xvc2VcblxufTsiLCJsZXQgbG9hZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xvYWRlci10ZW1wbGF0ZScpLmlubmVySFRNTDtcblxuZnVuY3Rpb24gZmFkZUluKCkge1xuXG5cdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuXHRcdFxuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXInKS5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG5cblx0fSk7XG5cbn1cblxuZnVuY3Rpb24gcmVwbGFjZShodG1sKSB7XG5cblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxvYWRlcicpLm91dGVySFRNTCA9IGh0bWw7XG5cbn1cblxuZnVuY3Rpb24gYWZ0ZXIoZWwpIHtcblxuXHRpZiAodHlwZW9mIGVsID09PSAnc3RyaW5nJykge1xuXG5cdFx0ZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKTtcblxuXHR9XG5cblx0ZWwub3V0ZXJIVE1MICs9IGxvYWRlcjtcblxuXHRmYWRlSW4oKTtcblxufVxuXG5cbmZ1bmN0aW9uIGhpZGUoKSB7XG5cblx0bGV0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxvYWRlcicpO1xuXG5cdGlmIChlbCkge1xuXG5cdFx0ZWwuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpO1xuXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblxuXHRcdFx0ZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XG5cblx0XHR9LCA2MDApO1xuXG5cdH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG5cdFxuXHRyZXBsYWNlOiByZXBsYWNlLFxuXHRhZnRlcjogYWZ0ZXIsXG5cdGhpZGU6IGhpZGVcblxufTsiLCJpbXBvcnQgbmF2IGZyb20gJy4uL2NvbXBvbmVudHMvbmF2JztcbmltcG9ydCBhamF4IGZyb20gJy4uL3NyYy9hamF4JztcblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmUoKSB7XG5cblx0bGV0IGJnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJhY2tncm91bmQnKSxcblxuXHRcdGFjdGl2ZUZpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmlsZS5hY3RpdmUnKSxcblxuXHRcdHBhdGg7XG5cblx0aWYgKGFjdGl2ZUZpbGUpIHtcblxuXHRcdGJnLmNsYXNzTGlzdC5hZGQoJ2JsdXInKTtcblxuXHRcdHBhdGggPSBhY3RpdmVGaWxlLmdldEF0dHJpYnV0ZSgnZGF0YS1wYXRoJyk7XG5cblx0XHRhamF4LnBvc3QoXG5cblx0XHRcdCcvc2F2ZT9maWxlPScgKyBwYXRoLFxuXG5cdFx0XHR7XG5cdFx0XHRcdGRhdGE6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZXh0JykudmFsdWVcblx0XHRcdH0sXG5cblx0XHRcdHJlc3VsdCA9PiB7XG5cblx0XHRcdFx0aWYgKHJlc3VsdC5lcnJvcikge1xuXG5cdFx0XHRcdFx0YWxlcnQocmVzdWx0LmVycm9yKTtcblx0XHRcdFx0XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihyZXN1bHQuZXJyb3IpO1xuXHRcdFx0XHRcblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdGlmIChhY3RpdmVGaWxlLmNsYXNzTGlzdC5jb250YWlucygnbmV3JykpIHtcblxuXHRcdFx0XHRcdFx0bGV0IHNlbGVjdGVkRGlyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRpci5zZWxlY3RlZCcpO1xuXG5cdFx0XHRcdFx0XHRhY3RpdmVGaWxlLmNsYXNzTGlzdC5yZW1vdmUoJ25ldycpO1xuXG5cdFx0XHRcdFx0XHRpZiAoc2VsZWN0ZWREaXIpIHtcblxuXHRcdFx0XHRcdFx0XHRzZWxlY3RlZERpci5uZXh0RWxlbWVudFNpYmxpbmcub3V0ZXJIVE1MID0gJyc7XG5cblx0XHRcdFx0XHRcdFx0bmF2Lm5vdGlmeShzZWxlY3RlZERpciwgcGF0aCk7XG5cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdFx0bmF2LnJlaW5pdGlhbGl6ZSgpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0YmcuY2xhc3NMaXN0LnJlbW92ZSgnYmx1cicpO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0KTtcblxuXHR9XG5cbn07IiwiY29uc3QgY29tcGlsZSA9IHJlcXVpcmUoJy4vY29tcGlsZScpO1xuXG53aW5kb3cubWFuaWxhID0gd2luZG93Lm1hbmlsYSB8fCB7fTtcblxud2luZG93Lm1hbmlsYS5oYW5kbGVycyA9IHt9O1xuXG5sZXQgbGlzdGVuZXJzID0ge307XG5cbmZ1bmN0aW9uIGNvbXBvbmVudChjb21wb25lbnROYW1lLCBjb21wb25lbnQpIHtcblxuXHRsZXQgdm0gPSB3aW5kb3cubWFuaWxhLmRhdGFbY29tcG9uZW50TmFtZV0gfHwge30sXG5cblx0XHRlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWNvbXBvbmVudD1cIiR7Y29tcG9uZW50TmFtZX1cIl1gKTtcblxuXHRjb21waWxlKGAjJHtjb21wb25lbnROYW1lfS10ZW1wbGF0ZWApLnRoZW4ocmVuZGVyID0+IHtcblxuXHRcdGZ1bmN0aW9uIHJlc29sdmUoZGF0YSkge1xuXG5cdFx0XHRsZXQgaW5kZXggPSAwO1xuXG5cdFx0XHR3aW5kb3cubWFuaWxhLmhhbmRsZXJzW2NvbXBvbmVudE5hbWVdID0gW107XG5cblx0XHRcdGRhdGEub24gPSAoZXZlbnQsIGhhbmRsZXIsIC4uLmFyZ3MpID0+IHtcblxuXHRcdFx0XHRsZXQgZXZlbnRTdHJpbmc7XG5cblx0XHRcdFx0d2luZG93Lm1hbmlsYS5oYW5kbGVyc1tjb21wb25lbnROYW1lXVtpbmRleF0gPSBlID0+IHtcblxuXHRcdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0YXJncy5wdXNoKGUpO1xuXG5cdFx0XHRcdFx0aGFuZGxlci5hcHBseShkYXRhLCBhcmdzKTtcblxuXHRcdFx0XHRcdHJlc29sdmUoZGF0YSk7XG5cblx0XHRcdFx0fTtcblxuXHRcdFx0XHRldmVudFN0cmluZyA9IGBvbiR7ZXZlbnR9PW1hbmlsYS5oYW5kbGVycy4ke2NvbXBvbmVudE5hbWV9WyR7aW5kZXh9XShldmVudClgO1xuXG5cdFx0XHRcdGluZGV4Kys7XG5cblx0XHRcdFx0cmV0dXJuIGV2ZW50U3RyaW5nO1xuXG5cdFx0XHR9O1xuXG5cdFx0XHRlbC5pbm5lckhUTUwgPSByZW5kZXIoZGF0YSk7XG5cblx0XHR9XG5cblx0XHR2bS5yZW5kZXIgPSAoKSA9PiB7XG5cblx0XHRcdHJlc29sdmUodm0pO1xuXHRcdFx0XG5cdFx0fTtcblxuXHRcdGxldCBsaXN0ZW5lciA9IGNvbXBvbmVudCh2bSk7XG5cblx0XHRsaXN0ZW5lcnNbY29tcG9uZW50TmFtZV0gPSAoLi4uYXJncykgPT4ge1xuXHRcdFx0XG5cdFx0XHRsaXN0ZW5lci5hcHBseSh2bSwgYXJncyk7XG5cblx0XHRcdHJlc29sdmUodm0pO1xuXG5cdFx0fTtcblxuXHRcdHJlc29sdmUodm0pO1xuXG5cdH0pO1xuXG59XG5cbmZ1bmN0aW9uIG5vdGlmeShjb21wb25lbnROYW1lLCAuLi5hcmdzKSB7XG5cblx0bGlzdGVuZXJzW2NvbXBvbmVudE5hbWVdLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG5cbn1cblxud2luZG93Lm1hbmlsYS5jb21wb25lbnQgPSBjb21wb25lbnQ7XG53aW5kb3cubWFuaWxhLm5vdGlmeSA9IG5vdGlmeTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGNvbXBvbmVudDogY29tcG9uZW50LFxuXHRub3RpZnk6IG5vdGlmeVxufTtcbiIsImNvbnN0IG1hbmlsYSA9IHJlcXVpcmUoJ21hbmlsYS9wYXJzZScpO1xuXG5sZXQgY2FjaGUgPSB7fSxcblxuXHRlc2NhcGVNYXAgPSB7XG4gICAgICAgICc8JzogJyZsdDsnLFxuICAgICAgICAnPic6ICcmZ3Q7JyxcbiAgICAgICAgJ1wiJzogJyZxdW90OycsXG4gICAgICAgICdcXCcnOiAnJmFwb3M7J1xuICAgIH07XG5cbmZ1bmN0aW9uIGh0bWxFc2NhcGUoc3RyKSB7XG5cbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1smPD4nXCJdL2csIGMgPT4ge1xuXG4gICAgICAgIHJldHVybiBlc2NhcGVNYXBbY107XG5cbiAgICB9KTtcblxufVxuXG53aW5kb3cubWFuaWxhID0gd2luZG93Lm1hbmlsYSB8fCB7fTtcblxud2luZG93Lm1hbmlsYS5lID0gZnVuY3Rpb24odmFsKSB7XG5cbiAgICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgPyBodG1sRXNjYXBlKHZhbCkgOiB2YWw7XG4gICAgXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbXBpbGUoc2VsZWN0b3IpIHtcblxuXHRyZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG5cblx0XHRpZiAoIXNlbGVjdG9yKSB7XG5cblx0XHRcdHJlc29sdmUoICgpPT57fSApO1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0aWYgKGNhY2hlW3NlbGVjdG9yXSkge1xuXG5cdFx0XHRcdHJlc29sdmUoY2FjaGVbc2VsZWN0b3JdKTtcblxuXHRcdFx0fVxuXG5cdFx0XHRjYWNoZVtzZWxlY3Rvcl0gPSBtYW5pbGEoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikuaW5uZXJIVE1MKTtcblxuXHRcdFx0cmVzb2x2ZShjYWNoZVtzZWxlY3Rvcl0pO1xuXG5cdFx0fVxuXG5cdH0pO1xuXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRlbXBsYXRlKSB7XG5cbiAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKCdjb250ZXh0JyxcblxuICAgICAgICBcInZhciBwPVtdO3dpdGgoY29udGV4dCl7cC5wdXNoKGBcIiArXG4gICAgICAgXG4gICAgICAgIHRlbXBsYXRlXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxcXCcvZywgXCJcXFxcXFxcXCdcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC9gL2csIFwiXFxcXGBcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC88LS0oPyFcXHMqfS4qPy0tPikoPyEuKntcXHMqLS0+KSguKj8pLS0+L2csIFwiYCk7dHJ5e3AucHVzaCgkMSl9Y2F0Y2goZSl7fXAucHVzaChgXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvPC0tXFxzKiguKj8pXFxzKi0tPi9nLCBcImApOyQxXFxucC5wdXNoKGBcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC88LSg/IVxccyp9Lio/LT4pKD8hLip7XFxzKi0+KSguKj8pLT4vZywgXCJgKTt0cnl7cC5wdXNoKG1hbmlsYS5lKCQxKSl9Y2F0Y2goZSl7fXAucHVzaChgXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvPC1cXHMqKC4qPylcXHMqLT4vZywgXCJgKTskMVxcbnAucHVzaChgXCIpXG5cbiAgICAgICsgXCJgKTt9cmV0dXJuIHAuam9pbignJyk7XCIpO1xufTsiXX0=
