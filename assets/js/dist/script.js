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

var _contextMenu = require('./components/contextMenu');

var _contextMenu2 = _interopRequireDefault(_contextMenu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./components/contextMenu":2,"./components/editor":3,"./components/nav":4,"./components/tabs":5,"./src/addKeyboardShortcuts":6}],2:[function(require,module,exports){
'use strict';

var _client = require('mnla/client');

var _client2 = _interopRequireDefault(_client);

var _ajax = require('../src/ajax');

var _ajax2 = _interopRequireDefault(_ajax);

var _fileManager = require('../src/fileManager');

var _fileManager2 = _interopRequireDefault(_fileManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var current = void 0;

_client2.default.component('contextMenu', function (vm) {

	vm.file = true;

	function open(item, e) {

		e.preventDefault();

		current = item;

		vm.left = e.clientX;

		vm.top = e.clientY;

		vm.visible = true;
	}

	document.addEventListener('click', function () {

		if (vm.visible) {

			vm.visible = false;

			vm.render();
		}
	});

	vm.rename = function () {

		vm.visible = false;

		vm.render();

		var name = prompt('New name:');

		if (name) {

			_ajax2.default.post('/rename?path=' + current.path, {
				name: name
			}, function (result) {

				if (result.error) {

					alert(result.error);

					console.error(result.error);
				} else {

					vm.render();

					_fileManager2.default.close(current);

					current.name = name;

					current.path = result.data;

					_fileManager2.default.open(current);
				}
			});
		}
	};

	vm.deletePath = function () {

		vm.visible = false;

		_ajax2.default.post('/delete?path=' + current.path, function (result) {

			if (result.error) {

				alert(result.error);

				console.error(result.error);
			} else {

				if (vm.file) {

					_fileManager2.default.close(current);
				}

				current.deleted = true;

				_client2.default.components.nav.render();
			}
		});
	};

	vm.newFile = function () {

		vm.visible = false;

		vm.render();

		var name = prompt('File name:');

		_ajax2.default.post('/new-file?path=' + current.path, {
			name: name
		}, function (result) {

			if (result.error) {

				alert(result.error);

				console.error(result.error);
			} else {

				current.children = current.children || { files: [] };

				current.children.files.push({
					name: name,
					path: result.data
				});

				_client2.default.components.nav.render();
			}
		});
	};

	vm.newDir = function () {

		vm.visible = false;

		vm.render();

		var name = prompt('Folder name:');

		_ajax2.default.post('/new-dir?path=' + current.path, {
			name: name
		}, function (result) {

			if (result.error) {

				alert(result.error);

				console.error(result.error);
			} else {

				current.children = current.children || { dirs: [] };

				current.children.dirs.push({
					name: name,
					path: result.data
				});

				_client2.default.components.nav.render();
			}
		});
	};

	return {

		rightClickDir: function rightClickDir(dir, e) {

			vm.file = false;

			open(dir, e);
		},

		rightClickFile: function rightClickFile(file, e) {

			vm.file = true;

			open(file, e);
		}

	};
});

},{"../src/ajax":7,"../src/fileManager":8,"mnla/client":11}],3:[function(require,module,exports){
'use strict';

var _loader = require('../src/loader');

var _loader2 = _interopRequireDefault(_loader);

var _ajax = require('../src/ajax');

var _ajax2 = _interopRequireDefault(_ajax);

var _client = require('mnla/client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function resetHeight(e) {

	var el = document.querySelector('.text'),
	    numbers = document.querySelector('.numbers'),
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
}

_client2.default.component('editor', function (vm) {

	vm.resetHeight = resetHeight;

	function showText(text) {

		vm.text = text;

		_loader2.default.hide();

		vm.render();
	}

	return {

		update: function update(path) {

			_loader2.default.after('.overlay');

			if (path) {

				_ajax2.default.get('/open?file=' + path, function (data) {

					showText(data.data);

					vm.resetHeight();
				});
			} else {

				showText('');

				vm.resetHeight();
			}
		}

	};
});

},{"../src/ajax":7,"../src/loader":9,"mnla/client":11}],4:[function(require,module,exports){
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

	vm.rightClickDir = function (dir, e) {

		_client2.default.components.contextMenu.rightClickDir(dir, e);
	};

	vm.rightClickFile = function (file, e) {

		_client2.default.components.contextMenu.rightClickFile(file, e);
	};

	return {

		update: function update(path, open) {

			if (open) {

				vm.open[path] = path;

				vm.active = path;
			} else {

				delete vm.open[path];
			}
		},

		getActiveFile: function getActiveFile() {

			return vm.active;
		},

		render: function render() {

			vm.render();
		}

	};
});

},{"../src/ajax":7,"../src/fileManager":8,"mnla/client":11}],5:[function(require,module,exports){
'use strict';

var _fileManager = require('../src/fileManager');

var _fileManager2 = _interopRequireDefault(_fileManager);

var _client = require('mnla/client');

var _client2 = _interopRequireDefault(_client);

var _save = require('../src/save');

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

	return {

		update: function update(file, open) {

			if (open) {

				vm.active = file.path;

				vm.tabs[file.path] = file.name;
			} else {

				delete vm.tabs[file.path];
			}
		}

	};
});

},{"../src/fileManager":8,"../src/save":10,"mnla/client":11}],6:[function(require,module,exports){
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

},{"./save":10}],7:[function(require,module,exports){
'use strict';

function serialize(data) {

  var parts = [];

  for (var key in data) {

    parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
  }

  return parts.join('&');
}

function get(path, data, callback) {

  if (typeof data === 'function') {

    callback = data;
  }

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

  if (typeof data === 'function') {

    callback = data;
  }

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

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _client = require('mnla/client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var openFiles = {};

function open(file) {

	_client2.default.components.editor.update(file.path);

	_client2.default.components.nav.update(file.path, true);

	_client2.default.components.tabs.update(file, true);

	openFiles[file.path] = file;
}

function close(file) {

	var openList = void 0;

	_client2.default.components.editor.update('');

	_client2.default.components.nav.update(file.path, false);

	_client2.default.components.tabs.update(file, false);

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

},{"mnla/client":11}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.save = save;

var _client = require('mnla/client');

var _client2 = _interopRequireDefault(_client);

var _ajax = require('../src/ajax');

var _ajax2 = _interopRequireDefault(_ajax);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bg = document.querySelector('.background');

function save() {

	var file = _client2.default.components.nav.getActiveFile();

	if (file) {

		bg.classList.add('blur');

		_ajax2.default.post('/save?file=' + file, {
			data: document.querySelector('.text').value
		}, function (result) {

			if (result.error) {

				alert(result.error);

				console.error(result.error);
			} else {

				bg.classList.remove('blur');
			}
		});
	}
};

},{"../src/ajax":7,"mnla/client":11}],11:[function(require,module,exports){
'use strict';

var compile = require('./compile');

window.manila = window.manila || {};

window.manila.handlers = {};

var components = {},
    selection = void 0;

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

					if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {

						resolve(data);
					}
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

		var methods = component(vm);

		if (methods) {

			components[componentName] = {};

			Object.keys(methods).forEach(function (key) {

				components[componentName][key] = function () {
					for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
						args[_key2] = arguments[_key2];
					}

					var result = methods[key].apply(vm, args);

					resolve(vm);

					return result;
				};
			});
		}

		resolve(vm);
	});

	return window.manila;
}

window.manila.component = component;
window.manila.components = components;

module.exports = {
	component: component,
	components: components
};

},{"./compile":12}],12:[function(require,module,exports){
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

},{"manila/parse":13}],13:[function(require,module,exports){
'use strict';

module.exports = function (template) {

    return new Function('context', "var p=[];with(context){p.push(`" + template.replace(/\\'/g, "\\\\'").replace(/`/g, "\\`").replace(/<::(?!\s*}.*?::>)(?!.*{\s*::>)(.*?)::>/g, "`);try{p.push($1)}catch(e){}p.push(`").replace(/<::\s*(.*?)\s*::>/g, "`);$1\np.push(`").replace(/<:(?!\s*}.*?:>)(?!.*{\s*:>)(.*?):>/g, "`);try{p.push(manila.e($1))}catch(e){}p.push(`").replace(/<:\s*(.*?)\s*:>/g, "`);$1\np.push(`") + "`);}return p.join('');");
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvYXBwLmpzIiwiYXNzZXRzL2pzL2NvbXBvbmVudHMvY29udGV4dE1lbnUuanMiLCJhc3NldHMvanMvY29tcG9uZW50cy9lZGl0b3IuanMiLCJhc3NldHMvanMvY29tcG9uZW50cy9uYXYuanMiLCJhc3NldHMvanMvY29tcG9uZW50cy90YWJzLmpzIiwiYXNzZXRzL2pzL3NyYy9hZGRLZXlib2FyZFNob3J0Y3V0cy5qcyIsImFzc2V0cy9qcy9zcmMvYWpheC5qcyIsImFzc2V0cy9qcy9zcmMvZmlsZU1hbmFnZXIuanMiLCJhc3NldHMvanMvc3JjL2xvYWRlci5qcyIsImFzc2V0cy9qcy9zcmMvc2F2ZS5qcyIsIi4uL21ubGEvY2xpZW50LmpzIiwiLi4vbW5sYS9jb21waWxlLmpzIiwiLi4vbW5sYS9ub2RlX21vZHVsZXMvbWFuaWxhL3BhcnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7QUNKQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQUksZ0JBQUo7O0FBRUEsaUJBQU8sU0FBUCxDQUFpQixhQUFqQixFQUFnQyxjQUFNOztBQUVyQyxJQUFHLElBQUgsR0FBVSxJQUFWLENBRnFDOztBQUlyQyxVQUFTLElBQVQsQ0FBYyxJQUFkLEVBQW9CLENBQXBCLEVBQXVCOztBQUV0QixJQUFFLGNBQUYsR0FGc0I7O0FBSXRCLFlBQVUsSUFBVixDQUpzQjs7QUFNdEIsS0FBRyxJQUFILEdBQVUsRUFBRSxPQUFGLENBTlk7O0FBUXRCLEtBQUcsR0FBSCxHQUFTLEVBQUUsT0FBRixDQVJhOztBQVV0QixLQUFHLE9BQUgsR0FBYSxJQUFiLENBVnNCO0VBQXZCOztBQWNBLFVBQVMsZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUMsWUFBTTs7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QU8sT0FBUCxHQUFpQixVQUFTLFFBQVQsRUFBbUI7O0FBRWhDLFdBQU8sSUFBSSxRQUFKLENBQWEsU0FBYixFQUVILG9DQUVBLFNBQ0ssT0FETCxDQUNhLE1BRGIsRUFDcUIsT0FEckIsRUFFSyxPQUZMLENBRWEsSUFGYixFQUVtQixLQUZuQixFQUdLLE9BSEwsQ0FHYSx5Q0FIYixFQUd3RCxzQ0FIeEQsRUFJSyxPQUpMLENBSWEsb0JBSmIsRUFJbUMsaUJBSm5DLEVBS0ssT0FMTCxDQUthLHFDQUxiLEVBS29ELGdEQUxwRCxFQU1LLE9BTkwsQ0FNYSxrQkFOYixFQU1pQyxpQkFOakMsQ0FGQSxHQVVBLHdCQVZBLENBRkosQ0FGZ0M7Q0FBbkIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IGFkZEtleWJvYXJkU2hvcnRjdXRzIGZyb20gJy4vc3JjL2FkZEtleWJvYXJkU2hvcnRjdXRzJztcbmltcG9ydCBuYXYgZnJvbSAnLi9jb21wb25lbnRzL25hdic7XG5pbXBvcnQgZWRpdG9yIGZyb20gJy4vY29tcG9uZW50cy9lZGl0b3InO1xuaW1wb3J0IHRhYnMgZnJvbSAnLi9jb21wb25lbnRzL3RhYnMnO1xuaW1wb3J0IGNvbnRleHRNZW51IGZyb20gJy4vY29tcG9uZW50cy9jb250ZXh0TWVudSc7XG4iLCJpbXBvcnQgbWFuaWxhIGZyb20gJ21ubGEvY2xpZW50JztcbmltcG9ydCBhamF4IGZyb20gJy4uL3NyYy9hamF4JztcbmltcG9ydCBmaWxlTWFuYWdlciBmcm9tICcuLi9zcmMvZmlsZU1hbmFnZXInO1xuXG5sZXQgY3VycmVudDtcblxubWFuaWxhLmNvbXBvbmVudCgnY29udGV4dE1lbnUnLCB2bSA9PiB7XG5cblx0dm0uZmlsZSA9IHRydWU7XG5cblx0ZnVuY3Rpb24gb3BlbihpdGVtLCBlKSB7XG5cblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjdXJyZW50ID0gaXRlbTtcblxuXHRcdHZtLmxlZnQgPSBlLmNsaWVudFg7XG5cblx0XHR2bS50b3AgPSBlLmNsaWVudFk7XG5cblx0XHR2bS52aXNpYmxlID0gdHJ1ZTtcblxuXHR9XG5cblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cblx0XHRpZiAodm0udmlzaWJsZSkge1xuXG5cdFx0XHR2bS52aXNpYmxlID0gZmFsc2U7XG5cblx0XHRcdHZtLnJlbmRlcigpO1xuXG5cdFx0fVxuXG5cdH0pO1xuXG5cdHZtLnJlbmFtZSA9ICgpID0+IHtcblxuXHRcdHZtLnZpc2libGUgPSBmYWxzZTtcblxuXHRcdHZtLnJlbmRlcigpO1xuXG5cdFx0bGV0IG5hbWUgPSBwcm9tcHQoJ05ldyBuYW1lOicpO1xuXG5cdFx0aWYgKG5hbWUpIHtcblxuXHRcdFx0YWpheC5wb3N0KFxuXG5cdFx0XHRcdCcvcmVuYW1lP3BhdGg9JyArIGN1cnJlbnQucGF0aCxcblxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bmFtZTogbmFtZVxuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdHJlc3VsdCA9PiB7XG5cblx0XHRcdFx0XHRpZiAocmVzdWx0LmVycm9yKSB7XG5cblx0XHRcdFx0XHRcdGFsZXJ0KHJlc3VsdC5lcnJvcik7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKHJlc3VsdC5lcnJvcik7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdFx0dm0ucmVuZGVyKCk7XG5cblx0XHRcdFx0XHRcdGZpbGVNYW5hZ2VyLmNsb3NlKGN1cnJlbnQpO1xuXG5cdFx0XHRcdFx0XHRjdXJyZW50Lm5hbWUgPSBuYW1lO1xuXG5cdFx0XHRcdFx0XHRjdXJyZW50LnBhdGggPSByZXN1bHQuZGF0YTtcblxuXHRcdFx0XHRcdFx0ZmlsZU1hbmFnZXIub3BlbihjdXJyZW50KTtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0KTtcblxuXHRcdH1cblxuXHR9O1xuXG5cdHZtLmRlbGV0ZVBhdGggPSAoKSA9PiB7XG5cblx0XHR2bS52aXNpYmxlID0gZmFsc2U7XG5cblx0XHRhamF4LnBvc3QoXG5cblx0XHRcdCcvZGVsZXRlP3BhdGg9JyArIGN1cnJlbnQucGF0aCxcblxuXHRcdFx0cmVzdWx0ID0+IHtcblxuXHRcdFx0XHRpZiAocmVzdWx0LmVycm9yKSB7XG5cblx0XHRcdFx0XHRhbGVydChyZXN1bHQuZXJyb3IpO1xuXHRcdFx0XHRcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKHJlc3VsdC5lcnJvcik7XG5cdFx0XHRcdFxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0aWYgKHZtLmZpbGUpIHtcblxuXHRcdFx0XHRcdFx0ZmlsZU1hbmFnZXIuY2xvc2UoY3VycmVudCk7XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjdXJyZW50LmRlbGV0ZWQgPSB0cnVlO1xuXG5cdFx0XHRcdFx0bWFuaWxhLmNvbXBvbmVudHMubmF2LnJlbmRlcigpO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0KTtcblxuXHR9O1xuXG5cdHZtLm5ld0ZpbGUgPSAoKSA9PiB7XG5cblx0XHR2bS52aXNpYmxlID0gZmFsc2U7XG5cblx0XHR2bS5yZW5kZXIoKTtcblxuXHRcdGxldCBuYW1lID0gcHJvbXB0KCdGaWxlIG5hbWU6Jyk7XG5cblx0XHRhamF4LnBvc3QoXG5cblx0XHRcdCcvbmV3LWZpbGU/cGF0aD0nICsgY3VycmVudC5wYXRoLFxuXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6IG5hbWVcblx0XHRcdH0sXG5cblx0XHRcdHJlc3VsdCA9PiB7XG5cblx0XHRcdFx0aWYgKHJlc3VsdC5lcnJvcikge1xuXG5cdFx0XHRcdFx0YWxlcnQocmVzdWx0LmVycm9yKTtcblx0XHRcdFx0XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihyZXN1bHQuZXJyb3IpO1xuXHRcdFx0XHRcblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdGN1cnJlbnQuY2hpbGRyZW4gPSBjdXJyZW50LmNoaWxkcmVuIHx8IHsgZmlsZXM6W10gfTtcblxuXHRcdFx0XHRcdGN1cnJlbnQuY2hpbGRyZW4uZmlsZXMucHVzaCh7XG5cdFx0XHRcdFx0XHRuYW1lOiBuYW1lLFxuXHRcdFx0XHRcdFx0cGF0aDogcmVzdWx0LmRhdGFcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdG1hbmlsYS5jb21wb25lbnRzLm5hdi5yZW5kZXIoKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHRcdFxuXHRcdCk7XG5cblx0fTtcblxuXHR2bS5uZXdEaXIgPSAoKSA9PiB7XG5cblx0XHR2bS52aXNpYmxlID0gZmFsc2U7XG5cblx0XHR2bS5yZW5kZXIoKTtcblxuXHRcdGxldCBuYW1lID0gcHJvbXB0KCdGb2xkZXIgbmFtZTonKTtcblxuXHRcdGFqYXgucG9zdChcblxuXHRcdFx0Jy9uZXctZGlyP3BhdGg9JyArIGN1cnJlbnQucGF0aCxcblxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiBuYW1lXG5cdFx0XHR9LFxuXG5cdFx0XHRyZXN1bHQgPT4ge1xuXG5cdFx0XHRcdGlmIChyZXN1bHQuZXJyb3IpIHtcblxuXHRcdFx0XHRcdGFsZXJ0KHJlc3VsdC5lcnJvcik7XG5cdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IocmVzdWx0LmVycm9yKTtcblx0XHRcdFx0XG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRjdXJyZW50LmNoaWxkcmVuID0gY3VycmVudC5jaGlsZHJlbiB8fCB7IGRpcnM6W10gfTtcblxuXHRcdFx0XHRcdGN1cnJlbnQuY2hpbGRyZW4uZGlycy5wdXNoKHtcblx0XHRcdFx0XHRcdG5hbWU6IG5hbWUsXG5cdFx0XHRcdFx0XHRwYXRoOiByZXN1bHQuZGF0YVxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0bWFuaWxhLmNvbXBvbmVudHMubmF2LnJlbmRlcigpO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0KTtcblxuXHR9O1xuXG5cdHJldHVybiB7XG5cblx0XHRyaWdodENsaWNrRGlyOiAoZGlyLCBlKSA9PiB7XG5cblx0XHRcdHZtLmZpbGUgPSBmYWxzZTtcblxuXHRcdFx0b3BlbihkaXIsIGUpO1xuXG5cdFx0fSxcblxuXHRcdHJpZ2h0Q2xpY2tGaWxlOiAoZmlsZSwgZSkgPT4ge1xuXG5cdFx0XHR2bS5maWxlID0gdHJ1ZTtcblxuXHRcdFx0b3BlbihmaWxlLCBlKVxuXG5cdFx0fVxuXG5cdH1cblxufSk7XG4iLCJpbXBvcnQgbG9hZGVyIGZyb20gJy4uL3NyYy9sb2FkZXInO1xuaW1wb3J0IGFqYXggZnJvbSAnLi4vc3JjL2FqYXgnO1xuaW1wb3J0IG1hbmlsYSBmcm9tICdtbmxhL2NsaWVudCc7XG5cbmZ1bmN0aW9uIHJlc2V0SGVpZ2h0KGUpIHtcblxuXHRsZXQgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGV4dCcpLFxuXG5cdFx0bnVtYmVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5udW1iZXJzJyksXG5cblx0XHRoZWlnaHQ7XG5cblx0ZWwuc3R5bGUuaGVpZ2h0ID0gJyc7XG5cblx0aGVpZ2h0ID0gZWwuc2Nyb2xsSGVpZ2h0O1xuXG5cdG51bWJlcnMuc3R5bGUuaGVpZ2h0ID0gJyc7XG5cblx0aWYgKG51bWJlcnMuY2xpZW50SGVpZ2h0IDwgaGVpZ2h0KSB7XG5cblx0XHR3aGlsZSAobnVtYmVycy5jbGllbnRIZWlnaHQgPCBoZWlnaHQpIHtcblxuXHRcdFx0bnVtYmVycy5pbm5lckhUTUwgKz0gJzxkaXYgY2xhc3M9XCJudW1cIj48L2Rpdj4nO1xuXG5cdFx0fVxuXG5cdH0gZWxzZSB7XG5cblx0XHRudW1iZXJzLnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCc7XG5cblx0fVxuXG5cdGVsLnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCc7XG5cbn1cblxubWFuaWxhLmNvbXBvbmVudCgnZWRpdG9yJywgdm0gPT4ge1xuXG5cdHZtLnJlc2V0SGVpZ2h0ID0gcmVzZXRIZWlnaHQ7XG5cblx0ZnVuY3Rpb24gc2hvd1RleHQodGV4dCkge1xuXG5cdFx0dm0udGV4dCA9IHRleHQ7XG5cblx0XHRsb2FkZXIuaGlkZSgpO1xuXG5cdFx0dm0ucmVuZGVyKCk7XG5cblx0fVxuXG5cdHJldHVybiB7XG5cblx0XHR1cGRhdGU6IHBhdGggPT4ge1xuXG5cdFx0XHRsb2FkZXIuYWZ0ZXIoJy5vdmVybGF5Jyk7XG5cblx0XHRcdGlmIChwYXRoKSB7XG5cblx0XHRcdFx0YWpheC5nZXQoJy9vcGVuP2ZpbGU9JyArIHBhdGgsIGRhdGEgPT4ge1xuXG5cdFx0XHRcdFx0c2hvd1RleHQoZGF0YS5kYXRhKTtcblxuXHRcdFx0XHRcdHZtLnJlc2V0SGVpZ2h0KCk7XG5cblx0XHRcdFx0fSk7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0c2hvd1RleHQoJycpO1xuXG5cdFx0XHRcdHZtLnJlc2V0SGVpZ2h0KCk7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9O1xuXG59KTtcbiIsImltcG9ydCBmaWxlTWFuYWdlciBmcm9tICcuLi9zcmMvZmlsZU1hbmFnZXInO1xuaW1wb3J0IGFqYXggZnJvbSAnLi4vc3JjL2FqYXgnO1xuaW1wb3J0IG1hbmlsYSBmcm9tICdtbmxhL2NsaWVudCc7XG5cbm1hbmlsYS5jb21wb25lbnQoJ25hdicsIHZtID0+IHtcblxuXHR2bS5vcGVuID0ge307XG5cblx0dm0uY2xpY2tEaXIgPSBkaXIgPT4ge1xuXG5cdFx0ZGlyLm9wZW4gPSAhZGlyLm9wZW47XG5cblx0XHRpZiAoIWRpci5jaGlsZHJlbikge1xuXG5cdFx0XHRhamF4LmdldCgnL25hdj9wYXRoPScgKyBkaXIucGF0aCwgZGF0YSA9PiB7XG5cblx0XHRcdFx0ZGlyLmNoaWxkcmVuID0gZGF0YS5kaXI7XG5cblx0XHRcdFx0dm0ucmVuZGVyKCk7XG5cblx0XHRcdH0pO1xuXG5cdFx0fVxuXG5cdH07XG5cblx0dm0uY2xpY2tGaWxlID0gZmlsZSA9PiB7XG5cblx0XHRmaWxlTWFuYWdlci5vcGVuKGZpbGUpO1xuXG5cdH07XG5cblx0dm0ucmlnaHRDbGlja0RpciA9IChkaXIsIGUpID0+IHtcblx0XG5cdFx0bWFuaWxhLmNvbXBvbmVudHMuY29udGV4dE1lbnUucmlnaHRDbGlja0RpcihkaXIsIGUpO1xuXG5cdH07XG5cblx0dm0ucmlnaHRDbGlja0ZpbGUgPSAoZmlsZSwgZSkgPT4ge1xuXHRcblx0XHRtYW5pbGEuY29tcG9uZW50cy5jb250ZXh0TWVudS5yaWdodENsaWNrRmlsZShmaWxlLCBlKTtcblxuXHR9O1xuXG5cdHJldHVybiB7XG5cblx0XHR1cGRhdGU6IChwYXRoLCBvcGVuKSA9PiB7XG5cblx0XHRcdGlmIChvcGVuKSB7XG5cblx0XHRcdFx0dm0ub3BlbltwYXRoXSA9IHBhdGg7XG5cblx0XHRcdFx0dm0uYWN0aXZlID0gcGF0aDtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRkZWxldGUgdm0ub3BlbltwYXRoXTtcblxuXHRcdFx0fVxuXG5cdFx0fSxcblxuXHRcdGdldEFjdGl2ZUZpbGU6ICgpID0+IHtcblxuXHRcdFx0cmV0dXJuIHZtLmFjdGl2ZTtcblxuXHRcdH0sXG5cblx0XHRyZW5kZXI6ICgpID0+IHtcblxuXHRcdFx0dm0ucmVuZGVyKCk7XG5cblx0XHR9XG5cblx0fTtcblxufSk7XG4iLCJpbXBvcnQgZmlsZU1hbmFnZXIgZnJvbSAnLi4vc3JjL2ZpbGVNYW5hZ2VyJztcbmltcG9ydCBtYW5pbGEgZnJvbSAnbW5sYS9jbGllbnQnO1xuaW1wb3J0IHsgc2F2ZSB9IGZyb20gJy4uL3NyYy9zYXZlJztcblxubWFuaWxhLmNvbXBvbmVudCgndGFicycsIHZtID0+IHtcblxuXHR2bS50YWJzID0ge307XG5cblx0dm0uY2xvc2UgPSBwYXRoID0+IHtcblxuXHRcdGRlbGV0ZSB2bS50YWJzW3BhdGhdO1xuXG5cdFx0ZmlsZU1hbmFnZXIuY2xvc2Uoe1xuXHRcdFx0cGF0aDogcGF0aCxcblx0XHRcdG5hbWU6IHZtLnRhYnNbcGF0aF1cblx0XHR9KTtcblxuXHR9O1xuXG5cdHZtLm9wZW4gPSBwYXRoID0+IHtcblxuXHRcdGZpbGVNYW5hZ2VyLm9wZW4oe1xuXHRcdFx0cGF0aDogcGF0aCxcblx0XHRcdG5hbWU6IHZtLnRhYnNbcGF0aF1cblx0XHR9KTtcblxuXHR9O1xuXG5cdHJldHVybiB7XG5cblx0XHR1cGRhdGU6IChmaWxlLCBvcGVuKSA9PiB7XG5cblx0XHRcdGlmIChvcGVuKSB7XG5cblx0XHRcdFx0dm0uYWN0aXZlID0gZmlsZS5wYXRoO1xuXG5cdFx0XHRcdHZtLnRhYnNbZmlsZS5wYXRoXSA9IGZpbGUubmFtZTtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRkZWxldGUgdm0udGFic1tmaWxlLnBhdGhdO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fTtcblxufSk7XG4iLCJpbXBvcnQgeyBzYXZlIH0gZnJvbSAnLi9zYXZlJztcblxuY29uc3Qga2V5bWFwID0ge1xuXG5cdFx0OTE6IHtcblx0XHRcdGNhbGxiYWNrOiBzYXZlLFxuXHRcdFx0cGFpcjogODMgXG5cdFx0fSxcblxuXHRcdDgzOiB7XG5cdFx0XHRjYWxsYmFjazogc2F2ZSxcblx0XHRcdHBhaXI6IDkxXG5cdFx0fVxuXG5cdH07XG5cbmxldCBwcmVzc2VkID0geyB9O1xuXG5cbmZ1bmN0aW9uIGtleWRvd24oZSkge1xuXG5cdGxldCBjb2RlID0gZS5rZXlDb2RlIHx8IGUud2hpY2gsXG5cblx0XHRrZXkgPSBrZXltYXBbY29kZV07XG5cblx0aWYgKGtleSkge1xuXG5cdFx0cHJlc3NlZFtjb2RlXSA9IHRydWU7XG5cblx0XHRpZiAocHJlc3NlZFtrZXkucGFpcl0pIHtcblxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRrZXkuY2FsbGJhY2soKTtcblxuXHRcdFx0ZGVsZXRlIHByZXNzZWRbY29kZV07XG5cdFx0XHRkZWxldGUgcHJlc3NlZFtrZXkucGFpcl07XG5cblx0XHR9XG5cblx0fVxuXG59XG5cblxuZnVuY3Rpb24ga2V5dXAoZSkge1xuXG5cdGRlbGV0ZSBwcmVzc2VkW2Uua2V5Q29kZSB8fCBlLndoaWNoXTtcblxufVxuXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBrZXlkb3duKTtcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywga2V5dXApO1xuIiwiZnVuY3Rpb24gc2VyaWFsaXplKGRhdGEpIHtcbiBcbiBcdGxldCBwYXJ0cyA9IFtdO1xuIFxuIFx0Zm9yIChsZXQga2V5IGluIGRhdGEpIHtcbiBcbiBcdFx0cGFydHMucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KGRhdGFba2V5XSkpO1xuXG4gXHR9XG4gXG4gXHRyZXR1cm4gcGFydHMuam9pbignJicpO1xufVxuIFxuZnVuY3Rpb24gZ2V0KHBhdGgsIGRhdGEsIGNhbGxiYWNrKSB7XG5cblx0aWYgKHR5cGVvZiBkYXRhID09PSAnZnVuY3Rpb24nKSB7XG5cblx0XHRjYWxsYmFjayA9IGRhdGE7XG5cblx0fVxuIFxuIFx0bGV0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuIFxuIFx0aWYgKHR5cGVvZiBkYXRhID09PSAnZnVuY3Rpb24nKSB7XG4gXG4gXHRcdGNhbGxiYWNrID0gZGF0YTtcbiBcbiBcdFx0ZGF0YSA9IHt9O1xuXG4gXHR9XG4gXG4gXHRyZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuIFxuIFx0XHRpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCAmJiByZXEuc3RhdHVzID09IDIwMCkge1xuIFxuIFx0XHRcdGxldCByZXN1bHQgPSB2b2lkIDA7XG4gXG4gXHRcdFx0dHJ5IHtcbiBcbiBcdFx0XHRcdHJlc3VsdCA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG5cbiBcdFx0XHR9IGNhdGNoIChlcnIpIHtcbiBcbiBcdFx0XHRcdHJlc3VsdCA9IHJlcS5yZXNwb25zZVRleHQ7XG5cbiBcdFx0XHR9XG4gXG4gXHRcdFx0Y2FsbGJhY2socmVzdWx0KTtcbiBcdFx0fVxuXG4gXHR9O1xuIFxuIFx0cmVxLm9wZW4oJ0dFVCcsIHBhdGgpO1xuIFxuIFx0cmVxLnNlbmQoc2VyaWFsaXplKGRhdGEpKTtcblxufVxuIFxuZnVuY3Rpb24gcG9zdChwYXRoLCBkYXRhLCBjYWxsYmFjaykge1xuXG5cdGlmICh0eXBlb2YgZGF0YSA9PT0gJ2Z1bmN0aW9uJykge1xuXG5cdFx0Y2FsbGJhY2sgPSBkYXRhO1xuXG5cdH1cbiBcbiBcdGxldCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiBcbiBcdHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gXG4gXHRcdGlmIChyZXEucmVhZHlTdGF0ZSA9PSA0ICYmIHJlcS5zdGF0dXMgPT0gMjAwKSB7XG4gXG4gXHRcdFx0bGV0IGpzb24gPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuIFxuIFx0XHRcdGlmIChqc29uKSB7XG4gXG4gXHRcdFx0XHRjYWxsYmFjayhqc29uKTtcblxuIFx0XHRcdH0gZWxzZSB7XG4gXG4gXHRcdFx0XHRjYWxsYmFjayhyZXEucmVzcG9uc2VUZXh0KTtcblxuIFx0XHRcdH1cblxuIFx0XHR9XG5cbiBcdH07XG4gXG4gXHRyZXEub3BlbignUE9TVCcsIHBhdGgpO1xuIFxuIFx0cmVxLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcbiBcbiBcdHJlcS5zZW5kKHNlcmlhbGl6ZShkYXRhKSk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiBcdGdldDogZ2V0LFxuIFx0cG9zdDogcG9zdFxuIFxufTtcbiIsImltcG9ydCBtYW5pbGEgZnJvbSAnbW5sYS9jbGllbnQnO1xuXG5sZXQgb3BlbkZpbGVzID0ge307XG5cbmZ1bmN0aW9uIG9wZW4oZmlsZSkge1xuXG5cdG1hbmlsYS5jb21wb25lbnRzLmVkaXRvci51cGRhdGUoZmlsZS5wYXRoKTtcblxuXHRtYW5pbGEuY29tcG9uZW50cy5uYXYudXBkYXRlKGZpbGUucGF0aCwgdHJ1ZSk7XG5cblx0bWFuaWxhLmNvbXBvbmVudHMudGFicy51cGRhdGUoZmlsZSwgdHJ1ZSk7XG5cblx0b3BlbkZpbGVzW2ZpbGUucGF0aF0gPSBmaWxlO1xuXG59XG5cbmZ1bmN0aW9uIGNsb3NlKGZpbGUpIHtcblxuXHRsZXQgb3Blbkxpc3Q7XG5cblx0bWFuaWxhLmNvbXBvbmVudHMuZWRpdG9yLnVwZGF0ZSgnJyk7XG5cblx0bWFuaWxhLmNvbXBvbmVudHMubmF2LnVwZGF0ZShmaWxlLnBhdGgsIGZhbHNlKTtcblx0XG5cdG1hbmlsYS5jb21wb25lbnRzLnRhYnMudXBkYXRlKGZpbGUsIGZhbHNlKTtcblxuXHRkZWxldGUgb3BlbkZpbGVzW2ZpbGUucGF0aF07XG5cblx0b3Blbkxpc3QgPSBPYmplY3Qua2V5cyhvcGVuRmlsZXMpO1xuXG5cdGlmIChvcGVuTGlzdC5sZW5ndGgpIHtcblxuXHRcdG9wZW4ob3BlbkZpbGVzW29wZW5MaXN0W29wZW5MaXN0Lmxlbmd0aCAtIDFdXSk7XG5cblx0fVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcblxuXHRvcGVuOiBvcGVuLFxuXHRjbG9zZTogY2xvc2VcblxufTsiLCJsZXQgbG9hZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xvYWRlci10ZW1wbGF0ZScpLmlubmVySFRNTDtcblxuZnVuY3Rpb24gZmFkZUluKCkge1xuXG5cdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuXHRcdFxuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXInKS5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG5cblx0fSk7XG5cbn1cblxuZnVuY3Rpb24gcmVwbGFjZShodG1sKSB7XG5cblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxvYWRlcicpLm91dGVySFRNTCA9IGh0bWw7XG5cbn1cblxuZnVuY3Rpb24gYWZ0ZXIoZWwpIHtcblxuXHRpZiAodHlwZW9mIGVsID09PSAnc3RyaW5nJykge1xuXG5cdFx0ZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKTtcblxuXHR9XG5cblx0ZWwub3V0ZXJIVE1MICs9IGxvYWRlcjtcblxuXHRmYWRlSW4oKTtcblxufVxuXG5cbmZ1bmN0aW9uIGhpZGUoKSB7XG5cblx0bGV0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxvYWRlcicpO1xuXG5cdGlmIChlbCkge1xuXG5cdFx0ZWwuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpO1xuXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblxuXHRcdFx0ZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XG5cblx0XHR9LCA2MDApO1xuXG5cdH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG5cdFxuXHRyZXBsYWNlOiByZXBsYWNlLFxuXHRhZnRlcjogYWZ0ZXIsXG5cdGhpZGU6IGhpZGVcblxufTsiLCJpbXBvcnQgbWFuaWxhIGZyb20gJ21ubGEvY2xpZW50JztcbmltcG9ydCBhamF4IGZyb20gJy4uL3NyYy9hamF4JztcblxubGV0IGJnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJhY2tncm91bmQnKVxuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZSgpIHtcblxuXHRsZXQgZmlsZSA9IG1hbmlsYS5jb21wb25lbnRzLm5hdi5nZXRBY3RpdmVGaWxlKCk7XG5cblx0aWYgKGZpbGUpIHtcblxuXHRcdGJnLmNsYXNzTGlzdC5hZGQoJ2JsdXInKTtcblxuXHRcdGFqYXgucG9zdChcblxuXHRcdFx0Jy9zYXZlP2ZpbGU9JyArIGZpbGUsXG5cblx0XHRcdHtcblx0XHRcdFx0ZGF0YTogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRleHQnKS52YWx1ZVxuXHRcdFx0fSxcblxuXHRcdFx0cmVzdWx0ID0+IHtcblxuXHRcdFx0XHRpZiAocmVzdWx0LmVycm9yKSB7XG5cblx0XHRcdFx0XHRhbGVydChyZXN1bHQuZXJyb3IpO1xuXHRcdFx0XHRcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKHJlc3VsdC5lcnJvcik7XG5cdFx0XHRcdFxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0YmcuY2xhc3NMaXN0LnJlbW92ZSgnYmx1cicpO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0KTtcblxuXHR9XG5cbn07IiwiY29uc3QgY29tcGlsZSA9IHJlcXVpcmUoJy4vY29tcGlsZScpO1xuXG53aW5kb3cubWFuaWxhID0gd2luZG93Lm1hbmlsYSB8fCB7fTtcblxud2luZG93Lm1hbmlsYS5oYW5kbGVycyA9IHt9O1xuXG5sZXQgY29tcG9uZW50cyA9IHt9LFxuXHRcblx0c2VsZWN0aW9uO1xuXG5mdW5jdGlvbiBjb21wb25lbnQoY29tcG9uZW50TmFtZSwgY29tcG9uZW50KSB7XG5cblx0bGV0IHZtID0gd2luZG93Lm1hbmlsYS5kYXRhW2NvbXBvbmVudE5hbWVdIHx8IHt9LFxuXG5cdFx0ZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1jb21wb25lbnQ9XCIke2NvbXBvbmVudE5hbWV9XCJdYCk7XG5cblx0Y29tcGlsZShgIyR7Y29tcG9uZW50TmFtZX0tdGVtcGxhdGVgKS50aGVuKHJlbmRlciA9PiB7XG5cblx0XHRmdW5jdGlvbiByZXNvbHZlKGRhdGEpIHtcblxuXHRcdFx0bGV0IGluZGV4ID0gMDtcblxuXHRcdFx0d2luZG93Lm1hbmlsYS5oYW5kbGVyc1tjb21wb25lbnROYW1lXSA9IFtdO1xuXG5cdFx0XHRkYXRhLm9uID0gKGV2ZW50LCBoYW5kbGVyLCAuLi5hcmdzKSA9PiB7XG5cblx0XHRcdFx0bGV0IGV2ZW50U3RyaW5nO1xuXG5cdFx0XHRcdHdpbmRvdy5tYW5pbGEuaGFuZGxlcnNbY29tcG9uZW50TmFtZV1baW5kZXhdID0gZSA9PiB7XG5cblx0XHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGFyZ3MucHVzaChlKTtcblxuXHRcdFx0XHRcdGhhbmRsZXIuYXBwbHkoZGF0YSwgYXJncyk7XG5cblx0XHRcdFx0XHRpZiAoZS50YXJnZXQudGFnTmFtZSAhPT0gJ0lOUFVUJyAmJiBlLnRhcmdldC50YWdOYW1lICE9PSAnVEVYVEFSRUEnKSB7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdHJlc29sdmUoZGF0YSk7XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fTtcblxuXHRcdFx0XHRldmVudFN0cmluZyA9IGBvbiR7ZXZlbnR9PW1hbmlsYS5oYW5kbGVycy4ke2NvbXBvbmVudE5hbWV9WyR7aW5kZXh9XShldmVudClgO1xuXG5cdFx0XHRcdGluZGV4Kys7XG5cblx0XHRcdFx0cmV0dXJuIGV2ZW50U3RyaW5nO1xuXG5cdFx0XHR9O1xuXG5cdFx0XHRlbC5pbm5lckhUTUwgPSByZW5kZXIoZGF0YSk7XG5cblx0XHR9XG5cblx0XHR2bS5yZW5kZXIgPSAoKSA9PiB7XG5cblx0XHRcdHJlc29sdmUodm0pO1xuXHRcdFx0XG5cdFx0fTtcblxuXHRcdGxldCBtZXRob2RzID0gY29tcG9uZW50KHZtKTtcblxuXHRcdGlmIChtZXRob2RzKSB7XG5cblx0XHRcdGNvbXBvbmVudHNbY29tcG9uZW50TmFtZV0gPSB7fTtcblxuXHRcdFx0T2JqZWN0LmtleXMobWV0aG9kcykuZm9yRWFjaChrZXkgPT4ge1xuXG5cdFx0XHRcdGNvbXBvbmVudHNbY29tcG9uZW50TmFtZV1ba2V5XSA9ICguLi5hcmdzKSA9PiB7XG5cblx0XHRcdFx0XHRsZXQgcmVzdWx0ID0gbWV0aG9kc1trZXldLmFwcGx5KHZtLCBhcmdzKTtcblxuXHRcdFx0XHRcdHJlc29sdmUodm0pO1xuXG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblxuXHRcdFx0XHR9O1xuXG5cdFx0XHR9KTtcblxuXHRcdH1cblxuXHRcdHJlc29sdmUodm0pO1xuXG5cdH0pO1xuXG5cdHJldHVybiB3aW5kb3cubWFuaWxhO1xuXG59XG5cbndpbmRvdy5tYW5pbGEuY29tcG9uZW50ID0gY29tcG9uZW50O1xud2luZG93Lm1hbmlsYS5jb21wb25lbnRzID0gY29tcG9uZW50cztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGNvbXBvbmVudDogY29tcG9uZW50LFxuXHRjb21wb25lbnRzOiBjb21wb25lbnRzXG59O1xuIiwiY29uc3QgbWFuaWxhID0gcmVxdWlyZSgnbWFuaWxhL3BhcnNlJyk7XG5cbmxldCBjYWNoZSA9IHt9LFxuXG5cdGVzY2FwZU1hcCA9IHtcbiAgICAgICAgJzwnOiAnJmx0OycsXG4gICAgICAgICc+JzogJyZndDsnLFxuICAgICAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICAgICAgJ1xcJyc6ICcmYXBvczsnXG4gICAgfTtcblxuZnVuY3Rpb24gaHRtbEVzY2FwZShzdHIpIHtcblxuICAgIHJldHVybiBzdHIucmVwbGFjZSgvWyY8PidcIl0vZywgYyA9PiB7XG5cbiAgICAgICAgcmV0dXJuIGVzY2FwZU1hcFtjXTtcblxuICAgIH0pO1xuXG59XG5cbndpbmRvdy5tYW5pbGEgPSB3aW5kb3cubWFuaWxhIHx8IHt9O1xuXG53aW5kb3cubWFuaWxhLmUgPSBmdW5jdGlvbih2YWwpIHtcblxuICAgIHJldHVybiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJyA/IGh0bWxFc2NhcGUodmFsKSA6IHZhbDtcbiAgICBcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tcGlsZShzZWxlY3Rvcikge1xuXG5cdHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcblxuXHRcdGlmICghc2VsZWN0b3IpIHtcblxuXHRcdFx0cmVzb2x2ZSggKCk9Pnt9ICk7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRpZiAoY2FjaGVbc2VsZWN0b3JdKSB7XG5cblx0XHRcdFx0cmVzb2x2ZShjYWNoZVtzZWxlY3Rvcl0pO1xuXG5cdFx0XHR9XG5cblx0XHRcdGNhY2hlW3NlbGVjdG9yXSA9IG1hbmlsYShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKS5pbm5lckhUTUwpO1xuXG5cdFx0XHRyZXNvbHZlKGNhY2hlW3NlbGVjdG9yXSk7XG5cblx0XHR9XG5cblx0fSk7XG5cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGVtcGxhdGUpIHtcblxuICAgIHJldHVybiBuZXcgRnVuY3Rpb24oJ2NvbnRleHQnLFxuXG4gICAgICAgIFwidmFyIHA9W107d2l0aChjb250ZXh0KXtwLnB1c2goYFwiICtcbiAgICAgICBcbiAgICAgICAgdGVtcGxhdGVcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcJy9nLCBcIlxcXFxcXFxcJ1wiKVxuICAgICAgICAgICAgLnJlcGxhY2UoL2AvZywgXCJcXFxcYFwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoLzw6Oig/IVxccyp9Lio/Ojo+KSg/IS4qe1xccyo6Oj4pKC4qPyk6Oj4vZywgXCJgKTt0cnl7cC5wdXNoKCQxKX1jYXRjaChlKXt9cC5wdXNoKGBcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC88OjpcXHMqKC4qPylcXHMqOjo+L2csIFwiYCk7JDFcXG5wLnB1c2goYFwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoLzw6KD8hXFxzKn0uKj86PikoPyEuKntcXHMqOj4pKC4qPyk6Pi9nLCBcImApO3RyeXtwLnB1c2gobWFuaWxhLmUoJDEpKX1jYXRjaChlKXt9cC5wdXNoKGBcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC88OlxccyooLio/KVxccyo6Pi9nLCBcImApOyQxXFxucC5wdXNoKGBcIilcblxuICAgICAgKyBcImApO31yZXR1cm4gcC5qb2luKCcnKTtcIik7XG59OyJdfQ==
