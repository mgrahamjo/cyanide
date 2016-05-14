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

			vm.parent = dir.parent;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvYXBwLmpzIiwiYXNzZXRzL2pzL2NvbXBvbmVudHMvY29udGV4dE1lbnUuanMiLCJhc3NldHMvanMvY29tcG9uZW50cy9lZGl0b3IuanMiLCJhc3NldHMvanMvY29tcG9uZW50cy9uYXYuanMiLCJhc3NldHMvanMvY29tcG9uZW50cy90YWJzLmpzIiwiYXNzZXRzL2pzL3NyYy9hZGRLZXlib2FyZFNob3J0Y3V0cy5qcyIsImFzc2V0cy9qcy9zcmMvYWpheC5qcyIsImFzc2V0cy9qcy9zcmMvZmlsZU1hbmFnZXIuanMiLCJhc3NldHMvanMvc3JjL2xvYWRlci5qcyIsImFzc2V0cy9qcy9zcmMvc2F2ZS5qcyIsIi4uL21ubGEvY2xpZW50LmpzIiwiLi4vbW5sYS9jb21waWxlLmpzIiwiLi4vbW5sYS9ub2RlX21vZHVsZXMvbWFuaWxhL3BhcnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7QUNKQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQUksZ0JBQUo7O0FBRUEsaUJBQU8sU0FBUCxDQUFpQixhQUFqQixFQUFnQyxjQUFNOztBQUVyQyxJQUFHLElBQUgsR0FBVSxJQUFWLENBRnFDOztBQUlyQyxVQUFTLElBQVQsQ0FBYyxJQUFkLEVBQW9CLENBQXBCLEVBQXVCOztBQUV0QixJQUFFLGNBQUYsR0FGc0I7O0FBSXRCLFlBQVUsSUFBVixDQUpzQjs7QUFNdEIsS0FBRyxJQUFILEdBQVUsRUFBRSxPQUFGLENBTlk7O0FBUXRCLEtBQUcsR0FBSCxHQUFTLEVBQUUsT0FBRixDQVJhOztBQVV0QixLQUFHLE9BQUgsR0FBYSxJQUFiLENBVnNCO0VBQXZCOztBQWNBLFVBQVMsZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUMsWUFBTTs7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LFFBQU4sQ0FBUixFQVZNO0dBSlA7RUFGa0IsQ0FBbkIsQ0FGMkM7Q0FBM0I7OztBQzdCakI7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFVBQVMsUUFBVCxFQUFtQjs7QUFFaEMsV0FBTyxJQUFJLFFBQUosQ0FBYSxTQUFiLEVBRUgsb0NBRUEsU0FDSyxPQURMLENBQ2EsTUFEYixFQUNxQixPQURyQixFQUVLLE9BRkwsQ0FFYSxJQUZiLEVBRW1CLEtBRm5CLEVBR0ssT0FITCxDQUdhLHlDQUhiLEVBR3dELHNDQUh4RCxFQUlLLE9BSkwsQ0FJYSxvQkFKYixFQUltQyxpQkFKbkMsRUFLSyxPQUxMLENBS2EscUNBTGIsRUFLb0QsZ0RBTHBELEVBTUssT0FOTCxDQU1hLGtCQU5iLEVBTWlDLGlCQU5qQyxDQUZBLEdBVUEsd0JBVkEsQ0FGSixDQUZnQztDQUFuQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgYWRkS2V5Ym9hcmRTaG9ydGN1dHMgZnJvbSAnLi9zcmMvYWRkS2V5Ym9hcmRTaG9ydGN1dHMnO1xuaW1wb3J0IG5hdiBmcm9tICcuL2NvbXBvbmVudHMvbmF2JztcbmltcG9ydCBlZGl0b3IgZnJvbSAnLi9jb21wb25lbnRzL2VkaXRvcic7XG5pbXBvcnQgdGFicyBmcm9tICcuL2NvbXBvbmVudHMvdGFicyc7XG5pbXBvcnQgY29udGV4dE1lbnUgZnJvbSAnLi9jb21wb25lbnRzL2NvbnRleHRNZW51JztcbiIsImltcG9ydCBtYW5pbGEgZnJvbSAnbW5sYS9jbGllbnQnO1xuaW1wb3J0IGFqYXggZnJvbSAnLi4vc3JjL2FqYXgnO1xuaW1wb3J0IGZpbGVNYW5hZ2VyIGZyb20gJy4uL3NyYy9maWxlTWFuYWdlcic7XG5cbmxldCBjdXJyZW50O1xuXG5tYW5pbGEuY29tcG9uZW50KCdjb250ZXh0TWVudScsIHZtID0+IHtcblxuXHR2bS5maWxlID0gdHJ1ZTtcblxuXHRmdW5jdGlvbiBvcGVuKGl0ZW0sIGUpIHtcblxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGN1cnJlbnQgPSBpdGVtO1xuXG5cdFx0dm0ubGVmdCA9IGUuY2xpZW50WDtcblxuXHRcdHZtLnRvcCA9IGUuY2xpZW50WTtcblxuXHRcdHZtLnZpc2libGUgPSB0cnVlO1xuXG5cdH1cblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblxuXHRcdGlmICh2bS52aXNpYmxlKSB7XG5cblx0XHRcdHZtLnZpc2libGUgPSBmYWxzZTtcblxuXHRcdFx0dm0ucmVuZGVyKCk7XG5cblx0XHR9XG5cblx0fSk7XG5cblx0dm0ucmVuYW1lID0gKCkgPT4ge1xuXG5cdFx0dm0udmlzaWJsZSA9IGZhbHNlO1xuXG5cdFx0dm0ucmVuZGVyKCk7XG5cblx0XHRsZXQgbmFtZSA9IHByb21wdCgnTmV3IG5hbWU6Jyk7XG5cblx0XHRpZiAobmFtZSkge1xuXG5cdFx0XHRhamF4LnBvc3QoXG5cblx0XHRcdFx0Jy9yZW5hbWU/cGF0aD0nICsgY3VycmVudC5wYXRoLFxuXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRuYW1lOiBuYW1lXG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0cmVzdWx0ID0+IHtcblxuXHRcdFx0XHRcdGlmIChyZXN1bHQuZXJyb3IpIHtcblxuXHRcdFx0XHRcdFx0YWxlcnQocmVzdWx0LmVycm9yKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IocmVzdWx0LmVycm9yKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0XHR2bS5yZW5kZXIoKTtcblxuXHRcdFx0XHRcdFx0ZmlsZU1hbmFnZXIuY2xvc2UoY3VycmVudCk7XG5cblx0XHRcdFx0XHRcdGN1cnJlbnQubmFtZSA9IG5hbWU7XG5cblx0XHRcdFx0XHRcdGN1cnJlbnQucGF0aCA9IHJlc3VsdC5kYXRhO1xuXG5cdFx0XHRcdFx0XHRmaWxlTWFuYWdlci5vcGVuKGN1cnJlbnQpO1xuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHQpO1xuXG5cdFx0fVxuXG5cdH07XG5cblx0dm0uZGVsZXRlUGF0aCA9ICgpID0+IHtcblxuXHRcdHZtLnZpc2libGUgPSBmYWxzZTtcblxuXHRcdGFqYXgucG9zdChcblxuXHRcdFx0Jy9kZWxldGU/cGF0aD0nICsgY3VycmVudC5wYXRoLFxuXG5cdFx0XHRyZXN1bHQgPT4ge1xuXG5cdFx0XHRcdGlmIChyZXN1bHQuZXJyb3IpIHtcblxuXHRcdFx0XHRcdGFsZXJ0KHJlc3VsdC5lcnJvcik7XG5cdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IocmVzdWx0LmVycm9yKTtcblx0XHRcdFx0XG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRpZiAodm0uZmlsZSkge1xuXG5cdFx0XHRcdFx0XHRmaWxlTWFuYWdlci5jbG9zZShjdXJyZW50KTtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGN1cnJlbnQuZGVsZXRlZCA9IHRydWU7XG5cblx0XHRcdFx0XHRtYW5pbGEuY29tcG9uZW50cy5uYXYucmVuZGVyKCk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0XHRcblx0XHQpO1xuXG5cdH07XG5cblx0dm0ubmV3RmlsZSA9ICgpID0+IHtcblxuXHRcdHZtLnZpc2libGUgPSBmYWxzZTtcblxuXHRcdHZtLnJlbmRlcigpO1xuXG5cdFx0bGV0IG5hbWUgPSBwcm9tcHQoJ0ZpbGUgbmFtZTonKTtcblxuXHRcdGFqYXgucG9zdChcblxuXHRcdFx0Jy9uZXctZmlsZT9wYXRoPScgKyBjdXJyZW50LnBhdGgsXG5cblx0XHRcdHtcblx0XHRcdFx0bmFtZTogbmFtZVxuXHRcdFx0fSxcblxuXHRcdFx0cmVzdWx0ID0+IHtcblxuXHRcdFx0XHRpZiAocmVzdWx0LmVycm9yKSB7XG5cblx0XHRcdFx0XHRhbGVydChyZXN1bHQuZXJyb3IpO1xuXHRcdFx0XHRcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKHJlc3VsdC5lcnJvcik7XG5cdFx0XHRcdFxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0Y3VycmVudC5jaGlsZHJlbiA9IGN1cnJlbnQuY2hpbGRyZW4gfHwgeyBmaWxlczpbXSB9O1xuXG5cdFx0XHRcdFx0Y3VycmVudC5jaGlsZHJlbi5maWxlcy5wdXNoKHtcblx0XHRcdFx0XHRcdG5hbWU6IG5hbWUsXG5cdFx0XHRcdFx0XHRwYXRoOiByZXN1bHQuZGF0YVxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0bWFuaWxhLmNvbXBvbmVudHMubmF2LnJlbmRlcigpO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0KTtcblxuXHR9O1xuXG5cdHZtLm5ld0RpciA9ICgpID0+IHtcblxuXHRcdHZtLnZpc2libGUgPSBmYWxzZTtcblxuXHRcdHZtLnJlbmRlcigpO1xuXG5cdFx0bGV0IG5hbWUgPSBwcm9tcHQoJ0ZvbGRlciBuYW1lOicpO1xuXG5cdFx0YWpheC5wb3N0KFxuXG5cdFx0XHQnL25ldy1kaXI/cGF0aD0nICsgY3VycmVudC5wYXRoLFxuXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6IG5hbWVcblx0XHRcdH0sXG5cblx0XHRcdHJlc3VsdCA9PiB7XG5cblx0XHRcdFx0aWYgKHJlc3VsdC5lcnJvcikge1xuXG5cdFx0XHRcdFx0YWxlcnQocmVzdWx0LmVycm9yKTtcblx0XHRcdFx0XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihyZXN1bHQuZXJyb3IpO1xuXHRcdFx0XHRcblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdGN1cnJlbnQuY2hpbGRyZW4gPSBjdXJyZW50LmNoaWxkcmVuIHx8IHsgZGlyczpbXSB9O1xuXG5cdFx0XHRcdFx0Y3VycmVudC5jaGlsZHJlbi5kaXJzLnB1c2goe1xuXHRcdFx0XHRcdFx0bmFtZTogbmFtZSxcblx0XHRcdFx0XHRcdHBhdGg6IHJlc3VsdC5kYXRhXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRtYW5pbGEuY29tcG9uZW50cy5uYXYucmVuZGVyKCk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0XHRcblx0XHQpO1xuXG5cdH07XG5cblx0cmV0dXJuIHtcblxuXHRcdHJpZ2h0Q2xpY2tEaXI6IChkaXIsIGUpID0+IHtcblxuXHRcdFx0dm0uZmlsZSA9IGZhbHNlO1xuXG5cdFx0XHR2bS5wYXJlbnQgPSBkaXIucGFyZW50O1xuXG5cdFx0XHRvcGVuKGRpciwgZSk7XG5cblx0XHR9LFxuXG5cdFx0cmlnaHRDbGlja0ZpbGU6IChmaWxlLCBlKSA9PiB7XG5cblx0XHRcdHZtLmZpbGUgPSB0cnVlO1xuXG5cdFx0XHRvcGVuKGZpbGUsIGUpXG5cblx0XHR9XG5cblx0fVxuXG59KTtcbiIsImltcG9ydCBsb2FkZXIgZnJvbSAnLi4vc3JjL2xvYWRlcic7XG5pbXBvcnQgYWpheCBmcm9tICcuLi9zcmMvYWpheCc7XG5pbXBvcnQgbWFuaWxhIGZyb20gJ21ubGEvY2xpZW50JztcblxuZnVuY3Rpb24gcmVzZXRIZWlnaHQoZSkge1xuXG5cdGxldCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZXh0JyksXG5cblx0XHRudW1iZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm51bWJlcnMnKSxcblxuXHRcdGhlaWdodDtcblxuXHRlbC5zdHlsZS5oZWlnaHQgPSAnJztcblxuXHRoZWlnaHQgPSBlbC5zY3JvbGxIZWlnaHQ7XG5cblx0bnVtYmVycy5zdHlsZS5oZWlnaHQgPSAnJztcblxuXHRpZiAobnVtYmVycy5jbGllbnRIZWlnaHQgPCBoZWlnaHQpIHtcblxuXHRcdHdoaWxlIChudW1iZXJzLmNsaWVudEhlaWdodCA8IGhlaWdodCkge1xuXG5cdFx0XHRudW1iZXJzLmlubmVySFRNTCArPSAnPGRpdiBjbGFzcz1cIm51bVwiPjwvZGl2Pic7XG5cblx0XHR9XG5cblx0fSBlbHNlIHtcblxuXHRcdG51bWJlcnMuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcblxuXHR9XG5cblx0ZWwuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcblxufVxuXG5tYW5pbGEuY29tcG9uZW50KCdlZGl0b3InLCB2bSA9PiB7XG5cblx0dm0ucmVzZXRIZWlnaHQgPSByZXNldEhlaWdodDtcblxuXHRmdW5jdGlvbiBzaG93VGV4dCh0ZXh0KSB7XG5cblx0XHR2bS50ZXh0ID0gdGV4dDtcblxuXHRcdGxvYWRlci5oaWRlKCk7XG5cblx0XHR2bS5yZW5kZXIoKTtcblxuXHR9XG5cblx0cmV0dXJuIHtcblxuXHRcdHVwZGF0ZTogcGF0aCA9PiB7XG5cblx0XHRcdGxvYWRlci5hZnRlcignLm92ZXJsYXknKTtcblxuXHRcdFx0aWYgKHBhdGgpIHtcblxuXHRcdFx0XHRhamF4LmdldCgnL29wZW4/ZmlsZT0nICsgcGF0aCwgZGF0YSA9PiB7XG5cblx0XHRcdFx0XHRzaG93VGV4dChkYXRhLmRhdGEpO1xuXG5cdFx0XHRcdFx0dm0ucmVzZXRIZWlnaHQoKTtcblxuXHRcdFx0XHR9KTtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRzaG93VGV4dCgnJyk7XG5cblx0XHRcdFx0dm0ucmVzZXRIZWlnaHQoKTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdH07XG5cbn0pO1xuIiwiaW1wb3J0IGZpbGVNYW5hZ2VyIGZyb20gJy4uL3NyYy9maWxlTWFuYWdlcic7XG5pbXBvcnQgYWpheCBmcm9tICcuLi9zcmMvYWpheCc7XG5pbXBvcnQgbWFuaWxhIGZyb20gJ21ubGEvY2xpZW50JztcblxubWFuaWxhLmNvbXBvbmVudCgnbmF2Jywgdm0gPT4ge1xuXG5cdHZtLm9wZW4gPSB7fTtcblxuXHR2bS5jbGlja0RpciA9IGRpciA9PiB7XG5cblx0XHRkaXIub3BlbiA9ICFkaXIub3BlbjtcblxuXHRcdGlmICghZGlyLmNoaWxkcmVuKSB7XG5cblx0XHRcdGFqYXguZ2V0KCcvbmF2P3BhdGg9JyArIGRpci5wYXRoLCBkYXRhID0+IHtcblxuXHRcdFx0XHRkaXIuY2hpbGRyZW4gPSBkYXRhLmRpcjtcblxuXHRcdFx0XHR2bS5yZW5kZXIoKTtcblxuXHRcdFx0fSk7XG5cblx0XHR9XG5cblx0fTtcblxuXHR2bS5jbGlja0ZpbGUgPSBmaWxlID0+IHtcblxuXHRcdGZpbGVNYW5hZ2VyLm9wZW4oZmlsZSk7XG5cblx0fTtcblxuXHR2bS5yaWdodENsaWNrRGlyID0gKGRpciwgZSkgPT4ge1xuXHRcblx0XHRtYW5pbGEuY29tcG9uZW50cy5jb250ZXh0TWVudS5yaWdodENsaWNrRGlyKGRpciwgZSk7XG5cblx0fTtcblxuXHR2bS5yaWdodENsaWNrRmlsZSA9IChmaWxlLCBlKSA9PiB7XG5cdFxuXHRcdG1hbmlsYS5jb21wb25lbnRzLmNvbnRleHRNZW51LnJpZ2h0Q2xpY2tGaWxlKGZpbGUsIGUpO1xuXG5cdH07XG5cblx0cmV0dXJuIHtcblxuXHRcdHVwZGF0ZTogKHBhdGgsIG9wZW4pID0+IHtcblxuXHRcdFx0aWYgKG9wZW4pIHtcblxuXHRcdFx0XHR2bS5vcGVuW3BhdGhdID0gcGF0aDtcblxuXHRcdFx0XHR2bS5hY3RpdmUgPSBwYXRoO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGRlbGV0ZSB2bS5vcGVuW3BhdGhdO1xuXG5cdFx0XHR9XG5cblx0XHR9LFxuXG5cdFx0Z2V0QWN0aXZlRmlsZTogKCkgPT4ge1xuXG5cdFx0XHRyZXR1cm4gdm0uYWN0aXZlO1xuXG5cdFx0fSxcblxuXHRcdHJlbmRlcjogKCkgPT4ge1xuXG5cdFx0XHR2bS5yZW5kZXIoKTtcblxuXHRcdH1cblxuXHR9O1xuXG59KTtcbiIsImltcG9ydCBmaWxlTWFuYWdlciBmcm9tICcuLi9zcmMvZmlsZU1hbmFnZXInO1xuaW1wb3J0IG1hbmlsYSBmcm9tICdtbmxhL2NsaWVudCc7XG5pbXBvcnQgeyBzYXZlIH0gZnJvbSAnLi4vc3JjL3NhdmUnO1xuXG5tYW5pbGEuY29tcG9uZW50KCd0YWJzJywgdm0gPT4ge1xuXG5cdHZtLnRhYnMgPSB7fTtcblxuXHR2bS5jbG9zZSA9IHBhdGggPT4ge1xuXG5cdFx0ZGVsZXRlIHZtLnRhYnNbcGF0aF07XG5cblx0XHRmaWxlTWFuYWdlci5jbG9zZSh7XG5cdFx0XHRwYXRoOiBwYXRoLFxuXHRcdFx0bmFtZTogdm0udGFic1twYXRoXVxuXHRcdH0pO1xuXG5cdH07XG5cblx0dm0ub3BlbiA9IHBhdGggPT4ge1xuXG5cdFx0ZmlsZU1hbmFnZXIub3Blbih7XG5cdFx0XHRwYXRoOiBwYXRoLFxuXHRcdFx0bmFtZTogdm0udGFic1twYXRoXVxuXHRcdH0pO1xuXG5cdH07XG5cblx0dm0uc2F2ZSA9IHNhdmU7XG5cblx0cmV0dXJuIHtcblxuXHRcdHVwZGF0ZTogKGZpbGUsIG9wZW4pID0+IHtcblxuXHRcdFx0aWYgKG9wZW4pIHtcblxuXHRcdFx0XHR2bS5hY3RpdmUgPSBmaWxlLnBhdGg7XG5cblx0XHRcdFx0dm0udGFic1tmaWxlLnBhdGhdID0gZmlsZS5uYW1lO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGRlbGV0ZSB2bS50YWJzW2ZpbGUucGF0aF07XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9O1xuXG59KTtcbiIsImltcG9ydCB7IHNhdmUgfSBmcm9tICcuL3NhdmUnO1xuXG5jb25zdCBrZXltYXAgPSB7XG5cblx0XHQ5MToge1xuXHRcdFx0Y2FsbGJhY2s6IHNhdmUsXG5cdFx0XHRwYWlyOiA4MyBcblx0XHR9LFxuXG5cdFx0ODM6IHtcblx0XHRcdGNhbGxiYWNrOiBzYXZlLFxuXHRcdFx0cGFpcjogOTFcblx0XHR9XG5cblx0fTtcblxubGV0IHByZXNzZWQgPSB7IH07XG5cblxuZnVuY3Rpb24ga2V5ZG93bihlKSB7XG5cblx0bGV0IGNvZGUgPSBlLmtleUNvZGUgfHwgZS53aGljaCxcblxuXHRcdGtleSA9IGtleW1hcFtjb2RlXTtcblxuXHRpZiAoa2V5KSB7XG5cblx0XHRwcmVzc2VkW2NvZGVdID0gdHJ1ZTtcblxuXHRcdGlmIChwcmVzc2VkW2tleS5wYWlyXSkge1xuXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGtleS5jYWxsYmFjaygpO1xuXG5cdFx0XHRkZWxldGUgcHJlc3NlZFtjb2RlXTtcblx0XHRcdGRlbGV0ZSBwcmVzc2VkW2tleS5wYWlyXTtcblxuXHRcdH1cblxuXHR9XG5cbn1cblxuXG5mdW5jdGlvbiBrZXl1cChlKSB7XG5cblx0ZGVsZXRlIHByZXNzZWRbZS5rZXlDb2RlIHx8IGUud2hpY2hdO1xuXG59XG5cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGtleWRvd24pO1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBrZXl1cCk7XG4iLCJmdW5jdGlvbiBzZXJpYWxpemUoZGF0YSkge1xuIFxuIFx0bGV0IHBhcnRzID0gW107XG4gXG4gXHRmb3IgKGxldCBrZXkgaW4gZGF0YSkge1xuIFxuIFx0XHRwYXJ0cy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQoZGF0YVtrZXldKSk7XG5cbiBcdH1cbiBcbiBcdHJldHVybiBwYXJ0cy5qb2luKCcmJyk7XG59XG4gXG5mdW5jdGlvbiBnZXQocGF0aCwgZGF0YSwgY2FsbGJhY2spIHtcblxuXHRpZiAodHlwZW9mIGRhdGEgPT09ICdmdW5jdGlvbicpIHtcblxuXHRcdGNhbGxiYWNrID0gZGF0YTtcblxuXHR9XG4gXG4gXHRsZXQgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gXG4gXHRpZiAodHlwZW9mIGRhdGEgPT09ICdmdW5jdGlvbicpIHtcbiBcbiBcdFx0Y2FsbGJhY2sgPSBkYXRhO1xuIFxuIFx0XHRkYXRhID0ge307XG5cbiBcdH1cbiBcbiBcdHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gXG4gXHRcdGlmIChyZXEucmVhZHlTdGF0ZSA9PSA0ICYmIHJlcS5zdGF0dXMgPT0gMjAwKSB7XG4gXG4gXHRcdFx0bGV0IHJlc3VsdCA9IHZvaWQgMDtcbiBcbiBcdFx0XHR0cnkge1xuIFxuIFx0XHRcdFx0cmVzdWx0ID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcblxuIFx0XHRcdH0gY2F0Y2ggKGVycikge1xuIFxuIFx0XHRcdFx0cmVzdWx0ID0gcmVxLnJlc3BvbnNlVGV4dDtcblxuIFx0XHRcdH1cbiBcbiBcdFx0XHRjYWxsYmFjayhyZXN1bHQpO1xuIFx0XHR9XG5cbiBcdH07XG4gXG4gXHRyZXEub3BlbignR0VUJywgcGF0aCk7XG4gXG4gXHRyZXEuc2VuZChzZXJpYWxpemUoZGF0YSkpO1xuXG59XG4gXG5mdW5jdGlvbiBwb3N0KHBhdGgsIGRhdGEsIGNhbGxiYWNrKSB7XG5cblx0aWYgKHR5cGVvZiBkYXRhID09PSAnZnVuY3Rpb24nKSB7XG5cblx0XHRjYWxsYmFjayA9IGRhdGE7XG5cblx0fVxuIFxuIFx0bGV0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuIFxuIFx0cmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiBcbiBcdFx0aWYgKHJlcS5yZWFkeVN0YXRlID09IDQgJiYgcmVxLnN0YXR1cyA9PSAyMDApIHtcbiBcbiBcdFx0XHRsZXQganNvbiA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gXG4gXHRcdFx0aWYgKGpzb24pIHtcbiBcbiBcdFx0XHRcdGNhbGxiYWNrKGpzb24pO1xuXG4gXHRcdFx0fSBlbHNlIHtcbiBcbiBcdFx0XHRcdGNhbGxiYWNrKHJlcS5yZXNwb25zZVRleHQpO1xuXG4gXHRcdFx0fVxuXG4gXHRcdH1cblxuIFx0fTtcbiBcbiBcdHJlcS5vcGVuKCdQT1NUJywgcGF0aCk7XG4gXG4gXHRyZXEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xuIFxuIFx0cmVxLnNlbmQoc2VyaWFsaXplKGRhdGEpKTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuIFx0Z2V0OiBnZXQsXG4gXHRwb3N0OiBwb3N0XG4gXG59O1xuIiwiaW1wb3J0IG1hbmlsYSBmcm9tICdtbmxhL2NsaWVudCc7XG5cbmxldCBvcGVuRmlsZXMgPSB7fTtcblxuZnVuY3Rpb24gb3BlbihmaWxlKSB7XG5cblx0bWFuaWxhLmNvbXBvbmVudHMuZWRpdG9yLnVwZGF0ZShmaWxlLnBhdGgpO1xuXG5cdG1hbmlsYS5jb21wb25lbnRzLm5hdi51cGRhdGUoZmlsZS5wYXRoLCB0cnVlKTtcblxuXHRtYW5pbGEuY29tcG9uZW50cy50YWJzLnVwZGF0ZShmaWxlLCB0cnVlKTtcblxuXHRvcGVuRmlsZXNbZmlsZS5wYXRoXSA9IGZpbGU7XG5cbn1cblxuZnVuY3Rpb24gY2xvc2UoZmlsZSkge1xuXG5cdGxldCBvcGVuTGlzdDtcblxuXHRtYW5pbGEuY29tcG9uZW50cy5lZGl0b3IudXBkYXRlKCcnKTtcblxuXHRtYW5pbGEuY29tcG9uZW50cy5uYXYudXBkYXRlKGZpbGUucGF0aCwgZmFsc2UpO1xuXHRcblx0bWFuaWxhLmNvbXBvbmVudHMudGFicy51cGRhdGUoZmlsZSwgZmFsc2UpO1xuXG5cdGRlbGV0ZSBvcGVuRmlsZXNbZmlsZS5wYXRoXTtcblxuXHRvcGVuTGlzdCA9IE9iamVjdC5rZXlzKG9wZW5GaWxlcyk7XG5cblx0aWYgKG9wZW5MaXN0Lmxlbmd0aCkge1xuXG5cdFx0b3BlbihvcGVuRmlsZXNbb3Blbkxpc3Rbb3Blbkxpc3QubGVuZ3RoIC0gMV1dKTtcblxuXHR9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuXG5cdG9wZW46IG9wZW4sXG5cdGNsb3NlOiBjbG9zZVxuXG59OyIsImxldCBsb2FkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbG9hZGVyLXRlbXBsYXRlJykuaW5uZXJIVE1MO1xuXG5mdW5jdGlvbiBmYWRlSW4oKSB7XG5cblx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG5cdFx0XG5cdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxvYWRlcicpLmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKTtcblxuXHR9KTtcblxufVxuXG5mdW5jdGlvbiByZXBsYWNlKGh0bWwpIHtcblxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyJykub3V0ZXJIVE1MID0gaHRtbDtcblxufVxuXG5mdW5jdGlvbiBhZnRlcihlbCkge1xuXG5cdGlmICh0eXBlb2YgZWwgPT09ICdzdHJpbmcnKSB7XG5cblx0XHRlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpO1xuXG5cdH1cblxuXHRlbC5vdXRlckhUTUwgKz0gbG9hZGVyO1xuXG5cdGZhZGVJbigpO1xuXG59XG5cblxuZnVuY3Rpb24gaGlkZSgpIHtcblxuXHRsZXQgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyJyk7XG5cblx0aWYgKGVsKSB7XG5cblx0XHRlbC5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJyk7XG5cblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcblxuXHRcdH0sIDYwMCk7XG5cblx0fVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0XG5cdHJlcGxhY2U6IHJlcGxhY2UsXG5cdGFmdGVyOiBhZnRlcixcblx0aGlkZTogaGlkZVxuXG59OyIsImltcG9ydCBtYW5pbGEgZnJvbSAnbW5sYS9jbGllbnQnO1xuaW1wb3J0IGFqYXggZnJvbSAnLi4vc3JjL2FqYXgnO1xuXG5sZXQgYmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmFja2dyb3VuZCcpXG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlKCkge1xuXG5cdGxldCBmaWxlID0gbWFuaWxhLmNvbXBvbmVudHMubmF2LmdldEFjdGl2ZUZpbGUoKTtcblxuXHRpZiAoZmlsZSkge1xuXG5cdFx0YmcuY2xhc3NMaXN0LmFkZCgnYmx1cicpO1xuXG5cdFx0YWpheC5wb3N0KFxuXG5cdFx0XHQnL3NhdmU/ZmlsZT0nICsgZmlsZSxcblxuXHRcdFx0e1xuXHRcdFx0XHRkYXRhOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGV4dCcpLnZhbHVlXG5cdFx0XHR9LFxuXG5cdFx0XHRyZXN1bHQgPT4ge1xuXG5cdFx0XHRcdGlmIChyZXN1bHQuZXJyb3IpIHtcblxuXHRcdFx0XHRcdGFsZXJ0KHJlc3VsdC5lcnJvcik7XG5cdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IocmVzdWx0LmVycm9yKTtcblx0XHRcdFx0XG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRiZy5jbGFzc0xpc3QucmVtb3ZlKCdibHVyJyk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0XHRcblx0XHQpO1xuXG5cdH1cblxufTsiLCJjb25zdCBjb21waWxlID0gcmVxdWlyZSgnLi9jb21waWxlJyk7XG5cbndpbmRvdy5tYW5pbGEgPSB3aW5kb3cubWFuaWxhIHx8IHt9O1xuXG53aW5kb3cubWFuaWxhLmhhbmRsZXJzID0ge307XG5cbmxldCBjb21wb25lbnRzID0ge30sXG5cdFxuXHRzZWxlY3Rpb247XG5cbmZ1bmN0aW9uIGNvbXBvbmVudChjb21wb25lbnROYW1lLCBjb21wb25lbnQpIHtcblxuXHRsZXQgdm0gPSB3aW5kb3cubWFuaWxhLmRhdGFbY29tcG9uZW50TmFtZV0gfHwge30sXG5cblx0XHRlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWNvbXBvbmVudD1cIiR7Y29tcG9uZW50TmFtZX1cIl1gKTtcblxuXHRjb21waWxlKGAjJHtjb21wb25lbnROYW1lfS10ZW1wbGF0ZWApLnRoZW4ocmVuZGVyID0+IHtcblxuXHRcdGZ1bmN0aW9uIHJlc29sdmUoZGF0YSkge1xuXG5cdFx0XHRsZXQgaW5kZXggPSAwO1xuXG5cdFx0XHR3aW5kb3cubWFuaWxhLmhhbmRsZXJzW2NvbXBvbmVudE5hbWVdID0gW107XG5cblx0XHRcdGRhdGEub24gPSAoZXZlbnQsIGhhbmRsZXIsIC4uLmFyZ3MpID0+IHtcblxuXHRcdFx0XHRsZXQgZXZlbnRTdHJpbmc7XG5cblx0XHRcdFx0d2luZG93Lm1hbmlsYS5oYW5kbGVyc1tjb21wb25lbnROYW1lXVtpbmRleF0gPSBlID0+IHtcblxuXHRcdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0YXJncy5wdXNoKGUpO1xuXG5cdFx0XHRcdFx0aGFuZGxlci5hcHBseShkYXRhLCBhcmdzKTtcblxuXHRcdFx0XHRcdGlmIChlLnRhcmdldC50YWdOYW1lICE9PSAnSU5QVVQnICYmIGUudGFyZ2V0LnRhZ05hbWUgIT09ICdURVhUQVJFQScpIHtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhKTtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGV2ZW50U3RyaW5nID0gYG9uJHtldmVudH09bWFuaWxhLmhhbmRsZXJzLiR7Y29tcG9uZW50TmFtZX1bJHtpbmRleH1dKGV2ZW50KWA7XG5cblx0XHRcdFx0aW5kZXgrKztcblxuXHRcdFx0XHRyZXR1cm4gZXZlbnRTdHJpbmc7XG5cblx0XHRcdH07XG5cblx0XHRcdGVsLmlubmVySFRNTCA9IHJlbmRlcihkYXRhKTtcblxuXHRcdH1cblxuXHRcdHZtLnJlbmRlciA9ICgpID0+IHtcblxuXHRcdFx0cmVzb2x2ZSh2bSk7XG5cdFx0XHRcblx0XHR9O1xuXG5cdFx0bGV0IG1ldGhvZHMgPSBjb21wb25lbnQodm0pO1xuXG5cdFx0aWYgKG1ldGhvZHMpIHtcblxuXHRcdFx0Y29tcG9uZW50c1tjb21wb25lbnROYW1lXSA9IHt9O1xuXG5cdFx0XHRPYmplY3Qua2V5cyhtZXRob2RzKS5mb3JFYWNoKGtleSA9PiB7XG5cblx0XHRcdFx0Y29tcG9uZW50c1tjb21wb25lbnROYW1lXVtrZXldID0gKC4uLmFyZ3MpID0+IHtcblxuXHRcdFx0XHRcdGxldCByZXN1bHQgPSBtZXRob2RzW2tleV0uYXBwbHkodm0sIGFyZ3MpO1xuXG5cdFx0XHRcdFx0cmVzb2x2ZSh2bSk7XG5cblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXG5cdFx0XHRcdH07XG5cblx0XHRcdH0pO1xuXG5cdFx0fVxuXG5cdFx0cmVzb2x2ZSh2bSk7XG5cblx0fSk7XG5cblx0cmV0dXJuIHdpbmRvdy5tYW5pbGE7XG5cbn1cblxud2luZG93Lm1hbmlsYS5jb21wb25lbnQgPSBjb21wb25lbnQ7XG53aW5kb3cubWFuaWxhLmNvbXBvbmVudHMgPSBjb21wb25lbnRzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0Y29tcG9uZW50OiBjb21wb25lbnQsXG5cdGNvbXBvbmVudHM6IGNvbXBvbmVudHNcbn07XG4iLCJjb25zdCBtYW5pbGEgPSByZXF1aXJlKCdtYW5pbGEvcGFyc2UnKTtcblxubGV0IGNhY2hlID0ge30sXG5cblx0ZXNjYXBlTWFwID0ge1xuICAgICAgICAnPCc6ICcmbHQ7JyxcbiAgICAgICAgJz4nOiAnJmd0OycsXG4gICAgICAgICdcIic6ICcmcXVvdDsnLFxuICAgICAgICAnXFwnJzogJyZhcG9zOydcbiAgICB9O1xuXG5mdW5jdGlvbiBodG1sRXNjYXBlKHN0cikge1xuXG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bJjw+J1wiXS9nLCBjID0+IHtcblxuICAgICAgICByZXR1cm4gZXNjYXBlTWFwW2NdO1xuXG4gICAgfSk7XG5cbn1cblxud2luZG93Lm1hbmlsYSA9IHdpbmRvdy5tYW5pbGEgfHwge307XG5cbndpbmRvdy5tYW5pbGEuZSA9IGZ1bmN0aW9uKHZhbCkge1xuXG4gICAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnID8gaHRtbEVzY2FwZSh2YWwpIDogdmFsO1xuICAgIFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21waWxlKHNlbGVjdG9yKSB7XG5cblx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuXG5cdFx0aWYgKCFzZWxlY3Rvcikge1xuXG5cdFx0XHRyZXNvbHZlKCAoKT0+e30gKTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdGlmIChjYWNoZVtzZWxlY3Rvcl0pIHtcblxuXHRcdFx0XHRyZXNvbHZlKGNhY2hlW3NlbGVjdG9yXSk7XG5cblx0XHRcdH1cblxuXHRcdFx0Y2FjaGVbc2VsZWN0b3JdID0gbWFuaWxhKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpLmlubmVySFRNTCk7XG5cblx0XHRcdHJlc29sdmUoY2FjaGVbc2VsZWN0b3JdKTtcblxuXHRcdH1cblxuXHR9KTtcblxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0ZW1wbGF0ZSkge1xuXG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbignY29udGV4dCcsXG5cbiAgICAgICAgXCJ2YXIgcD1bXTt3aXRoKGNvbnRleHQpe3AucHVzaChgXCIgK1xuICAgICAgIFxuICAgICAgICB0ZW1wbGF0ZVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFwnL2csIFwiXFxcXFxcXFwnXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvYC9nLCBcIlxcXFxgXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvPDo6KD8hXFxzKn0uKj86Oj4pKD8hLip7XFxzKjo6PikoLio/KTo6Pi9nLCBcImApO3RyeXtwLnB1c2goJDEpfWNhdGNoKGUpe31wLnB1c2goYFwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoLzw6OlxccyooLio/KVxccyo6Oj4vZywgXCJgKTskMVxcbnAucHVzaChgXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvPDooPyFcXHMqfS4qPzo+KSg/IS4qe1xccyo6PikoLio/KTo+L2csIFwiYCk7dHJ5e3AucHVzaChtYW5pbGEuZSgkMSkpfWNhdGNoKGUpe31wLnB1c2goYFwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoLzw6XFxzKiguKj8pXFxzKjo+L2csIFwiYCk7JDFcXG5wLnB1c2goYFwiKVxuXG4gICAgICArIFwiYCk7fXJldHVybiBwLmpvaW4oJycpO1wiKTtcbn07Il19
