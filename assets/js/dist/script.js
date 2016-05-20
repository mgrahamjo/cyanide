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

				var newFile = {
					name: name,
					path: result.data
				};

				current.children = current.children || { files: [] };

				current.children.files.push(newFile);

				_fileManager2.default.open(newFile);
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

			vm.parent = dir.parent;

			open(dir, e);
		},

		rightClickFile: function rightClickFile(file, e) {

			vm.file = true;

			vm.parent = false;

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

	setTimeout(function () {
		resetHeight();
	});

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

	vm.save = _save.save;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvYXBwLmpzIiwiYXNzZXRzL2pzL2NvbXBvbmVudHMvY29udGV4dE1lbnUuanMiLCJhc3NldHMvanMvY29tcG9uZW50cy9lZGl0b3IuanMiLCJhc3NldHMvanMvY29tcG9uZW50cy9uYXYuanMiLCJhc3NldHMvanMvY29tcG9uZW50cy90YWJzLmpzIiwiYXNzZXRzL2pzL3NyYy9hZGRLZXlib2FyZFNob3J0Y3V0cy5qcyIsImFzc2V0cy9qcy9zcmMvYWpheC5qcyIsImFzc2V0cy9qcy9zcmMvZmlsZU1hbmFnZXIuanMiLCJhc3NldHMvanMvc3JjL2xvYWRlci5qcyIsImFzc2V0cy9qcy9zcmMvc2F2ZS5qcyIsIi4uL21ubGEvY2xpZW50LmpzIiwiLi4vbW5sYS9jb21waWxlLmpzIiwiLi4vbW5sYS9ub2RlX21vZHVsZXMvbWFuaWxhL3BhcnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7QUNKQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQUksZ0JBQUo7O0FBRUEsaUJBQU8sU0FBUCxDQUFpQixhQUFqQixFQUFnQyxjQUFNOztBQUVyQyxJQUFHLElBQUgsR0FBVSxJQUFWLENBRnFDOztBQUlyQyxVQUFTLElBQVQsQ0FBYyxJQUFkLEVBQW9CLENBQXBCLEVBQXVCOztBQUV0QixJQUFFLGNBQUYsR0FGc0I7O0FBSXRCLFlBQVUsSUFBVixDQUpzQjs7QUFNdEIsS0FBRyxJQUFILEdBQVUsRUFBRSxPQUFGLENBTlk7O0FBUXRCLEtBQUcsR0FBSCxHQUFTLEVBQUUsT0FBRixDQVJhOztBQVV0QixLQUFHLE9BQUgsR0FBYSxJQUFiLENBVnNCO0VBQXZCOztBQWNBLFVBQVMsZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUMsWUFBTTs7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O0lBQXJCOztBQU1BLFNBQU0sUUFBTixJQUFrQixPQUFPLFNBQVMsYUFBVCxDQUF1QixRQUF2QixFQUFpQyxTQUFqQyxDQUF6QixDQVJNOztBQVVOLFdBQVEsTUFBTSxRQUFOLENBQVIsRUFWTTtHQUpQO0VBRmtCLENBQW5CLENBRjJDO0NBQTNCOzs7QUM3QmpCOztBQUVBLE9BQU8sT0FBUCxHQUFpQixVQUFTLFFBQVQsRUFBbUI7O0FBRWhDLFdBQU8sSUFBSSxRQUFKLENBQWEsU0FBYixFQUVILG9DQUVBLFNBQ0ssT0FETCxDQUNhLE1BRGIsRUFDcUIsT0FEckIsRUFFSyxPQUZMLENBRWEsSUFGYixFQUVtQixLQUZuQixFQUdLLE9BSEwsQ0FHYSx5Q0FIYixFQUd3RCxzQ0FIeEQsRUFJSyxPQUpMLENBSWEsb0JBSmIsRUFJbUMsaUJBSm5DLEVBS0ssT0FMTCxDQUthLHFDQUxiLEVBS29ELGdEQUxwRCxFQU1LLE9BTkwsQ0FNYSxrQkFOYixFQU1pQyxpQkFOakMsQ0FGQSxHQVVBLHdCQVZBLENBRkosQ0FGZ0M7Q0FBbkIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IGFkZEtleWJvYXJkU2hvcnRjdXRzIGZyb20gJy4vc3JjL2FkZEtleWJvYXJkU2hvcnRjdXRzJztcbmltcG9ydCBuYXYgZnJvbSAnLi9jb21wb25lbnRzL25hdic7XG5pbXBvcnQgZWRpdG9yIGZyb20gJy4vY29tcG9uZW50cy9lZGl0b3InO1xuaW1wb3J0IHRhYnMgZnJvbSAnLi9jb21wb25lbnRzL3RhYnMnO1xuaW1wb3J0IGNvbnRleHRNZW51IGZyb20gJy4vY29tcG9uZW50cy9jb250ZXh0TWVudSc7XG4iLCJpbXBvcnQgbWFuaWxhIGZyb20gJ21ubGEvY2xpZW50JztcbmltcG9ydCBhamF4IGZyb20gJy4uL3NyYy9hamF4JztcbmltcG9ydCBmaWxlTWFuYWdlciBmcm9tICcuLi9zcmMvZmlsZU1hbmFnZXInO1xuXG5sZXQgY3VycmVudDtcblxubWFuaWxhLmNvbXBvbmVudCgnY29udGV4dE1lbnUnLCB2bSA9PiB7XG5cblx0dm0uZmlsZSA9IHRydWU7XG5cblx0ZnVuY3Rpb24gb3BlbihpdGVtLCBlKSB7XG5cblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjdXJyZW50ID0gaXRlbTtcblxuXHRcdHZtLmxlZnQgPSBlLmNsaWVudFg7XG5cblx0XHR2bS50b3AgPSBlLmNsaWVudFk7XG5cblx0XHR2bS52aXNpYmxlID0gdHJ1ZTtcblxuXHR9XG5cblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cblx0XHRpZiAodm0udmlzaWJsZSkge1xuXG5cdFx0XHR2bS52aXNpYmxlID0gZmFsc2U7XG5cblx0XHRcdHZtLnJlbmRlcigpO1xuXG5cdFx0fVxuXG5cdH0pO1xuXG5cdHZtLnJlbmFtZSA9ICgpID0+IHtcblxuXHRcdHZtLnZpc2libGUgPSBmYWxzZTtcblxuXHRcdHZtLnJlbmRlcigpO1xuXG5cdFx0bGV0IG5hbWUgPSBwcm9tcHQoJ05ldyBuYW1lOicpO1xuXG5cdFx0aWYgKG5hbWUpIHtcblxuXHRcdFx0YWpheC5wb3N0KFxuXG5cdFx0XHRcdCcvcmVuYW1lP3BhdGg9JyArIGN1cnJlbnQucGF0aCxcblxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bmFtZTogbmFtZVxuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdHJlc3VsdCA9PiB7XG5cblx0XHRcdFx0XHRpZiAocmVzdWx0LmVycm9yKSB7XG5cblx0XHRcdFx0XHRcdGFsZXJ0KHJlc3VsdC5lcnJvcik7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKHJlc3VsdC5lcnJvcik7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdFx0dm0ucmVuZGVyKCk7XG5cblx0XHRcdFx0XHRcdGZpbGVNYW5hZ2VyLmNsb3NlKGN1cnJlbnQpO1xuXG5cdFx0XHRcdFx0XHRjdXJyZW50Lm5hbWUgPSBuYW1lO1xuXG5cdFx0XHRcdFx0XHRjdXJyZW50LnBhdGggPSByZXN1bHQuZGF0YTtcblxuXHRcdFx0XHRcdFx0ZmlsZU1hbmFnZXIub3BlbihjdXJyZW50KTtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0KTtcblxuXHRcdH1cblxuXHR9O1xuXG5cdHZtLmRlbGV0ZVBhdGggPSAoKSA9PiB7XG5cblx0XHR2bS52aXNpYmxlID0gZmFsc2U7XG5cblx0XHRhamF4LnBvc3QoXG5cblx0XHRcdCcvZGVsZXRlP3BhdGg9JyArIGN1cnJlbnQucGF0aCxcblxuXHRcdFx0cmVzdWx0ID0+IHtcblxuXHRcdFx0XHRpZiAocmVzdWx0LmVycm9yKSB7XG5cblx0XHRcdFx0XHRhbGVydChyZXN1bHQuZXJyb3IpO1xuXHRcdFx0XHRcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKHJlc3VsdC5lcnJvcik7XG5cdFx0XHRcdFxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0aWYgKHZtLmZpbGUpIHtcblxuXHRcdFx0XHRcdFx0ZmlsZU1hbmFnZXIuY2xvc2UoY3VycmVudCk7XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjdXJyZW50LmRlbGV0ZWQgPSB0cnVlO1xuXG5cdFx0XHRcdFx0bWFuaWxhLmNvbXBvbmVudHMubmF2LnJlbmRlcigpO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0KTtcblxuXHR9O1xuXG5cdHZtLm5ld0ZpbGUgPSAoKSA9PiB7XG5cblx0XHR2bS52aXNpYmxlID0gZmFsc2U7XG5cblx0XHR2bS5yZW5kZXIoKTtcblxuXHRcdGxldCBuYW1lID0gcHJvbXB0KCdGaWxlIG5hbWU6Jyk7XG5cblx0XHRhamF4LnBvc3QoXG5cblx0XHRcdCcvbmV3LWZpbGU/cGF0aD0nICsgY3VycmVudC5wYXRoLFxuXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6IG5hbWVcblx0XHRcdH0sXG5cblx0XHRcdHJlc3VsdCA9PiB7XG5cblx0XHRcdFx0aWYgKHJlc3VsdC5lcnJvcikge1xuXG5cdFx0XHRcdFx0YWxlcnQocmVzdWx0LmVycm9yKTtcblx0XHRcdFx0XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihyZXN1bHQuZXJyb3IpO1xuXHRcdFx0XHRcblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdGxldCBuZXdGaWxlID0ge1xuXHRcdFx0XHRcdFx0bmFtZTogbmFtZSxcblx0XHRcdFx0XHRcdHBhdGg6IHJlc3VsdC5kYXRhXG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdGN1cnJlbnQuY2hpbGRyZW4gPSBjdXJyZW50LmNoaWxkcmVuIHx8IHsgZmlsZXM6W10gfTtcblxuXHRcdFx0XHRcdGN1cnJlbnQuY2hpbGRyZW4uZmlsZXMucHVzaChuZXdGaWxlKTtcblxuXHRcdFx0XHRcdGZpbGVNYW5hZ2VyLm9wZW4obmV3RmlsZSk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0XHRcblx0XHQpO1xuXG5cdH07XG5cblx0dm0ubmV3RGlyID0gKCkgPT4ge1xuXG5cdFx0dm0udmlzaWJsZSA9IGZhbHNlO1xuXG5cdFx0dm0ucmVuZGVyKCk7XG5cblx0XHRsZXQgbmFtZSA9IHByb21wdCgnRm9sZGVyIG5hbWU6Jyk7XG5cblx0XHRhamF4LnBvc3QoXG5cblx0XHRcdCcvbmV3LWRpcj9wYXRoPScgKyBjdXJyZW50LnBhdGgsXG5cblx0XHRcdHtcblx0XHRcdFx0bmFtZTogbmFtZVxuXHRcdFx0fSxcblxuXHRcdFx0cmVzdWx0ID0+IHtcblxuXHRcdFx0XHRpZiAocmVzdWx0LmVycm9yKSB7XG5cblx0XHRcdFx0XHRhbGVydChyZXN1bHQuZXJyb3IpO1xuXHRcdFx0XHRcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKHJlc3VsdC5lcnJvcik7XG5cdFx0XHRcdFxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0Y3VycmVudC5jaGlsZHJlbiA9IGN1cnJlbnQuY2hpbGRyZW4gfHwgeyBkaXJzOltdIH07XG5cblx0XHRcdFx0XHRjdXJyZW50LmNoaWxkcmVuLmRpcnMucHVzaCh7XG5cdFx0XHRcdFx0XHRuYW1lOiBuYW1lLFxuXHRcdFx0XHRcdFx0cGF0aDogcmVzdWx0LmRhdGFcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdG1hbmlsYS5jb21wb25lbnRzLm5hdi5yZW5kZXIoKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHRcdFxuXHRcdCk7XG5cblx0fTtcblxuXHRyZXR1cm4ge1xuXG5cdFx0cmlnaHRDbGlja0RpcjogKGRpciwgZSkgPT4ge1xuXG5cdFx0XHR2bS5maWxlID0gZmFsc2U7XG5cblx0XHRcdHZtLnBhcmVudCA9IGRpci5wYXJlbnQ7XG5cblx0XHRcdG9wZW4oZGlyLCBlKTtcblxuXHRcdH0sXG5cblx0XHRyaWdodENsaWNrRmlsZTogKGZpbGUsIGUpID0+IHtcblxuXHRcdFx0dm0uZmlsZSA9IHRydWU7XG5cblx0XHRcdHZtLnBhcmVudCA9IGZhbHNlO1xuXG5cdFx0XHRvcGVuKGZpbGUsIGUpXG5cblx0XHR9XG5cblx0fVxuXG59KTtcbiIsImltcG9ydCBsb2FkZXIgZnJvbSAnLi4vc3JjL2xvYWRlcic7XG5pbXBvcnQgYWpheCBmcm9tICcuLi9zcmMvYWpheCc7XG5pbXBvcnQgbWFuaWxhIGZyb20gJ21ubGEvY2xpZW50JztcblxuZnVuY3Rpb24gcmVzZXRIZWlnaHQoZSkge1xuXG5cdGxldCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZXh0JyksXG5cblx0XHRudW1iZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm51bWJlcnMnKSxcblxuXHRcdGhlaWdodDtcblxuXHRlbC5zdHlsZS5oZWlnaHQgPSAnJztcblxuXHRoZWlnaHQgPSBlbC5zY3JvbGxIZWlnaHQ7XG5cblx0bnVtYmVycy5zdHlsZS5oZWlnaHQgPSAnJztcblxuXHRpZiAobnVtYmVycy5jbGllbnRIZWlnaHQgPCBoZWlnaHQpIHtcblxuXHRcdHdoaWxlIChudW1iZXJzLmNsaWVudEhlaWdodCA8IGhlaWdodCkge1xuXG5cdFx0XHRudW1iZXJzLmlubmVySFRNTCArPSAnPGRpdiBjbGFzcz1cIm51bVwiPjwvZGl2Pic7XG5cblx0XHR9XG5cblx0fSBlbHNlIHtcblxuXHRcdG51bWJlcnMuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcblxuXHR9XG5cblx0ZWwuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcblxufVxuXG5tYW5pbGEuY29tcG9uZW50KCdlZGl0b3InLCB2bSA9PiB7XG5cblx0dm0ucmVzZXRIZWlnaHQgPSByZXNldEhlaWdodDtcblxuXHRmdW5jdGlvbiBzaG93VGV4dCh0ZXh0KSB7XG5cblx0XHR2bS50ZXh0ID0gdGV4dDtcblxuXHRcdGxvYWRlci5oaWRlKCk7XG5cblx0XHR2bS5yZW5kZXIoKTtcblxuXHR9XG5cblx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0cmVzZXRIZWlnaHQoKTtcblx0fSk7XG5cblx0cmV0dXJuIHtcblxuXHRcdHVwZGF0ZTogcGF0aCA9PiB7XG5cblx0XHRcdGxvYWRlci5hZnRlcignLm92ZXJsYXknKTtcblxuXHRcdFx0aWYgKHBhdGgpIHtcblxuXHRcdFx0XHRhamF4LmdldCgnL29wZW4/ZmlsZT0nICsgcGF0aCwgZGF0YSA9PiB7XG5cblx0XHRcdFx0XHRzaG93VGV4dChkYXRhLmRhdGEpO1xuXG5cdFx0XHRcdFx0dm0ucmVzZXRIZWlnaHQoKTtcblxuXHRcdFx0XHR9KTtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRzaG93VGV4dCgnJyk7XG5cblx0XHRcdFx0dm0ucmVzZXRIZWlnaHQoKTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdH07XG5cbn0pO1xuIiwiaW1wb3J0IGZpbGVNYW5hZ2VyIGZyb20gJy4uL3NyYy9maWxlTWFuYWdlcic7XG5pbXBvcnQgYWpheCBmcm9tICcuLi9zcmMvYWpheCc7XG5pbXBvcnQgbWFuaWxhIGZyb20gJ21ubGEvY2xpZW50JztcblxubWFuaWxhLmNvbXBvbmVudCgnbmF2Jywgdm0gPT4ge1xuXG5cdHZtLm9wZW4gPSB7fTtcblxuXHR2bS5jbGlja0RpciA9IGRpciA9PiB7XG5cblx0XHRkaXIub3BlbiA9ICFkaXIub3BlbjtcblxuXHRcdGlmICghZGlyLmNoaWxkcmVuKSB7XG5cblx0XHRcdGFqYXguZ2V0KCcvbmF2P3BhdGg9JyArIGRpci5wYXRoLCBkYXRhID0+IHtcblxuXHRcdFx0XHRkaXIuY2hpbGRyZW4gPSBkYXRhLmRpcjtcblxuXHRcdFx0XHR2bS5yZW5kZXIoKTtcblxuXHRcdFx0fSk7XG5cblx0XHR9XG5cblx0fTtcblxuXHR2bS5jbGlja0ZpbGUgPSBmaWxlID0+IHtcblxuXHRcdGZpbGVNYW5hZ2VyLm9wZW4oZmlsZSk7XG5cblx0fTtcblxuXHR2bS5yaWdodENsaWNrRGlyID0gKGRpciwgZSkgPT4ge1xuXHRcblx0XHRtYW5pbGEuY29tcG9uZW50cy5jb250ZXh0TWVudS5yaWdodENsaWNrRGlyKGRpciwgZSk7XG5cblx0fTtcblxuXHR2bS5yaWdodENsaWNrRmlsZSA9IChmaWxlLCBlKSA9PiB7XG5cdFxuXHRcdG1hbmlsYS5jb21wb25lbnRzLmNvbnRleHRNZW51LnJpZ2h0Q2xpY2tGaWxlKGZpbGUsIGUpO1xuXG5cdH07XG5cblx0cmV0dXJuIHtcblxuXHRcdHVwZGF0ZTogKHBhdGgsIG9wZW4pID0+IHtcblxuXHRcdFx0aWYgKG9wZW4pIHtcblxuXHRcdFx0XHR2bS5vcGVuW3BhdGhdID0gcGF0aDtcblxuXHRcdFx0XHR2bS5hY3RpdmUgPSBwYXRoO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGRlbGV0ZSB2bS5vcGVuW3BhdGhdO1xuXG5cdFx0XHR9XG5cblx0XHR9LFxuXG5cdFx0Z2V0QWN0aXZlRmlsZTogKCkgPT4ge1xuXG5cdFx0XHRyZXR1cm4gdm0uYWN0aXZlO1xuXG5cdFx0fSxcblxuXHRcdHJlbmRlcjogKCkgPT4ge1xuXG5cdFx0XHR2bS5yZW5kZXIoKTtcblxuXHRcdH1cblxuXHR9O1xuXG59KTtcbiIsImltcG9ydCBmaWxlTWFuYWdlciBmcm9tICcuLi9zcmMvZmlsZU1hbmFnZXInO1xuaW1wb3J0IG1hbmlsYSBmcm9tICdtbmxhL2NsaWVudCc7XG5pbXBvcnQgeyBzYXZlIH0gZnJvbSAnLi4vc3JjL3NhdmUnO1xuXG5tYW5pbGEuY29tcG9uZW50KCd0YWJzJywgdm0gPT4ge1xuXG5cdHZtLnRhYnMgPSB7fTtcblxuXHR2bS5jbG9zZSA9IHBhdGggPT4ge1xuXG5cdFx0ZGVsZXRlIHZtLnRhYnNbcGF0aF07XG5cblx0XHRmaWxlTWFuYWdlci5jbG9zZSh7XG5cdFx0XHRwYXRoOiBwYXRoLFxuXHRcdFx0bmFtZTogdm0udGFic1twYXRoXVxuXHRcdH0pO1xuXG5cdH07XG5cblx0dm0ub3BlbiA9IHBhdGggPT4ge1xuXG5cdFx0ZmlsZU1hbmFnZXIub3Blbih7XG5cdFx0XHRwYXRoOiBwYXRoLFxuXHRcdFx0bmFtZTogdm0udGFic1twYXRoXVxuXHRcdH0pO1xuXG5cdH07XG5cblx0dm0uc2F2ZSA9IHNhdmU7XG5cblx0cmV0dXJuIHtcblxuXHRcdHVwZGF0ZTogKGZpbGUsIG9wZW4pID0+IHtcblxuXHRcdFx0aWYgKG9wZW4pIHtcblxuXHRcdFx0XHR2bS5hY3RpdmUgPSBmaWxlLnBhdGg7XG5cblx0XHRcdFx0dm0udGFic1tmaWxlLnBhdGhdID0gZmlsZS5uYW1lO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGRlbGV0ZSB2bS50YWJzW2ZpbGUucGF0aF07XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9O1xuXG59KTtcbiIsImltcG9ydCB7IHNhdmUgfSBmcm9tICcuL3NhdmUnO1xuXG5jb25zdCBrZXltYXAgPSB7XG5cblx0XHQ5MToge1xuXHRcdFx0Y2FsbGJhY2s6IHNhdmUsXG5cdFx0XHRwYWlyOiA4MyBcblx0XHR9LFxuXG5cdFx0ODM6IHtcblx0XHRcdGNhbGxiYWNrOiBzYXZlLFxuXHRcdFx0cGFpcjogOTFcblx0XHR9XG5cblx0fTtcblxubGV0IHByZXNzZWQgPSB7IH07XG5cblxuZnVuY3Rpb24ga2V5ZG93bihlKSB7XG5cblx0bGV0IGNvZGUgPSBlLmtleUNvZGUgfHwgZS53aGljaCxcblxuXHRcdGtleSA9IGtleW1hcFtjb2RlXTtcblxuXHRpZiAoa2V5KSB7XG5cblx0XHRwcmVzc2VkW2NvZGVdID0gdHJ1ZTtcblxuXHRcdGlmIChwcmVzc2VkW2tleS5wYWlyXSkge1xuXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGtleS5jYWxsYmFjaygpO1xuXG5cdFx0XHRkZWxldGUgcHJlc3NlZFtjb2RlXTtcblx0XHRcdGRlbGV0ZSBwcmVzc2VkW2tleS5wYWlyXTtcblxuXHRcdH1cblxuXHR9XG5cbn1cblxuXG5mdW5jdGlvbiBrZXl1cChlKSB7XG5cblx0ZGVsZXRlIHByZXNzZWRbZS5rZXlDb2RlIHx8IGUud2hpY2hdO1xuXG59XG5cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGtleWRvd24pO1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBrZXl1cCk7XG4iLCJmdW5jdGlvbiBzZXJpYWxpemUoZGF0YSkge1xuIFxuIFx0bGV0IHBhcnRzID0gW107XG4gXG4gXHRmb3IgKGxldCBrZXkgaW4gZGF0YSkge1xuIFxuIFx0XHRwYXJ0cy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQoZGF0YVtrZXldKSk7XG5cbiBcdH1cbiBcbiBcdHJldHVybiBwYXJ0cy5qb2luKCcmJyk7XG59XG4gXG5mdW5jdGlvbiBnZXQocGF0aCwgZGF0YSwgY2FsbGJhY2spIHtcblxuXHRpZiAodHlwZW9mIGRhdGEgPT09ICdmdW5jdGlvbicpIHtcblxuXHRcdGNhbGxiYWNrID0gZGF0YTtcblxuXHR9XG4gXG4gXHRsZXQgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gXG4gXHRpZiAodHlwZW9mIGRhdGEgPT09ICdmdW5jdGlvbicpIHtcbiBcbiBcdFx0Y2FsbGJhY2sgPSBkYXRhO1xuIFxuIFx0XHRkYXRhID0ge307XG5cbiBcdH1cbiBcbiBcdHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gXG4gXHRcdGlmIChyZXEucmVhZHlTdGF0ZSA9PSA0ICYmIHJlcS5zdGF0dXMgPT0gMjAwKSB7XG4gXG4gXHRcdFx0bGV0IHJlc3VsdCA9IHZvaWQgMDtcbiBcbiBcdFx0XHR0cnkge1xuIFxuIFx0XHRcdFx0cmVzdWx0ID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcblxuIFx0XHRcdH0gY2F0Y2ggKGVycikge1xuIFxuIFx0XHRcdFx0cmVzdWx0ID0gcmVxLnJlc3BvbnNlVGV4dDtcblxuIFx0XHRcdH1cbiBcbiBcdFx0XHRjYWxsYmFjayhyZXN1bHQpO1xuIFx0XHR9XG5cbiBcdH07XG4gXG4gXHRyZXEub3BlbignR0VUJywgcGF0aCk7XG4gXG4gXHRyZXEuc2VuZChzZXJpYWxpemUoZGF0YSkpO1xuXG59XG4gXG5mdW5jdGlvbiBwb3N0KHBhdGgsIGRhdGEsIGNhbGxiYWNrKSB7XG5cblx0aWYgKHR5cGVvZiBkYXRhID09PSAnZnVuY3Rpb24nKSB7XG5cblx0XHRjYWxsYmFjayA9IGRhdGE7XG5cblx0fVxuIFxuIFx0bGV0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuIFxuIFx0cmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiBcbiBcdFx0aWYgKHJlcS5yZWFkeVN0YXRlID09IDQgJiYgcmVxLnN0YXR1cyA9PSAyMDApIHtcbiBcbiBcdFx0XHRsZXQganNvbiA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gXG4gXHRcdFx0aWYgKGpzb24pIHtcbiBcbiBcdFx0XHRcdGNhbGxiYWNrKGpzb24pO1xuXG4gXHRcdFx0fSBlbHNlIHtcbiBcbiBcdFx0XHRcdGNhbGxiYWNrKHJlcS5yZXNwb25zZVRleHQpO1xuXG4gXHRcdFx0fVxuXG4gXHRcdH1cblxuIFx0fTtcbiBcbiBcdHJlcS5vcGVuKCdQT1NUJywgcGF0aCk7XG4gXG4gXHRyZXEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xuIFxuIFx0cmVxLnNlbmQoc2VyaWFsaXplKGRhdGEpKTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuIFx0Z2V0OiBnZXQsXG4gXHRwb3N0OiBwb3N0XG4gXG59O1xuIiwiaW1wb3J0IG1hbmlsYSBmcm9tICdtbmxhL2NsaWVudCc7XG5cbmxldCBvcGVuRmlsZXMgPSB7fTtcblxuZnVuY3Rpb24gb3BlbihmaWxlKSB7XG5cblx0bWFuaWxhLmNvbXBvbmVudHMuZWRpdG9yLnVwZGF0ZShmaWxlLnBhdGgpO1xuXG5cdG1hbmlsYS5jb21wb25lbnRzLm5hdi51cGRhdGUoZmlsZS5wYXRoLCB0cnVlKTtcblxuXHRtYW5pbGEuY29tcG9uZW50cy50YWJzLnVwZGF0ZShmaWxlLCB0cnVlKTtcblxuXHRvcGVuRmlsZXNbZmlsZS5wYXRoXSA9IGZpbGU7XG5cbn1cblxuZnVuY3Rpb24gY2xvc2UoZmlsZSkge1xuXG5cdGxldCBvcGVuTGlzdDtcblxuXHRtYW5pbGEuY29tcG9uZW50cy5lZGl0b3IudXBkYXRlKCcnKTtcblxuXHRtYW5pbGEuY29tcG9uZW50cy5uYXYudXBkYXRlKGZpbGUucGF0aCwgZmFsc2UpO1xuXHRcblx0bWFuaWxhLmNvbXBvbmVudHMudGFicy51cGRhdGUoZmlsZSwgZmFsc2UpO1xuXG5cdGRlbGV0ZSBvcGVuRmlsZXNbZmlsZS5wYXRoXTtcblxuXHRvcGVuTGlzdCA9IE9iamVjdC5rZXlzKG9wZW5GaWxlcyk7XG5cblx0aWYgKG9wZW5MaXN0Lmxlbmd0aCkge1xuXG5cdFx0b3BlbihvcGVuRmlsZXNbb3Blbkxpc3Rbb3Blbkxpc3QubGVuZ3RoIC0gMV1dKTtcblxuXHR9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuXG5cdG9wZW46IG9wZW4sXG5cdGNsb3NlOiBjbG9zZVxuXG59OyIsImxldCBsb2FkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbG9hZGVyLXRlbXBsYXRlJykuaW5uZXJIVE1MO1xuXG5mdW5jdGlvbiBmYWRlSW4oKSB7XG5cblx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG5cdFx0XG5cdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxvYWRlcicpLmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKTtcblxuXHR9KTtcblxufVxuXG5mdW5jdGlvbiByZXBsYWNlKGh0bWwpIHtcblxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyJykub3V0ZXJIVE1MID0gaHRtbDtcblxufVxuXG5mdW5jdGlvbiBhZnRlcihlbCkge1xuXG5cdGlmICh0eXBlb2YgZWwgPT09ICdzdHJpbmcnKSB7XG5cblx0XHRlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpO1xuXG5cdH1cblxuXHRlbC5vdXRlckhUTUwgKz0gbG9hZGVyO1xuXG5cdGZhZGVJbigpO1xuXG59XG5cblxuZnVuY3Rpb24gaGlkZSgpIHtcblxuXHRsZXQgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyJyk7XG5cblx0aWYgKGVsKSB7XG5cblx0XHRlbC5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJyk7XG5cblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcblxuXHRcdH0sIDYwMCk7XG5cblx0fVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0XG5cdHJlcGxhY2U6IHJlcGxhY2UsXG5cdGFmdGVyOiBhZnRlcixcblx0aGlkZTogaGlkZVxuXG59OyIsImltcG9ydCBtYW5pbGEgZnJvbSAnbW5sYS9jbGllbnQnO1xuaW1wb3J0IGFqYXggZnJvbSAnLi4vc3JjL2FqYXgnO1xuXG5sZXQgYmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmFja2dyb3VuZCcpXG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlKCkge1xuXG5cdGxldCBmaWxlID0gbWFuaWxhLmNvbXBvbmVudHMubmF2LmdldEFjdGl2ZUZpbGUoKTtcblxuXHRpZiAoZmlsZSkge1xuXG5cdFx0YmcuY2xhc3NMaXN0LmFkZCgnYmx1cicpO1xuXG5cdFx0YWpheC5wb3N0KFxuXG5cdFx0XHQnL3NhdmU/ZmlsZT0nICsgZmlsZSxcblxuXHRcdFx0e1xuXHRcdFx0XHRkYXRhOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGV4dCcpLnZhbHVlXG5cdFx0XHR9LFxuXG5cdFx0XHRyZXN1bHQgPT4ge1xuXG5cdFx0XHRcdGlmIChyZXN1bHQuZXJyb3IpIHtcblxuXHRcdFx0XHRcdGFsZXJ0KHJlc3VsdC5lcnJvcik7XG5cdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IocmVzdWx0LmVycm9yKTtcblx0XHRcdFx0XG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRiZy5jbGFzc0xpc3QucmVtb3ZlKCdibHVyJyk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0XHRcblx0XHQpO1xuXG5cdH1cblxufTsiLCJjb25zdCBjb21waWxlID0gcmVxdWlyZSgnLi9jb21waWxlJyk7XG5cbndpbmRvdy5tYW5pbGEgPSB3aW5kb3cubWFuaWxhIHx8IHt9O1xuXG53aW5kb3cubWFuaWxhLmhhbmRsZXJzID0ge307XG5cbmxldCBjb21wb25lbnRzID0ge30sXG5cdFxuXHRzZWxlY3Rpb247XG5cbmZ1bmN0aW9uIGNvbXBvbmVudChjb21wb25lbnROYW1lLCBjb21wb25lbnQpIHtcblxuXHRsZXQgdm0gPSB3aW5kb3cubWFuaWxhLmRhdGFbY29tcG9uZW50TmFtZV0gfHwge30sXG5cblx0XHRlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWNvbXBvbmVudD1cIiR7Y29tcG9uZW50TmFtZX1cIl1gKTtcblxuXHRjb21waWxlKGAjJHtjb21wb25lbnROYW1lfS10ZW1wbGF0ZWApLnRoZW4ocmVuZGVyID0+IHtcblxuXHRcdGZ1bmN0aW9uIHJlc29sdmUoZGF0YSkge1xuXG5cdFx0XHRsZXQgaW5kZXggPSAwO1xuXG5cdFx0XHR3aW5kb3cubWFuaWxhLmhhbmRsZXJzW2NvbXBvbmVudE5hbWVdID0gW107XG5cblx0XHRcdGRhdGEub24gPSAoZXZlbnQsIGhhbmRsZXIsIC4uLmFyZ3MpID0+IHtcblxuXHRcdFx0XHRsZXQgZXZlbnRTdHJpbmc7XG5cblx0XHRcdFx0d2luZG93Lm1hbmlsYS5oYW5kbGVyc1tjb21wb25lbnROYW1lXVtpbmRleF0gPSBlID0+IHtcblxuXHRcdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0YXJncy5wdXNoKGUpO1xuXG5cdFx0XHRcdFx0aGFuZGxlci5hcHBseShkYXRhLCBhcmdzKTtcblxuXHRcdFx0XHRcdGlmIChlLnRhcmdldC50YWdOYW1lICE9PSAnSU5QVVQnICYmIFxuXHRcdFx0XHRcdFx0IGUudGFyZ2V0LnRhZ05hbWUgIT09ICdURVhUQVJFQScpIHtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhKTtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGV2ZW50U3RyaW5nID0gYG9uJHtldmVudH09bWFuaWxhLmhhbmRsZXJzLiR7Y29tcG9uZW50TmFtZX1bJHtpbmRleH1dKGV2ZW50KWA7XG5cblx0XHRcdFx0aW5kZXgrKztcblxuXHRcdFx0XHRyZXR1cm4gZXZlbnRTdHJpbmc7XG5cblx0XHRcdH07XG5cblx0XHRcdGVsLmlubmVySFRNTCA9IHJlbmRlcihkYXRhKTtcblxuXHRcdH1cblxuXHRcdHZtLnJlbmRlciA9ICgpID0+IHtcblxuXHRcdFx0cmVzb2x2ZSh2bSk7XG5cdFx0XHRcblx0XHR9O1xuXG5cdFx0bGV0IG1ldGhvZHMgPSBjb21wb25lbnQodm0pO1xuXG5cdFx0aWYgKG1ldGhvZHMpIHtcblxuXHRcdFx0Y29tcG9uZW50c1tjb21wb25lbnROYW1lXSA9IHt9O1xuXG5cdFx0XHRPYmplY3Qua2V5cyhtZXRob2RzKS5mb3JFYWNoKGtleSA9PiB7XG5cblx0XHRcdFx0Y29tcG9uZW50c1tjb21wb25lbnROYW1lXVtrZXldID0gKC4uLmFyZ3MpID0+IHtcblxuXHRcdFx0XHRcdGxldCByZXN1bHQgPSBtZXRob2RzW2tleV0uYXBwbHkodm0sIGFyZ3MpO1xuXG5cdFx0XHRcdFx0cmVzb2x2ZSh2bSk7XG5cblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXG5cdFx0XHRcdH07XG5cblx0XHRcdH0pO1xuXG5cdFx0fVxuXG5cdFx0cmVzb2x2ZSh2bSk7XG5cblx0fSk7XG5cblx0cmV0dXJuIHdpbmRvdy5tYW5pbGE7XG5cbn1cblxud2luZG93Lm1hbmlsYS5jb21wb25lbnQgPSBjb21wb25lbnQ7XG53aW5kb3cubWFuaWxhLmNvbXBvbmVudHMgPSBjb21wb25lbnRzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0Y29tcG9uZW50OiBjb21wb25lbnQsXG5cdGNvbXBvbmVudHM6IGNvbXBvbmVudHNcbn07XG4iLCJjb25zdCBtYW5pbGEgPSByZXF1aXJlKCdtYW5pbGEvcGFyc2UnKTtcblxubGV0IGNhY2hlID0ge30sXG5cblx0ZXNjYXBlTWFwID0ge1xuICAgICAgICAnPCc6ICcmbHQ7JyxcbiAgICAgICAgJz4nOiAnJmd0OycsXG4gICAgICAgICdcIic6ICcmcXVvdDsnLFxuICAgICAgICAnXFwnJzogJyZhcG9zOydcbiAgICB9O1xuXG5mdW5jdGlvbiBodG1sRXNjYXBlKHN0cikge1xuXG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bJjw+J1wiXS9nLCBjID0+IHtcblxuICAgICAgICByZXR1cm4gZXNjYXBlTWFwW2NdO1xuXG4gICAgfSk7XG5cbn1cblxud2luZG93Lm1hbmlsYSA9IHdpbmRvdy5tYW5pbGEgfHwge307XG5cbndpbmRvdy5tYW5pbGEuZSA9IGZ1bmN0aW9uKHZhbCkge1xuXG4gICAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnID8gaHRtbEVzY2FwZSh2YWwpIDogdmFsO1xuICAgIFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21waWxlKHNlbGVjdG9yKSB7XG5cblx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuXG5cdFx0aWYgKCFzZWxlY3Rvcikge1xuXG5cdFx0XHRyZXNvbHZlKCAoKT0+e30gKTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdGlmIChjYWNoZVtzZWxlY3Rvcl0pIHtcblxuXHRcdFx0XHRyZXNvbHZlKGNhY2hlW3NlbGVjdG9yXSk7XG5cblx0XHRcdH1cblxuXHRcdFx0Y2FjaGVbc2VsZWN0b3JdID0gbWFuaWxhKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpLmlubmVySFRNTCk7XG5cblx0XHRcdHJlc29sdmUoY2FjaGVbc2VsZWN0b3JdKTtcblxuXHRcdH1cblxuXHR9KTtcblxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0ZW1wbGF0ZSkge1xuXG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbignY29udGV4dCcsXG5cbiAgICAgICAgXCJ2YXIgcD1bXTt3aXRoKGNvbnRleHQpe3AucHVzaChgXCIgK1xuICAgICAgIFxuICAgICAgICB0ZW1wbGF0ZVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFwnL2csIFwiXFxcXFxcXFwnXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvYC9nLCBcIlxcXFxgXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvPDo6KD8hXFxzKn0uKj86Oj4pKD8hLip7XFxzKjo6PikoLio/KTo6Pi9nLCBcImApO3RyeXtwLnB1c2goJDEpfWNhdGNoKGUpe31wLnB1c2goYFwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoLzw6OlxccyooLio/KVxccyo6Oj4vZywgXCJgKTskMVxcbnAucHVzaChgXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvPDooPyFcXHMqfS4qPzo+KSg/IS4qe1xccyo6PikoLio/KTo+L2csIFwiYCk7dHJ5e3AucHVzaChtYW5pbGEuZSgkMSkpfWNhdGNoKGUpe31wLnB1c2goYFwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoLzw6XFxzKiguKj8pXFxzKjo+L2csIFwiYCk7JDFcXG5wLnB1c2goYFwiKVxuXG4gICAgICArIFwiYCk7fXJldHVybiBwLmpvaW4oJycpO1wiKTtcbn07Il19
