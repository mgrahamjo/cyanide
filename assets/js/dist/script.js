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

},{"../src/ajax":7,"../src/fileManager":8,"mnla/client":10}],3:[function(require,module,exports){
'use strict';

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

		delete vm.loading;

		vm.render();
	}

	setTimeout(function () {
		resetHeight();
	});

	return {

		update: function update(path) {

			if (path) {

				vm.loading = true;

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

},{"../src/ajax":7,"mnla/client":10}],4:[function(require,module,exports){
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

	vm.clickDir = function (dir, e) {

		dir.open = !dir.open;

		if (!dir.children) {

			vm.loading = true;

			_ajax2.default.get('/nav?path=' + dir.path, function (data) {

				dir.children = data.dir;

				delete vm.loading;

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

},{"../src/ajax":7,"../src/fileManager":8,"mnla/client":10}],5:[function(require,module,exports){
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

},{"../src/fileManager":8,"../src/save":9,"mnla/client":10}],6:[function(require,module,exports){
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

},{"./save":9}],7:[function(require,module,exports){
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

},{"mnla/client":10}],9:[function(require,module,exports){
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

},{"../src/ajax":7,"mnla/client":10}],10:[function(require,module,exports){
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

    return new Function('context', "var p=[];with(context){p.push(`" + template.replace(/\\'/g, "\\\\'").replace(/`/g, "\\`").replace(/<::(?!\s*}.*?::>)(?!.*{\s*::>)(.*?)::>/g, "`);try{p.push($1)}catch(e){}p.push(`").replace(/<::\s*(.*?)\s*::>/g, "`);$1\np.push(`").replace(/<:(?!\s*}.*?:>)(?!.*{\s*:>)(.*?):>/g, "`);try{p.push(manila.e($1))}catch(e){}p.push(`").replace(/<:\s*(.*?)\s*:>/g, "`);$1\np.push(`") + "`);}return p.join('');");
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvYXBwLmpzIiwiYXNzZXRzL2pzL2NvbXBvbmVudHMvY29udGV4dE1lbnUuanMiLCJhc3NldHMvanMvY29tcG9uZW50cy9lZGl0b3IuanMiLCJhc3NldHMvanMvY29tcG9uZW50cy9uYXYuanMiLCJhc3NldHMvanMvY29tcG9uZW50cy90YWJzLmpzIiwiYXNzZXRzL2pzL3NyYy9hZGRLZXlib2FyZFNob3J0Y3V0cy5qcyIsImFzc2V0cy9qcy9zcmMvYWpheC5qcyIsImFzc2V0cy9qcy9zcmMvZmlsZU1hbmFnZXIuanMiLCJhc3NldHMvanMvc3JjL3NhdmUuanMiLCIuLi9tbmxhL2NsaWVudC5qcyIsIi4uL21ubGEvY29tcGlsZS5qcyIsIi4uL21ubGEvbm9kZV9tb2R1bGVzL21hbmlsYS9wYXJzZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7O0FDSkE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFJLGdCQUFKOztBQUVBLGlCQUFPLFNBQVAsQ0FBaUIsYUFBakIsRUFBZ0MsY0FBTTs7QUFFckMsSUFBRyxJQUFILEdBQVUsSUFBVixDQUZxQzs7QUFJckMsVUFBUyxJQUFULENBQWMsSUFBZCxFQUFvQixDQUFwQixFQUF1Qjs7QUFFdEIsSUFBRSxjQUFGLEdBRnNCOztBQUl0QixZQUFVLElBQVYsQ0FKc0I7O0FBTXRCLEtBQUcsSUFBSCxHQUFVLEVBQUUsT0FBRixDQU5ZOztBQVF0QixLQUFHLEdBQUgsR0FBUyxFQUFFLE9BQUYsQ0FSYTs7QUFVdEIsS0FBRyxPQUFILEdBQWEsSUFBYixDQVZzQjtFQUF2Qjs7QUFjQSxVQUFTLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DLFlBQU07O0FBRXhDLE1BQUksR0FBRyxPQUFILEVBQVk7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U0FBUyxPQUFULENBQWlCLFFBQWpCLEVBQTJCOztBQUUzQyxRQUFPLElBQUksT0FBSixDQUFZLG1CQUFXOztBQUU3QixNQUFJLENBQUMsUUFBRCxFQUFXOztBQUVkLFdBQVMsWUFBSSxFQUFKLENBQVQsQ0FGYztHQUFmLE1BSU87O0FBRU4sT0FBSSxNQUFNLFFBQU4sQ0FBSixFQUFxQjs7QUFFcEIsWUFBUSxNQUFNLFFBQU4sQ0FBUixFQUZvQjtJQUFyQjs7QUFNQSxTQUFNLFFBQU4sSUFBa0IsT0FBTyxTQUFTLGFBQVQsQ0FBdUIsUUFBdkIsRUFBaUMsU0FBakMsQ0FBekIsQ0FSTTs7QUFVTixXQUFRLE1BQU0sUUFBTixDQUFSLEVBVk07R0FKUDtFQUZrQixDQUFuQixDQUYyQztDQUEzQjs7O0FDN0JqQjs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsVUFBUyxRQUFULEVBQW1COztBQUVoQyxXQUFPLElBQUksUUFBSixDQUFhLFNBQWIsRUFFSCxvQ0FFQSxTQUNLLE9BREwsQ0FDYSxNQURiLEVBQ3FCLE9BRHJCLEVBRUssT0FGTCxDQUVhLElBRmIsRUFFbUIsS0FGbkIsRUFHSyxPQUhMLENBR2EseUNBSGIsRUFHd0Qsc0NBSHhELEVBSUssT0FKTCxDQUlhLG9CQUpiLEVBSW1DLGlCQUpuQyxFQUtLLE9BTEwsQ0FLYSxxQ0FMYixFQUtvRCxnREFMcEQsRUFNSyxPQU5MLENBTWEsa0JBTmIsRUFNaUMsaUJBTmpDLENBRkEsR0FVQSx3QkFWQSxDQUZKLENBRmdDO0NBQW5CIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBhZGRLZXlib2FyZFNob3J0Y3V0cyBmcm9tICcuL3NyYy9hZGRLZXlib2FyZFNob3J0Y3V0cyc7XG5pbXBvcnQgbmF2IGZyb20gJy4vY29tcG9uZW50cy9uYXYnO1xuaW1wb3J0IGVkaXRvciBmcm9tICcuL2NvbXBvbmVudHMvZWRpdG9yJztcbmltcG9ydCB0YWJzIGZyb20gJy4vY29tcG9uZW50cy90YWJzJztcbmltcG9ydCBjb250ZXh0TWVudSBmcm9tICcuL2NvbXBvbmVudHMvY29udGV4dE1lbnUnO1xuIiwiaW1wb3J0IG1hbmlsYSBmcm9tICdtbmxhL2NsaWVudCc7XG5pbXBvcnQgYWpheCBmcm9tICcuLi9zcmMvYWpheCc7XG5pbXBvcnQgZmlsZU1hbmFnZXIgZnJvbSAnLi4vc3JjL2ZpbGVNYW5hZ2VyJztcblxubGV0IGN1cnJlbnQ7XG5cbm1hbmlsYS5jb21wb25lbnQoJ2NvbnRleHRNZW51Jywgdm0gPT4ge1xuXG5cdHZtLmZpbGUgPSB0cnVlO1xuXG5cdGZ1bmN0aW9uIG9wZW4oaXRlbSwgZSkge1xuXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y3VycmVudCA9IGl0ZW07XG5cblx0XHR2bS5sZWZ0ID0gZS5jbGllbnRYO1xuXG5cdFx0dm0udG9wID0gZS5jbGllbnRZO1xuXG5cdFx0dm0udmlzaWJsZSA9IHRydWU7XG5cblx0fVxuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXG5cdFx0aWYgKHZtLnZpc2libGUpIHtcblxuXHRcdFx0dm0udmlzaWJsZSA9IGZhbHNlO1xuXG5cdFx0XHR2bS5yZW5kZXIoKTtcblxuXHRcdH1cblxuXHR9KTtcblxuXHR2bS5yZW5hbWUgPSAoKSA9PiB7XG5cblx0XHR2bS52aXNpYmxlID0gZmFsc2U7XG5cblx0XHR2bS5yZW5kZXIoKTtcblxuXHRcdGxldCBuYW1lID0gcHJvbXB0KCdOZXcgbmFtZTonKTtcblxuXHRcdGlmIChuYW1lKSB7XG5cblx0XHRcdGFqYXgucG9zdChcblxuXHRcdFx0XHQnL3JlbmFtZT9wYXRoPScgKyBjdXJyZW50LnBhdGgsXG5cblx0XHRcdFx0e1xuXHRcdFx0XHRcdG5hbWU6IG5hbWVcblx0XHRcdFx0fSxcblxuXHRcdFx0XHRyZXN1bHQgPT4ge1xuXG5cdFx0XHRcdFx0aWYgKHJlc3VsdC5lcnJvcikge1xuXG5cdFx0XHRcdFx0XHRhbGVydChyZXN1bHQuZXJyb3IpO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihyZXN1bHQuZXJyb3IpO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdHZtLnJlbmRlcigpO1xuXG5cdFx0XHRcdFx0XHRmaWxlTWFuYWdlci5jbG9zZShjdXJyZW50KTtcblxuXHRcdFx0XHRcdFx0Y3VycmVudC5uYW1lID0gbmFtZTtcblxuXHRcdFx0XHRcdFx0Y3VycmVudC5wYXRoID0gcmVzdWx0LmRhdGE7XG5cblx0XHRcdFx0XHRcdGZpbGVNYW5hZ2VyLm9wZW4oY3VycmVudCk7XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdCk7XG5cblx0XHR9XG5cblx0fTtcblxuXHR2bS5kZWxldGVQYXRoID0gKCkgPT4ge1xuXG5cdFx0dm0udmlzaWJsZSA9IGZhbHNlO1xuXG5cdFx0YWpheC5wb3N0KFxuXG5cdFx0XHQnL2RlbGV0ZT9wYXRoPScgKyBjdXJyZW50LnBhdGgsXG5cblx0XHRcdHJlc3VsdCA9PiB7XG5cblx0XHRcdFx0aWYgKHJlc3VsdC5lcnJvcikge1xuXG5cdFx0XHRcdFx0YWxlcnQocmVzdWx0LmVycm9yKTtcblx0XHRcdFx0XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihyZXN1bHQuZXJyb3IpO1xuXHRcdFx0XHRcblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdGlmICh2bS5maWxlKSB7XG5cblx0XHRcdFx0XHRcdGZpbGVNYW5hZ2VyLmNsb3NlKGN1cnJlbnQpO1xuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Y3VycmVudC5kZWxldGVkID0gdHJ1ZTtcblxuXHRcdFx0XHRcdG1hbmlsYS5jb21wb25lbnRzLm5hdi5yZW5kZXIoKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHRcdFxuXHRcdCk7XG5cblx0fTtcblxuXHR2bS5uZXdGaWxlID0gKCkgPT4ge1xuXG5cdFx0dm0udmlzaWJsZSA9IGZhbHNlO1xuXG5cdFx0dm0ucmVuZGVyKCk7XG5cblx0XHRsZXQgbmFtZSA9IHByb21wdCgnRmlsZSBuYW1lOicpO1xuXG5cdFx0YWpheC5wb3N0KFxuXG5cdFx0XHQnL25ldy1maWxlP3BhdGg9JyArIGN1cnJlbnQucGF0aCxcblxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiBuYW1lXG5cdFx0XHR9LFxuXG5cdFx0XHRyZXN1bHQgPT4ge1xuXG5cdFx0XHRcdGlmIChyZXN1bHQuZXJyb3IpIHtcblxuXHRcdFx0XHRcdGFsZXJ0KHJlc3VsdC5lcnJvcik7XG5cdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IocmVzdWx0LmVycm9yKTtcblx0XHRcdFx0XG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRsZXQgbmV3RmlsZSA9IHtcblx0XHRcdFx0XHRcdG5hbWU6IG5hbWUsXG5cdFx0XHRcdFx0XHRwYXRoOiByZXN1bHQuZGF0YVxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRjdXJyZW50LmNoaWxkcmVuID0gY3VycmVudC5jaGlsZHJlbiB8fCB7IGZpbGVzOltdIH07XG5cblx0XHRcdFx0XHRjdXJyZW50LmNoaWxkcmVuLmZpbGVzLnB1c2gobmV3RmlsZSk7XG5cblx0XHRcdFx0XHRmaWxlTWFuYWdlci5vcGVuKG5ld0ZpbGUpO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0KTtcblxuXHR9O1xuXG5cdHZtLm5ld0RpciA9ICgpID0+IHtcblxuXHRcdHZtLnZpc2libGUgPSBmYWxzZTtcblxuXHRcdHZtLnJlbmRlcigpO1xuXG5cdFx0bGV0IG5hbWUgPSBwcm9tcHQoJ0ZvbGRlciBuYW1lOicpO1xuXG5cdFx0YWpheC5wb3N0KFxuXG5cdFx0XHQnL25ldy1kaXI/cGF0aD0nICsgY3VycmVudC5wYXRoLFxuXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6IG5hbWVcblx0XHRcdH0sXG5cblx0XHRcdHJlc3VsdCA9PiB7XG5cblx0XHRcdFx0aWYgKHJlc3VsdC5lcnJvcikge1xuXG5cdFx0XHRcdFx0YWxlcnQocmVzdWx0LmVycm9yKTtcblx0XHRcdFx0XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihyZXN1bHQuZXJyb3IpO1xuXHRcdFx0XHRcblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdGN1cnJlbnQuY2hpbGRyZW4gPSBjdXJyZW50LmNoaWxkcmVuIHx8IHsgZGlyczpbXSB9O1xuXG5cdFx0XHRcdFx0Y3VycmVudC5jaGlsZHJlbi5kaXJzLnB1c2goe1xuXHRcdFx0XHRcdFx0bmFtZTogbmFtZSxcblx0XHRcdFx0XHRcdHBhdGg6IHJlc3VsdC5kYXRhXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRtYW5pbGEuY29tcG9uZW50cy5uYXYucmVuZGVyKCk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0XHRcblx0XHQpO1xuXG5cdH07XG5cblx0cmV0dXJuIHtcblxuXHRcdHJpZ2h0Q2xpY2tEaXI6IChkaXIsIGUpID0+IHtcblxuXHRcdFx0dm0uZmlsZSA9IGZhbHNlO1xuXG5cdFx0XHR2bS5wYXJlbnQgPSBkaXIucGFyZW50O1xuXG5cdFx0XHRvcGVuKGRpciwgZSk7XG5cblx0XHR9LFxuXG5cdFx0cmlnaHRDbGlja0ZpbGU6IChmaWxlLCBlKSA9PiB7XG5cblx0XHRcdHZtLmZpbGUgPSB0cnVlO1xuXG5cdFx0XHR2bS5wYXJlbnQgPSBmYWxzZTtcblxuXHRcdFx0b3BlbihmaWxlLCBlKVxuXG5cdFx0fVxuXG5cdH1cblxufSk7XG4iLCJpbXBvcnQgYWpheCBmcm9tICcuLi9zcmMvYWpheCc7XG5pbXBvcnQgbWFuaWxhIGZyb20gJ21ubGEvY2xpZW50JztcblxuZnVuY3Rpb24gcmVzZXRIZWlnaHQoZSkge1xuXG5cdGxldCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZXh0JyksXG5cblx0XHRudW1iZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm51bWJlcnMnKSxcblxuXHRcdGhlaWdodDtcblxuXHRlbC5zdHlsZS5oZWlnaHQgPSAnJztcblxuXHRoZWlnaHQgPSBlbC5zY3JvbGxIZWlnaHQ7XG5cblx0bnVtYmVycy5zdHlsZS5oZWlnaHQgPSAnJztcblxuXHRpZiAobnVtYmVycy5jbGllbnRIZWlnaHQgPCBoZWlnaHQpIHtcblxuXHRcdHdoaWxlIChudW1iZXJzLmNsaWVudEhlaWdodCA8IGhlaWdodCkge1xuXG5cdFx0XHRudW1iZXJzLmlubmVySFRNTCArPSAnPGRpdiBjbGFzcz1cIm51bVwiPjwvZGl2Pic7XG5cblx0XHR9XG5cblx0fSBlbHNlIHtcblxuXHRcdG51bWJlcnMuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcblxuXHR9XG5cblx0ZWwuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcblxufVxuXG5tYW5pbGEuY29tcG9uZW50KCdlZGl0b3InLCB2bSA9PiB7XG5cblx0dm0ucmVzZXRIZWlnaHQgPSByZXNldEhlaWdodDtcblxuXHRmdW5jdGlvbiBzaG93VGV4dCh0ZXh0KSB7XG5cblx0XHR2bS50ZXh0ID0gdGV4dDtcblxuXHRcdGRlbGV0ZSB2bS5sb2FkaW5nO1xuXG5cdFx0dm0ucmVuZGVyKCk7XG5cblx0fVxuXG5cdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdHJlc2V0SGVpZ2h0KCk7XG5cdH0pO1xuXG5cdHJldHVybiB7XG5cblx0XHR1cGRhdGU6IHBhdGggPT4ge1xuXG5cdFx0XHRpZiAocGF0aCkge1xuXG5cdFx0XHRcdHZtLmxvYWRpbmcgPSB0cnVlO1xuXG5cdFx0XHRcdGFqYXguZ2V0KCcvb3Blbj9maWxlPScgKyBwYXRoLCBkYXRhID0+IHtcblxuXHRcdFx0XHRcdHNob3dUZXh0KGRhdGEuZGF0YSk7XG5cblx0XHRcdFx0XHR2bS5yZXNldEhlaWdodCgpO1xuXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdHNob3dUZXh0KCcnKTtcblxuXHRcdFx0XHR2bS5yZXNldEhlaWdodCgpO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fTtcblxufSk7XG4iLCJpbXBvcnQgZmlsZU1hbmFnZXIgZnJvbSAnLi4vc3JjL2ZpbGVNYW5hZ2VyJztcbmltcG9ydCBhamF4IGZyb20gJy4uL3NyYy9hamF4JztcbmltcG9ydCBtYW5pbGEgZnJvbSAnbW5sYS9jbGllbnQnO1xuXG5tYW5pbGEuY29tcG9uZW50KCduYXYnLCB2bSA9PiB7XG5cblx0dm0ub3BlbiA9IHt9O1xuXG5cdHZtLmNsaWNrRGlyID0gKGRpciwgZSkgPT4ge1xuXG5cdFx0ZGlyLm9wZW4gPSAhZGlyLm9wZW47XG5cblx0XHRpZiAoIWRpci5jaGlsZHJlbikge1xuXG5cdFx0XHR2bS5sb2FkaW5nID0gdHJ1ZTtcblxuXHRcdFx0YWpheC5nZXQoJy9uYXY/cGF0aD0nICsgZGlyLnBhdGgsIGRhdGEgPT4ge1xuXG5cdFx0XHRcdGRpci5jaGlsZHJlbiA9IGRhdGEuZGlyO1xuXG5cdFx0XHRcdGRlbGV0ZSB2bS5sb2FkaW5nO1xuXG5cdFx0XHRcdHZtLnJlbmRlcigpO1xuXG5cdFx0XHR9KTtcblxuXHRcdH1cblxuXHR9O1xuXG5cdHZtLmNsaWNrRmlsZSA9IGZpbGUgPT4ge1xuXG5cdFx0ZmlsZU1hbmFnZXIub3BlbihmaWxlKTtcblxuXHR9O1xuXG5cdHZtLnJpZ2h0Q2xpY2tEaXIgPSAoZGlyLCBlKSA9PiB7XG5cdFxuXHRcdG1hbmlsYS5jb21wb25lbnRzLmNvbnRleHRNZW51LnJpZ2h0Q2xpY2tEaXIoZGlyLCBlKTtcblxuXHR9O1xuXG5cdHZtLnJpZ2h0Q2xpY2tGaWxlID0gKGZpbGUsIGUpID0+IHtcblx0XG5cdFx0bWFuaWxhLmNvbXBvbmVudHMuY29udGV4dE1lbnUucmlnaHRDbGlja0ZpbGUoZmlsZSwgZSk7XG5cblx0fTtcblxuXHRyZXR1cm4ge1xuXG5cdFx0dXBkYXRlOiAocGF0aCwgb3BlbikgPT4ge1xuXG5cdFx0XHRpZiAob3Blbikge1xuXG5cdFx0XHRcdHZtLm9wZW5bcGF0aF0gPSBwYXRoO1xuXG5cdFx0XHRcdHZtLmFjdGl2ZSA9IHBhdGg7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0ZGVsZXRlIHZtLm9wZW5bcGF0aF07XG5cblx0XHRcdH1cblxuXHRcdH0sXG5cblx0XHRnZXRBY3RpdmVGaWxlOiAoKSA9PiB7XG5cblx0XHRcdHJldHVybiB2bS5hY3RpdmU7XG5cblx0XHR9LFxuXG5cdFx0cmVuZGVyOiAoKSA9PiB7XG5cblx0XHRcdHZtLnJlbmRlcigpO1xuXG5cdFx0fVxuXG5cdH07XG5cbn0pO1xuIiwiaW1wb3J0IGZpbGVNYW5hZ2VyIGZyb20gJy4uL3NyYy9maWxlTWFuYWdlcic7XG5pbXBvcnQgbWFuaWxhIGZyb20gJ21ubGEvY2xpZW50JztcbmltcG9ydCB7IHNhdmUgfSBmcm9tICcuLi9zcmMvc2F2ZSc7XG5cbm1hbmlsYS5jb21wb25lbnQoJ3RhYnMnLCB2bSA9PiB7XG5cblx0dm0udGFicyA9IHt9O1xuXG5cdHZtLmNsb3NlID0gcGF0aCA9PiB7XG5cblx0XHRkZWxldGUgdm0udGFic1twYXRoXTtcblxuXHRcdGZpbGVNYW5hZ2VyLmNsb3NlKHtcblx0XHRcdHBhdGg6IHBhdGgsXG5cdFx0XHRuYW1lOiB2bS50YWJzW3BhdGhdXG5cdFx0fSk7XG5cblx0fTtcblxuXHR2bS5vcGVuID0gcGF0aCA9PiB7XG5cblx0XHRmaWxlTWFuYWdlci5vcGVuKHtcblx0XHRcdHBhdGg6IHBhdGgsXG5cdFx0XHRuYW1lOiB2bS50YWJzW3BhdGhdXG5cdFx0fSk7XG5cblx0fTtcblxuXHR2bS5zYXZlID0gc2F2ZTtcblxuXHRyZXR1cm4ge1xuXG5cdFx0dXBkYXRlOiAoZmlsZSwgb3BlbikgPT4ge1xuXG5cdFx0XHRpZiAob3Blbikge1xuXG5cdFx0XHRcdHZtLmFjdGl2ZSA9IGZpbGUucGF0aDtcblxuXHRcdFx0XHR2bS50YWJzW2ZpbGUucGF0aF0gPSBmaWxlLm5hbWU7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0ZGVsZXRlIHZtLnRhYnNbZmlsZS5wYXRoXTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdH07XG5cbn0pO1xuIiwiaW1wb3J0IHsgc2F2ZSB9IGZyb20gJy4vc2F2ZSc7XG5cbmNvbnN0IGtleW1hcCA9IHtcblxuXHRcdDkxOiB7XG5cdFx0XHRjYWxsYmFjazogc2F2ZSxcblx0XHRcdHBhaXI6IDgzIFxuXHRcdH0sXG5cblx0XHQ4Mzoge1xuXHRcdFx0Y2FsbGJhY2s6IHNhdmUsXG5cdFx0XHRwYWlyOiA5MVxuXHRcdH1cblxuXHR9O1xuXG5sZXQgcHJlc3NlZCA9IHsgfTtcblxuXG5mdW5jdGlvbiBrZXlkb3duKGUpIHtcblxuXHRsZXQgY29kZSA9IGUua2V5Q29kZSB8fCBlLndoaWNoLFxuXG5cdFx0a2V5ID0ga2V5bWFwW2NvZGVdO1xuXG5cdGlmIChrZXkpIHtcblxuXHRcdHByZXNzZWRbY29kZV0gPSB0cnVlO1xuXG5cdFx0aWYgKHByZXNzZWRba2V5LnBhaXJdKSB7XG5cblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0a2V5LmNhbGxiYWNrKCk7XG5cblx0XHRcdGRlbGV0ZSBwcmVzc2VkW2NvZGVdO1xuXHRcdFx0ZGVsZXRlIHByZXNzZWRba2V5LnBhaXJdO1xuXG5cdFx0fVxuXG5cdH1cblxufVxuXG5cbmZ1bmN0aW9uIGtleXVwKGUpIHtcblxuXHRkZWxldGUgcHJlc3NlZFtlLmtleUNvZGUgfHwgZS53aGljaF07XG5cbn1cblxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywga2V5ZG93bik7XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGtleXVwKTtcbiIsImZ1bmN0aW9uIHNlcmlhbGl6ZShkYXRhKSB7XG4gXG4gXHRsZXQgcGFydHMgPSBbXTtcbiBcbiBcdGZvciAobGV0IGtleSBpbiBkYXRhKSB7XG4gXG4gXHRcdHBhcnRzLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudChkYXRhW2tleV0pKTtcblxuIFx0fVxuIFxuIFx0cmV0dXJuIHBhcnRzLmpvaW4oJyYnKTtcbn1cbiBcbmZ1bmN0aW9uIGdldChwYXRoLCBkYXRhLCBjYWxsYmFjaykge1xuXG5cdGlmICh0eXBlb2YgZGF0YSA9PT0gJ2Z1bmN0aW9uJykge1xuXG5cdFx0Y2FsbGJhY2sgPSBkYXRhO1xuXG5cdH1cbiBcbiBcdGxldCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiBcbiBcdGlmICh0eXBlb2YgZGF0YSA9PT0gJ2Z1bmN0aW9uJykge1xuIFxuIFx0XHRjYWxsYmFjayA9IGRhdGE7XG4gXG4gXHRcdGRhdGEgPSB7fTtcblxuIFx0fVxuIFxuIFx0cmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiBcbiBcdFx0aWYgKHJlcS5yZWFkeVN0YXRlID09IDQgJiYgcmVxLnN0YXR1cyA9PSAyMDApIHtcbiBcbiBcdFx0XHRsZXQgcmVzdWx0ID0gdm9pZCAwO1xuIFxuIFx0XHRcdHRyeSB7XG4gXG4gXHRcdFx0XHRyZXN1bHQgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuXG4gXHRcdFx0fSBjYXRjaCAoZXJyKSB7XG4gXG4gXHRcdFx0XHRyZXN1bHQgPSByZXEucmVzcG9uc2VUZXh0O1xuXG4gXHRcdFx0fVxuIFxuIFx0XHRcdGNhbGxiYWNrKHJlc3VsdCk7XG4gXHRcdH1cblxuIFx0fTtcbiBcbiBcdHJlcS5vcGVuKCdHRVQnLCBwYXRoKTtcbiBcbiBcdHJlcS5zZW5kKHNlcmlhbGl6ZShkYXRhKSk7XG5cbn1cbiBcbmZ1bmN0aW9uIHBvc3QocGF0aCwgZGF0YSwgY2FsbGJhY2spIHtcblxuXHRpZiAodHlwZW9mIGRhdGEgPT09ICdmdW5jdGlvbicpIHtcblxuXHRcdGNhbGxiYWNrID0gZGF0YTtcblxuXHR9XG4gXG4gXHRsZXQgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gXG4gXHRyZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuIFxuIFx0XHRpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCAmJiByZXEuc3RhdHVzID09IDIwMCkge1xuIFxuIFx0XHRcdGxldCBqc29uID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiBcbiBcdFx0XHRpZiAoanNvbikge1xuIFxuIFx0XHRcdFx0Y2FsbGJhY2soanNvbik7XG5cbiBcdFx0XHR9IGVsc2Uge1xuIFxuIFx0XHRcdFx0Y2FsbGJhY2socmVxLnJlc3BvbnNlVGV4dCk7XG5cbiBcdFx0XHR9XG5cbiBcdFx0fVxuXG4gXHR9O1xuIFxuIFx0cmVxLm9wZW4oJ1BPU1QnLCBwYXRoKTtcbiBcbiBcdHJlcS5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XG4gXG4gXHRyZXEuc2VuZChzZXJpYWxpemUoZGF0YSkpO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gXHRnZXQ6IGdldCxcbiBcdHBvc3Q6IHBvc3RcbiBcbn07XG4iLCJpbXBvcnQgbWFuaWxhIGZyb20gJ21ubGEvY2xpZW50JztcblxubGV0IG9wZW5GaWxlcyA9IHt9O1xuXG5mdW5jdGlvbiBvcGVuKGZpbGUpIHtcblxuXHRtYW5pbGEuY29tcG9uZW50cy5lZGl0b3IudXBkYXRlKGZpbGUucGF0aCk7XG5cblx0bWFuaWxhLmNvbXBvbmVudHMubmF2LnVwZGF0ZShmaWxlLnBhdGgsIHRydWUpO1xuXG5cdG1hbmlsYS5jb21wb25lbnRzLnRhYnMudXBkYXRlKGZpbGUsIHRydWUpO1xuXG5cdG9wZW5GaWxlc1tmaWxlLnBhdGhdID0gZmlsZTtcblxufVxuXG5mdW5jdGlvbiBjbG9zZShmaWxlKSB7XG5cblx0bGV0IG9wZW5MaXN0O1xuXG5cdG1hbmlsYS5jb21wb25lbnRzLmVkaXRvci51cGRhdGUoJycpO1xuXG5cdG1hbmlsYS5jb21wb25lbnRzLm5hdi51cGRhdGUoZmlsZS5wYXRoLCBmYWxzZSk7XG5cdFxuXHRtYW5pbGEuY29tcG9uZW50cy50YWJzLnVwZGF0ZShmaWxlLCBmYWxzZSk7XG5cblx0ZGVsZXRlIG9wZW5GaWxlc1tmaWxlLnBhdGhdO1xuXG5cdG9wZW5MaXN0ID0gT2JqZWN0LmtleXMob3BlbkZpbGVzKTtcblxuXHRpZiAob3Blbkxpc3QubGVuZ3RoKSB7XG5cblx0XHRvcGVuKG9wZW5GaWxlc1tvcGVuTGlzdFtvcGVuTGlzdC5sZW5ndGggLSAxXV0pO1xuXG5cdH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG5cblx0b3Blbjogb3Blbixcblx0Y2xvc2U6IGNsb3NlXG5cbn07IiwiaW1wb3J0IG1hbmlsYSBmcm9tICdtbmxhL2NsaWVudCc7XG5pbXBvcnQgYWpheCBmcm9tICcuLi9zcmMvYWpheCc7XG5cbmxldCBiZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5iYWNrZ3JvdW5kJylcblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmUoKSB7XG5cblx0bGV0IGZpbGUgPSBtYW5pbGEuY29tcG9uZW50cy5uYXYuZ2V0QWN0aXZlRmlsZSgpO1xuXG5cdGlmIChmaWxlKSB7XG5cblx0XHRiZy5jbGFzc0xpc3QuYWRkKCdibHVyJyk7XG5cblx0XHRhamF4LnBvc3QoXG5cblx0XHRcdCcvc2F2ZT9maWxlPScgKyBmaWxlLFxuXG5cdFx0XHR7XG5cdFx0XHRcdGRhdGE6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZXh0JykudmFsdWVcblx0XHRcdH0sXG5cblx0XHRcdHJlc3VsdCA9PiB7XG5cblx0XHRcdFx0aWYgKHJlc3VsdC5lcnJvcikge1xuXG5cdFx0XHRcdFx0YWxlcnQocmVzdWx0LmVycm9yKTtcblx0XHRcdFx0XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihyZXN1bHQuZXJyb3IpO1xuXHRcdFx0XHRcblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdGJnLmNsYXNzTGlzdC5yZW1vdmUoJ2JsdXInKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHRcdFxuXHRcdCk7XG5cblx0fVxuXG59OyIsImNvbnN0IGNvbXBpbGUgPSByZXF1aXJlKCcuL2NvbXBpbGUnKTtcblxud2luZG93Lm1hbmlsYSA9IHdpbmRvdy5tYW5pbGEgfHwge307XG5cbndpbmRvdy5tYW5pbGEuaGFuZGxlcnMgPSB7fTtcblxubGV0IGNvbXBvbmVudHMgPSB7fSxcblx0XG5cdHNlbGVjdGlvbjtcblxuZnVuY3Rpb24gY29tcG9uZW50KGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudCkge1xuXG5cdGxldCB2bSA9IHdpbmRvdy5tYW5pbGEuZGF0YVtjb21wb25lbnROYW1lXSB8fCB7fSxcblxuXHRcdGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtY29tcG9uZW50PVwiJHtjb21wb25lbnROYW1lfVwiXWApO1xuXG5cdGNvbXBpbGUoYCMke2NvbXBvbmVudE5hbWV9LXRlbXBsYXRlYCkudGhlbihyZW5kZXIgPT4ge1xuXG5cdFx0ZnVuY3Rpb24gcmVzb2x2ZShkYXRhKSB7XG5cblx0XHRcdGxldCBpbmRleCA9IDA7XG5cblx0XHRcdHdpbmRvdy5tYW5pbGEuaGFuZGxlcnNbY29tcG9uZW50TmFtZV0gPSBbXTtcblxuXHRcdFx0ZGF0YS5vbiA9IChldmVudCwgaGFuZGxlciwgLi4uYXJncykgPT4ge1xuXG5cdFx0XHRcdGxldCBldmVudFN0cmluZztcblxuXHRcdFx0XHR3aW5kb3cubWFuaWxhLmhhbmRsZXJzW2NvbXBvbmVudE5hbWVdW2luZGV4XSA9IGUgPT4ge1xuXG5cdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRhcmdzLnB1c2goZSk7XG5cblx0XHRcdFx0XHRoYW5kbGVyLmFwcGx5KGRhdGEsIGFyZ3MpO1xuXG5cdFx0XHRcdFx0aWYgKGUudGFyZ2V0LnRhZ05hbWUgIT09ICdJTlBVVCcgJiYgXG5cdFx0XHRcdFx0XHQgZS50YXJnZXQudGFnTmFtZSAhPT0gJ1RFWFRBUkVBJykge1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGEpO1xuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0ZXZlbnRTdHJpbmcgPSBgb24ke2V2ZW50fT1tYW5pbGEuaGFuZGxlcnMuJHtjb21wb25lbnROYW1lfVske2luZGV4fV0oZXZlbnQpYDtcblxuXHRcdFx0XHRpbmRleCsrO1xuXG5cdFx0XHRcdHJldHVybiBldmVudFN0cmluZztcblxuXHRcdFx0fTtcblxuXHRcdFx0ZWwuaW5uZXJIVE1MID0gcmVuZGVyKGRhdGEpO1xuXG5cdFx0fVxuXG5cdFx0dm0ucmVuZGVyID0gKCkgPT4ge1xuXG5cdFx0XHRyZXNvbHZlKHZtKTtcblx0XHRcdFxuXHRcdH07XG5cblx0XHRsZXQgbWV0aG9kcyA9IGNvbXBvbmVudCh2bSk7XG5cblx0XHRpZiAobWV0aG9kcykge1xuXG5cdFx0XHRjb21wb25lbnRzW2NvbXBvbmVudE5hbWVdID0ge307XG5cblx0XHRcdE9iamVjdC5rZXlzKG1ldGhvZHMpLmZvckVhY2goa2V5ID0+IHtcblxuXHRcdFx0XHRjb21wb25lbnRzW2NvbXBvbmVudE5hbWVdW2tleV0gPSAoLi4uYXJncykgPT4ge1xuXG5cdFx0XHRcdFx0bGV0IHJlc3VsdCA9IG1ldGhvZHNba2V5XS5hcHBseSh2bSwgYXJncyk7XG5cblx0XHRcdFx0XHRyZXNvbHZlKHZtKTtcblxuXHRcdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cblx0XHRcdFx0fTtcblxuXHRcdFx0fSk7XG5cblx0XHR9XG5cblx0XHRyZXNvbHZlKHZtKTtcblxuXHR9KTtcblxuXHRyZXR1cm4gd2luZG93Lm1hbmlsYTtcblxufVxuXG53aW5kb3cubWFuaWxhLmNvbXBvbmVudCA9IGNvbXBvbmVudDtcbndpbmRvdy5tYW5pbGEuY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRjb21wb25lbnQ6IGNvbXBvbmVudCxcblx0Y29tcG9uZW50czogY29tcG9uZW50c1xufTtcbiIsImNvbnN0IG1hbmlsYSA9IHJlcXVpcmUoJ21hbmlsYS9wYXJzZScpO1xuXG5sZXQgY2FjaGUgPSB7fSxcblxuXHRlc2NhcGVNYXAgPSB7XG4gICAgICAgICc8JzogJyZsdDsnLFxuICAgICAgICAnPic6ICcmZ3Q7JyxcbiAgICAgICAgJ1wiJzogJyZxdW90OycsXG4gICAgICAgICdcXCcnOiAnJmFwb3M7J1xuICAgIH07XG5cbmZ1bmN0aW9uIGh0bWxFc2NhcGUoc3RyKSB7XG5cbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1smPD4nXCJdL2csIGMgPT4ge1xuXG4gICAgICAgIHJldHVybiBlc2NhcGVNYXBbY107XG5cbiAgICB9KTtcblxufVxuXG53aW5kb3cubWFuaWxhID0gd2luZG93Lm1hbmlsYSB8fCB7fTtcblxud2luZG93Lm1hbmlsYS5lID0gZnVuY3Rpb24odmFsKSB7XG5cbiAgICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgPyBodG1sRXNjYXBlKHZhbCkgOiB2YWw7XG4gICAgXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbXBpbGUoc2VsZWN0b3IpIHtcblxuXHRyZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG5cblx0XHRpZiAoIXNlbGVjdG9yKSB7XG5cblx0XHRcdHJlc29sdmUoICgpPT57fSApO1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0aWYgKGNhY2hlW3NlbGVjdG9yXSkge1xuXG5cdFx0XHRcdHJlc29sdmUoY2FjaGVbc2VsZWN0b3JdKTtcblxuXHRcdFx0fVxuXG5cdFx0XHRjYWNoZVtzZWxlY3Rvcl0gPSBtYW5pbGEoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikuaW5uZXJIVE1MKTtcblxuXHRcdFx0cmVzb2x2ZShjYWNoZVtzZWxlY3Rvcl0pO1xuXG5cdFx0fVxuXG5cdH0pO1xuXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRlbXBsYXRlKSB7XG5cbiAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKCdjb250ZXh0JyxcblxuICAgICAgICBcInZhciBwPVtdO3dpdGgoY29udGV4dCl7cC5wdXNoKGBcIiArXG4gICAgICAgXG4gICAgICAgIHRlbXBsYXRlXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxcXCcvZywgXCJcXFxcXFxcXCdcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC9gL2csIFwiXFxcXGBcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC88OjooPyFcXHMqfS4qPzo6PikoPyEuKntcXHMqOjo+KSguKj8pOjo+L2csIFwiYCk7dHJ5e3AucHVzaCgkMSl9Y2F0Y2goZSl7fXAucHVzaChgXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvPDo6XFxzKiguKj8pXFxzKjo6Pi9nLCBcImApOyQxXFxucC5wdXNoKGBcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC88Oig/IVxccyp9Lio/Oj4pKD8hLip7XFxzKjo+KSguKj8pOj4vZywgXCJgKTt0cnl7cC5wdXNoKG1hbmlsYS5lKCQxKSl9Y2F0Y2goZSl7fXAucHVzaChgXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvPDpcXHMqKC4qPylcXHMqOj4vZywgXCJgKTskMVxcbnAucHVzaChgXCIpXG5cbiAgICAgICsgXCJgKTt9cmV0dXJuIHAuam9pbignJyk7XCIpO1xufTsiXX0=
