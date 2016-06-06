(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _addKeyboardShortcuts = require('./src/addKeyboardShortcuts');

var _addKeyboardShortcuts2 = _interopRequireDefault(_addKeyboardShortcuts);

var _resize = require('./src/resize');

var _resize2 = _interopRequireDefault(_resize);

var _nav = require('./components/nav');

var _nav2 = _interopRequireDefault(_nav);

var _editor = require('./components/editor');

var _editor2 = _interopRequireDefault(_editor);

var _tabs = require('./components/tabs');

var _tabs2 = _interopRequireDefault(_tabs);

var _contextMenu = require('./components/contextMenu');

var _contextMenu2 = _interopRequireDefault(_contextMenu);

var _search = require('./components/search');

var _search2 = _interopRequireDefault(_search);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./components/contextMenu":2,"./components/editor":3,"./components/nav":4,"./components/search":5,"./components/tabs":6,"./src/addKeyboardShortcuts":7,"./src/resize":11}],2:[function(require,module,exports){
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

},{"../src/ajax":8,"../src/fileManager":10,"mnla/client":13}],3:[function(require,module,exports){
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
	}

	numbers.style.height = height + 'px';

	el.style.height = height + 'px';
}

_client2.default.component('editor', function (vm) {

	vm.resetHeight = resetHeight;

	vm.loading = false;

	function showText(text) {

		vm.text = text;

		vm.loading = false;

		vm.render();
	}

	setTimeout(resetHeight);

	return {

		update: function update(path) {

			showText('');

			if (path) {

				vm.loading = true;

				vm.disabled = false;

				_ajax2.default.get('/open?file=' + path, function (data) {

					showText(data.data);

					vm.resetHeight();
				});
			} else {

				vm.disabled = true;

				showText('');

				vm.resetHeight();
			}
		}

	};
});

},{"../src/ajax":8,"mnla/client":13}],4:[function(require,module,exports){
'use strict';

var _fileManager = require('../src/fileManager');

var _fileManager2 = _interopRequireDefault(_fileManager);

var _ajax = require('../src/ajax');

var _ajax2 = _interopRequireDefault(_ajax);

var _client = require('mnla/client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_client2.default.component('nav', function (vm) {

	var cache = vm.dir;

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

				delete vm.active;
			}
		},

		getActiveFile: function getActiveFile() {

			return vm.active;
		},

		render: function render() {

			vm.render();
		},

		showSearchResults: function showSearchResults(results) {

			vm.dir = results;
		},

		hideSearchResults: function hideSearchResults() {

			vm.dir = cache;
		}

	};
});

},{"../src/ajax":8,"../src/fileManager":10,"mnla/client":13}],5:[function(require,module,exports){
'use strict';

var _ajax = require('../src/ajax');

var _ajax2 = _interopRequireDefault(_ajax);

var _client = require('mnla/client');

var _client2 = _interopRequireDefault(_client);

var _debounce = require('../src/debounce');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_client2.default.component('search', function (vm) {

	function search(e) {

		document.querySelector('.search-loader').classList.add('visible');

		_ajax2.default.get('/search?term=' + e.target.value, function (results) {

			_client2.default.components.nav.showSearchResults(results);

			document.querySelector('.search-loader').classList.remove('visible');
		});
	}

	vm.search = (0, _debounce.debounce)(search, 250);

	vm.close = function (e) {

		e.target.value = '';

		_client2.default.components.nav.hideSearchResults();
	};
});

},{"../src/ajax":8,"../src/debounce":9,"mnla/client":13}],6:[function(require,module,exports){
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

},{"../src/fileManager":10,"../src/save":12,"mnla/client":13}],7:[function(require,module,exports){
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

},{"./save":12}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.debounce = debounce;
function debounce(func, wait) {

    var timeout = void 0,
        args = void 0,
        timestamp = void 0;

    return function () {

        args = [].slice.call(arguments, 0);

        timestamp = new Date();

        var later = function later() {

            var last = new Date() - timestamp;

            if (last < wait) {
                timeout = setTimeout(later, wait - last);
            } else {

                timeout = null;

                func.apply(undefined, args);
            }
        };

        if (!timeout) {
            timeout = setTimeout(later, wait);
        }
    };
};

},{}],10:[function(require,module,exports){
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

},{"mnla/client":13}],11:[function(require,module,exports){
'use strict';

var dragging = void 0;

document.querySelector('.resize').addEventListener('mousedown', function (e) {

	dragging = true;

	document.querySelector('body').classList.add('dragging');
});

window.addEventListener('mouseup', function (e) {

	dragging = false;

	document.querySelector('body').classList.remove('dragging');
});

window.addEventListener('mousemove', function (e) {

	if (dragging) {

		var width = 'calc(100% - ' + e.clientX + 'px)';

		document.querySelector('.background').style.left = e.clientX + 'px';
		document.querySelector('.search-component').style.width = e.clientX - 5 + 'px';
		document.querySelector('.background').style.width = width;
		document.querySelector('.tabs-component').style.width = width;
	}
});

},{}],12:[function(require,module,exports){
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

},{"../src/ajax":8,"mnla/client":13}],13:[function(require,module,exports){
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

},{"./compile":14}],14:[function(require,module,exports){
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

},{"manila/parse":15}],15:[function(require,module,exports){
'use strict';

module.exports = function (template) {

    return new Function('context', "var p=[];with(context){p.push(`" + template.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/<::(?!\s*}.*?::>)(?!.*{\s*::>)(.*?)::>/g, "`);try{p.push($1)}catch(e){}p.push(`").replace(/<::?(?!\s*}.*?::?>)(?!.*{\s*::?>)(.*?)::?>/g, "`);try{p.push(manila.e($1))}catch(e){}p.push(`").replace(/<::?(.*?)::?>/g, "`);$1\np.push(`") + "`);}return p.join('');");
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvYXBwLmpzIiwiYXNzZXRzL2pzL2NvbXBvbmVudHMvY29udGV4dE1lbnUuanMiLCJhc3NldHMvanMvY29tcG9uZW50cy9lZGl0b3IuanMiLCJhc3NldHMvanMvY29tcG9uZW50cy9uYXYuanMiLCJhc3NldHMvanMvY29tcG9uZW50cy9zZWFyY2guanMiLCJhc3NldHMvanMvY29tcG9uZW50cy90YWJzLmpzIiwiYXNzZXRzL2pzL3NyYy9hZGRLZXlib2FyZFNob3J0Y3V0cy5qcyIsImFzc2V0cy9qcy9zcmMvYWpheC5qcyIsImFzc2V0cy9qcy9zcmMvZGVib3VuY2UuanMiLCJhc3NldHMvanMvc3JjL2ZpbGVNYW5hZ2VyLmpzIiwiYXNzZXRzL2pzL3NyYy9yZXNpemUuanMiLCJhc3NldHMvanMvc3JjL3NhdmUuanMiLCIuLi9tbmxhL2NsaWVudC5qcyIsIi4uL21ubGEvY29tcGlsZS5qcyIsIi4uL21ubGEvbm9kZV9tb2R1bGVzL21hbmlsYS9wYXJzZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7OztBQ05BOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBSSxnQkFBSjs7QUFFQSxpQkFBTyxTQUFQLENBQWlCLGFBQWpCLEVBQWdDLGNBQU07O0FBRXJDLElBQUcsSUFBSCxHQUFVLElBQVYsQ0FGcUM7O0FBSXJDLFVBQVMsSUFBVCxDQUFjLElBQWQsRUFBb0IsQ0FBcEIsRUFBdUI7O0FBRXRCLElBQUUsY0FBRixHQUZzQjs7QUFJdEIsWUFBVSxJQUFWLENBSnNCOztBQU10QixLQUFHLElBQUgsR0FBVSxFQUFFLE9BQUYsQ0FOWTs7QUFRdEIsS0FBRyxHQUFILEdBQVMsRUFBRSxPQUFGLENBUmE7O0FB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b0NBRUEsU0FDSyxPQURMLENBQ2EsS0FEYixFQUNvQixNQURwQixFQUVLLE9BRkwsQ0FFYSxJQUZiLEVBRW1CLEtBRm5CLEVBR0ssT0FITCxDQUdhLHlDQUhiLEVBR3dELHNDQUh4RCxFQUlLLE9BSkwsQ0FJYSw2Q0FKYixFQUk0RCxnREFKNUQsRUFLSyxPQUxMLENBS2EsZ0JBTGIsRUFLK0IsaUJBTC9CLENBRkEsR0FTQSx3QkFUQSxDQUZKLENBRmdDO0NBQW5CIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBhZGRLZXlib2FyZFNob3J0Y3V0cyBmcm9tICcuL3NyYy9hZGRLZXlib2FyZFNob3J0Y3V0cyc7XG5pbXBvcnQgcmVzaXplIGZyb20gJy4vc3JjL3Jlc2l6ZSc7XG5pbXBvcnQgbmF2IGZyb20gJy4vY29tcG9uZW50cy9uYXYnO1xuaW1wb3J0IGVkaXRvciBmcm9tICcuL2NvbXBvbmVudHMvZWRpdG9yJztcbmltcG9ydCB0YWJzIGZyb20gJy4vY29tcG9uZW50cy90YWJzJztcbmltcG9ydCBjb250ZXh0TWVudSBmcm9tICcuL2NvbXBvbmVudHMvY29udGV4dE1lbnUnO1xuaW1wb3J0IHNlYXJjaCBmcm9tICcuL2NvbXBvbmVudHMvc2VhcmNoJztcbiIsImltcG9ydCBtYW5pbGEgZnJvbSAnbW5sYS9jbGllbnQnO1xuaW1wb3J0IGFqYXggZnJvbSAnLi4vc3JjL2FqYXgnO1xuaW1wb3J0IGZpbGVNYW5hZ2VyIGZyb20gJy4uL3NyYy9maWxlTWFuYWdlcic7XG5cbmxldCBjdXJyZW50O1xuXG5tYW5pbGEuY29tcG9uZW50KCdjb250ZXh0TWVudScsIHZtID0+IHtcblxuXHR2bS5maWxlID0gdHJ1ZTtcblxuXHRmdW5jdGlvbiBvcGVuKGl0ZW0sIGUpIHtcblxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGN1cnJlbnQgPSBpdGVtO1xuXG5cdFx0dm0ubGVmdCA9IGUuY2xpZW50WDtcblxuXHRcdHZtLnRvcCA9IGUuY2xpZW50WTtcblxuXHRcdHZtLnZpc2libGUgPSB0cnVlO1xuXG5cdH1cblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblxuXHRcdGlmICh2bS52aXNpYmxlKSB7XG5cblx0XHRcdHZtLnZpc2libGUgPSBmYWxzZTtcblxuXHRcdFx0dm0ucmVuZGVyKCk7XG5cblx0XHR9XG5cblx0fSk7XG5cblx0dm0ucmVuYW1lID0gKCkgPT4ge1xuXG5cdFx0dm0udmlzaWJsZSA9IGZhbHNlO1xuXG5cdFx0dm0ucmVuZGVyKCk7XG5cblx0XHRsZXQgbmFtZSA9IHByb21wdCgnTmV3IG5hbWU6Jyk7XG5cblx0XHRpZiAobmFtZSkge1xuXG5cdFx0XHRhamF4LnBvc3QoXG5cblx0XHRcdFx0Jy9yZW5hbWU/cGF0aD0nICsgY3VycmVudC5wYXRoLFxuXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRuYW1lOiBuYW1lXG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0cmVzdWx0ID0+IHtcblxuXHRcdFx0XHRcdGlmIChyZXN1bHQuZXJyb3IpIHtcblxuXHRcdFx0XHRcdFx0YWxlcnQocmVzdWx0LmVycm9yKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IocmVzdWx0LmVycm9yKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0XHR2bS5yZW5kZXIoKTtcblxuXHRcdFx0XHRcdFx0ZmlsZU1hbmFnZXIuY2xvc2UoY3VycmVudCk7XG5cblx0XHRcdFx0XHRcdGN1cnJlbnQubmFtZSA9IG5hbWU7XG5cblx0XHRcdFx0XHRcdGN1cnJlbnQucGF0aCA9IHJlc3VsdC5kYXRhO1xuXG5cdFx0XHRcdFx0XHRmaWxlTWFuYWdlci5vcGVuKGN1cnJlbnQpO1xuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHQpO1xuXG5cdFx0fVxuXG5cdH07XG5cblx0dm0uZGVsZXRlUGF0aCA9ICgpID0+IHtcblxuXHRcdHZtLnZpc2libGUgPSBmYWxzZTtcblxuXHRcdGFqYXgucG9zdChcblxuXHRcdFx0Jy9kZWxldGU/cGF0aD0nICsgY3VycmVudC5wYXRoLFxuXG5cdFx0XHRyZXN1bHQgPT4ge1xuXG5cdFx0XHRcdGlmIChyZXN1bHQuZXJyb3IpIHtcblxuXHRcdFx0XHRcdGFsZXJ0KHJlc3VsdC5lcnJvcik7XG5cdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IocmVzdWx0LmVycm9yKTtcblx0XHRcdFx0XG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRpZiAodm0uZmlsZSkge1xuXG5cdFx0XHRcdFx0XHRmaWxlTWFuYWdlci5jbG9zZShjdXJyZW50KTtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGN1cnJlbnQuZGVsZXRlZCA9IHRydWU7XG5cblx0XHRcdFx0XHRtYW5pbGEuY29tcG9uZW50cy5uYXYucmVuZGVyKCk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0XHRcblx0XHQpO1xuXG5cdH07XG5cblx0dm0ubmV3RmlsZSA9ICgpID0+IHtcblxuXHRcdHZtLnZpc2libGUgPSBmYWxzZTtcblxuXHRcdHZtLnJlbmRlcigpO1xuXG5cdFx0bGV0IG5hbWUgPSBwcm9tcHQoJ0ZpbGUgbmFtZTonKTtcblxuXHRcdGFqYXgucG9zdChcblxuXHRcdFx0Jy9uZXctZmlsZT9wYXRoPScgKyBjdXJyZW50LnBhdGgsXG5cblx0XHRcdHtcblx0XHRcdFx0bmFtZTogbmFtZVxuXHRcdFx0fSxcblxuXHRcdFx0cmVzdWx0ID0+IHtcblxuXHRcdFx0XHRpZiAocmVzdWx0LmVycm9yKSB7XG5cblx0XHRcdFx0XHRhbGVydChyZXN1bHQuZXJyb3IpO1xuXHRcdFx0XHRcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKHJlc3VsdC5lcnJvcik7XG5cdFx0XHRcdFxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0bGV0IG5ld0ZpbGUgPSB7XG5cdFx0XHRcdFx0XHRuYW1lOiBuYW1lLFxuXHRcdFx0XHRcdFx0cGF0aDogcmVzdWx0LmRhdGFcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0Y3VycmVudC5jaGlsZHJlbiA9IGN1cnJlbnQuY2hpbGRyZW4gfHwgeyBmaWxlczpbXSB9O1xuXG5cdFx0XHRcdFx0Y3VycmVudC5jaGlsZHJlbi5maWxlcy5wdXNoKG5ld0ZpbGUpO1xuXG5cdFx0XHRcdFx0ZmlsZU1hbmFnZXIub3BlbihuZXdGaWxlKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHRcdFxuXHRcdCk7XG5cblx0fTtcblxuXHR2bS5uZXdEaXIgPSAoKSA9PiB7XG5cblx0XHR2bS52aXNpYmxlID0gZmFsc2U7XG5cblx0XHR2bS5yZW5kZXIoKTtcblxuXHRcdGxldCBuYW1lID0gcHJvbXB0KCdGb2xkZXIgbmFtZTonKTtcblxuXHRcdGFqYXgucG9zdChcblxuXHRcdFx0Jy9uZXctZGlyP3BhdGg9JyArIGN1cnJlbnQucGF0aCxcblxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiBuYW1lXG5cdFx0XHR9LFxuXG5cdFx0XHRyZXN1bHQgPT4ge1xuXG5cdFx0XHRcdGlmIChyZXN1bHQuZXJyb3IpIHtcblxuXHRcdFx0XHRcdGFsZXJ0KHJlc3VsdC5lcnJvcik7XG5cdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IocmVzdWx0LmVycm9yKTtcblx0XHRcdFx0XG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRjdXJyZW50LmNoaWxkcmVuID0gY3VycmVudC5jaGlsZHJlbiB8fCB7IGRpcnM6W10gfTtcblxuXHRcdFx0XHRcdGN1cnJlbnQuY2hpbGRyZW4uZGlycy5wdXNoKHtcblx0XHRcdFx0XHRcdG5hbWU6IG5hbWUsXG5cdFx0XHRcdFx0XHRwYXRoOiByZXN1bHQuZGF0YVxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0bWFuaWxhLmNvbXBvbmVudHMubmF2LnJlbmRlcigpO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0KTtcblxuXHR9O1xuXG5cdHJldHVybiB7XG5cblx0XHRyaWdodENsaWNrRGlyOiAoZGlyLCBlKSA9PiB7XG5cblx0XHRcdHZtLmZpbGUgPSBmYWxzZTtcblxuXHRcdFx0dm0ucGFyZW50ID0gZGlyLnBhcmVudDtcblxuXHRcdFx0b3BlbihkaXIsIGUpO1xuXG5cdFx0fSxcblxuXHRcdHJpZ2h0Q2xpY2tGaWxlOiAoZmlsZSwgZSkgPT4ge1xuXG5cdFx0XHR2bS5maWxlID0gdHJ1ZTtcblxuXHRcdFx0dm0ucGFyZW50ID0gZmFsc2U7XG5cblx0XHRcdG9wZW4oZmlsZSwgZSlcblxuXHRcdH1cblxuXHR9XG5cbn0pO1xuIiwiaW1wb3J0IGFqYXggZnJvbSAnLi4vc3JjL2FqYXgnO1xuaW1wb3J0IG1hbmlsYSBmcm9tICdtbmxhL2NsaWVudCc7XG5cbmZ1bmN0aW9uIHJlc2V0SGVpZ2h0KGUpIHtcblxuXHRsZXQgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGV4dCcpLFxuXHRcblx0XHRudW1iZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm51bWJlcnMnKSxcblxuXHRcdGhlaWdodDtcblxuXHRlbC5zdHlsZS5oZWlnaHQgPSAnJztcblxuXHRoZWlnaHQgPSBlbC5zY3JvbGxIZWlnaHQ7XG5cblx0bnVtYmVycy5zdHlsZS5oZWlnaHQgPSAnJztcblxuXHRpZiAobnVtYmVycy5jbGllbnRIZWlnaHQgPCBoZWlnaHQpIHtcblxuXHRcdHdoaWxlIChudW1iZXJzLmNsaWVudEhlaWdodCA8IGhlaWdodCkge1xuXG5cdFx0XHRudW1iZXJzLmlubmVySFRNTCArPSAnPGRpdiBjbGFzcz1cIm51bVwiPjwvZGl2Pic7XG5cblx0XHR9XG5cblx0fVxuXG5cdG51bWJlcnMuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcblxuXHRlbC5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuXG59XG5cbm1hbmlsYS5jb21wb25lbnQoJ2VkaXRvcicsIHZtID0+IHtcblxuXHR2bS5yZXNldEhlaWdodCA9IHJlc2V0SGVpZ2h0O1xuXG5cdHZtLmxvYWRpbmcgPSBmYWxzZTtcblxuXHRmdW5jdGlvbiBzaG93VGV4dCh0ZXh0KSB7XG5cblx0XHR2bS50ZXh0ID0gdGV4dDtcblxuXHRcdHZtLmxvYWRpbmcgPSBmYWxzZTtcblxuXHRcdHZtLnJlbmRlcigpO1xuXG5cdH1cblxuXHRzZXRUaW1lb3V0KHJlc2V0SGVpZ2h0KTtcblxuXHRyZXR1cm4ge1xuXG5cdFx0dXBkYXRlOiBwYXRoID0+IHtcblxuXHRcdFx0c2hvd1RleHQoJycpO1xuXG5cdFx0XHRpZiAocGF0aCkge1xuXG5cdFx0XHRcdHZtLmxvYWRpbmcgPSB0cnVlO1xuXG5cdFx0XHRcdHZtLmRpc2FibGVkID0gZmFsc2U7XG5cblx0XHRcdFx0YWpheC5nZXQoJy9vcGVuP2ZpbGU9JyArIHBhdGgsIGRhdGEgPT4ge1xuXG5cdFx0XHRcdFx0c2hvd1RleHQoZGF0YS5kYXRhKTtcblxuXHRcdFx0XHRcdHZtLnJlc2V0SGVpZ2h0KCk7XG5cblx0XHRcdFx0fSk7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0dm0uZGlzYWJsZWQgPSB0cnVlO1xuXG5cdFx0XHRcdHNob3dUZXh0KCcnKTtcblxuXHRcdFx0XHR2bS5yZXNldEhlaWdodCgpO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fTtcblxufSk7XG4iLCJpbXBvcnQgZmlsZU1hbmFnZXIgZnJvbSAnLi4vc3JjL2ZpbGVNYW5hZ2VyJztcbmltcG9ydCBhamF4IGZyb20gJy4uL3NyYy9hamF4JztcbmltcG9ydCBtYW5pbGEgZnJvbSAnbW5sYS9jbGllbnQnO1xuXG5tYW5pbGEuY29tcG9uZW50KCduYXYnLCB2bSA9PiB7XG5cblx0bGV0IGNhY2hlID0gdm0uZGlyO1xuXG5cdHZtLm9wZW4gPSB7fTtcblxuXHR2bS5jbGlja0RpciA9IChkaXIsIGUpID0+IHtcblxuXHRcdGRpci5vcGVuID0gIWRpci5vcGVuO1xuXG5cdFx0aWYgKCFkaXIuY2hpbGRyZW4pIHtcblxuXHRcdFx0dm0ubG9hZGluZyA9IHRydWU7XG5cblx0XHRcdGFqYXguZ2V0KCcvbmF2P3BhdGg9JyArIGRpci5wYXRoLCBkYXRhID0+IHtcblxuXHRcdFx0XHRkaXIuY2hpbGRyZW4gPSBkYXRhLmRpcjtcblxuXHRcdFx0XHRkZWxldGUgdm0ubG9hZGluZztcblxuXHRcdFx0XHR2bS5yZW5kZXIoKTtcblxuXHRcdFx0fSk7XG5cblx0XHR9XG5cblx0fTtcblxuXHR2bS5jbGlja0ZpbGUgPSBmaWxlID0+IHtcblxuXHRcdGZpbGVNYW5hZ2VyLm9wZW4oZmlsZSk7XG5cblx0fTtcblxuXHR2bS5yaWdodENsaWNrRGlyID0gKGRpciwgZSkgPT4ge1xuXHRcblx0XHRtYW5pbGEuY29tcG9uZW50cy5jb250ZXh0TWVudS5yaWdodENsaWNrRGlyKGRpciwgZSk7XG5cblx0fTtcblxuXHR2bS5yaWdodENsaWNrRmlsZSA9IChmaWxlLCBlKSA9PiB7XG5cdFxuXHRcdG1hbmlsYS5jb21wb25lbnRzLmNvbnRleHRNZW51LnJpZ2h0Q2xpY2tGaWxlKGZpbGUsIGUpO1xuXG5cdH07XG5cblx0cmV0dXJuIHtcblxuXHRcdHVwZGF0ZTogKHBhdGgsIG9wZW4pID0+IHtcblxuXHRcdFx0aWYgKG9wZW4pIHtcblxuXHRcdFx0XHR2bS5vcGVuW3BhdGhdID0gcGF0aDtcblxuXHRcdFx0XHR2bS5hY3RpdmUgPSBwYXRoO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGRlbGV0ZSB2bS5vcGVuW3BhdGhdO1xuXG5cdFx0XHRcdGRlbGV0ZSB2bS5hY3RpdmU7XG5cblx0XHRcdH1cblxuXHRcdH0sXG5cblx0XHRnZXRBY3RpdmVGaWxlOiAoKSA9PiB7XG5cblx0XHRcdHJldHVybiB2bS5hY3RpdmU7XG5cblx0XHR9LFxuXG5cdFx0cmVuZGVyOiAoKSA9PiB7XG5cblx0XHRcdHZtLnJlbmRlcigpO1xuXG5cdFx0fSxcblxuXHRcdHNob3dTZWFyY2hSZXN1bHRzOiByZXN1bHRzID0+IHtcblxuXHRcdFx0dm0uZGlyID0gcmVzdWx0cztcblxuXHRcdH0sXG5cblx0XHRoaWRlU2VhcmNoUmVzdWx0czogKCkgPT4ge1xuXG5cdFx0XHR2bS5kaXIgPSBjYWNoZTtcblxuXHRcdH1cblxuXHR9O1xuXG59KTtcbiIsImltcG9ydCBhamF4IGZyb20gJy4uL3NyYy9hamF4JztcbmltcG9ydCBtYW5pbGEgZnJvbSAnbW5sYS9jbGllbnQnO1xuaW1wb3J0IHsgZGVib3VuY2UgfSBmcm9tICcuLi9zcmMvZGVib3VuY2UnO1xuXG5tYW5pbGEuY29tcG9uZW50KCdzZWFyY2gnLCB2bSA9PiB7XG5cblx0ZnVuY3Rpb24gc2VhcmNoKGUpIHtcblxuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2gtbG9hZGVyJykuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpO1xuXG5cdFx0YWpheC5nZXQoYC9zZWFyY2g/dGVybT0ke2UudGFyZ2V0LnZhbHVlfWAsIHJlc3VsdHMgPT4ge1xuXHRcdFxuXHRcdFx0bWFuaWxhLmNvbXBvbmVudHMubmF2LnNob3dTZWFyY2hSZXN1bHRzKHJlc3VsdHMpO1xuXG5cdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VhcmNoLWxvYWRlcicpLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKTtcblxuXHRcdH0pO1xuXHRcdFxuXHR9XG5cblx0dm0uc2VhcmNoID0gZGVib3VuY2Uoc2VhcmNoLCAyNTApO1xuXG5cdHZtLmNsb3NlID0gZSA9PiB7XG5cblx0XHRlLnRhcmdldC52YWx1ZSA9ICcnO1xuXG5cdFx0bWFuaWxhLmNvbXBvbmVudHMubmF2LmhpZGVTZWFyY2hSZXN1bHRzKCk7XG5cblx0fTtcblxufSk7XG4iLCJpbXBvcnQgZmlsZU1hbmFnZXIgZnJvbSAnLi4vc3JjL2ZpbGVNYW5hZ2VyJztcbmltcG9ydCBtYW5pbGEgZnJvbSAnbW5sYS9jbGllbnQnO1xuaW1wb3J0IHsgc2F2ZSB9IGZyb20gJy4uL3NyYy9zYXZlJztcblxubWFuaWxhLmNvbXBvbmVudCgndGFicycsIHZtID0+IHtcblxuXHR2bS50YWJzID0ge307XG5cblx0dm0uY2xvc2UgPSBwYXRoID0+IHtcblxuXHRcdGRlbGV0ZSB2bS50YWJzW3BhdGhdO1xuXG5cdFx0ZmlsZU1hbmFnZXIuY2xvc2Uoe1xuXHRcdFx0cGF0aDogcGF0aCxcblx0XHRcdG5hbWU6IHZtLnRhYnNbcGF0aF1cblx0XHR9KTtcblxuXHR9O1xuXG5cdHZtLm9wZW4gPSBwYXRoID0+IHtcblxuXHRcdGZpbGVNYW5hZ2VyLm9wZW4oe1xuXHRcdFx0cGF0aDogcGF0aCxcblx0XHRcdG5hbWU6IHZtLnRhYnNbcGF0aF1cblx0XHR9KTtcblxuXHR9O1xuXG5cdHZtLnNhdmUgPSBzYXZlO1xuXG5cdHJldHVybiB7XG5cblx0XHR1cGRhdGU6IChmaWxlLCBvcGVuKSA9PiB7XG5cblx0XHRcdGlmIChvcGVuKSB7XG5cblx0XHRcdFx0dm0uYWN0aXZlID0gZmlsZS5wYXRoO1xuXG5cdFx0XHRcdHZtLnRhYnNbZmlsZS5wYXRoXSA9IGZpbGUubmFtZTtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRkZWxldGUgdm0udGFic1tmaWxlLnBhdGhdO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fTtcblxufSk7XG4iLCJpbXBvcnQgeyBzYXZlIH0gZnJvbSAnLi9zYXZlJztcblxuY29uc3Qga2V5bWFwID0ge1xuXG5cdFx0OTE6IHtcblx0XHRcdGNhbGxiYWNrOiBzYXZlLFxuXHRcdFx0cGFpcjogODMgXG5cdFx0fSxcblxuXHRcdDgzOiB7XG5cdFx0XHRjYWxsYmFjazogc2F2ZSxcblx0XHRcdHBhaXI6IDkxXG5cdFx0fVxuXG5cdH07XG5cbmxldCBwcmVzc2VkID0geyB9O1xuXG5cbmZ1bmN0aW9uIGtleWRvd24oZSkge1xuXG5cdGxldCBjb2RlID0gZS5rZXlDb2RlIHx8IGUud2hpY2gsXG5cblx0XHRrZXkgPSBrZXltYXBbY29kZV07XG5cblx0aWYgKGtleSkge1xuXG5cdFx0cHJlc3NlZFtjb2RlXSA9IHRydWU7XG5cblx0XHRpZiAocHJlc3NlZFtrZXkucGFpcl0pIHtcblxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRrZXkuY2FsbGJhY2soKTtcblxuXHRcdFx0ZGVsZXRlIHByZXNzZWRbY29kZV07XG5cdFx0XHRkZWxldGUgcHJlc3NlZFtrZXkucGFpcl07XG5cblx0XHR9XG5cblx0fVxuXG59XG5cblxuZnVuY3Rpb24ga2V5dXAoZSkge1xuXG5cdGRlbGV0ZSBwcmVzc2VkW2Uua2V5Q29kZSB8fCBlLndoaWNoXTtcblxufVxuXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBrZXlkb3duKTtcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywga2V5dXApO1xuIiwiZnVuY3Rpb24gc2VyaWFsaXplKGRhdGEpIHtcbiBcbiBcdGxldCBwYXJ0cyA9IFtdO1xuIFxuIFx0Zm9yIChsZXQga2V5IGluIGRhdGEpIHtcbiBcbiBcdFx0cGFydHMucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KGRhdGFba2V5XSkpO1xuXG4gXHR9XG4gXG4gXHRyZXR1cm4gcGFydHMuam9pbignJicpO1xufVxuIFxuZnVuY3Rpb24gZ2V0KHBhdGgsIGRhdGEsIGNhbGxiYWNrKSB7XG5cblx0aWYgKHR5cGVvZiBkYXRhID09PSAnZnVuY3Rpb24nKSB7XG5cblx0XHRjYWxsYmFjayA9IGRhdGE7XG5cblx0fVxuIFxuIFx0bGV0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuIFxuIFx0aWYgKHR5cGVvZiBkYXRhID09PSAnZnVuY3Rpb24nKSB7XG4gXG4gXHRcdGNhbGxiYWNrID0gZGF0YTtcbiBcbiBcdFx0ZGF0YSA9IHt9O1xuXG4gXHR9XG4gXG4gXHRyZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuIFxuIFx0XHRpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCAmJiByZXEuc3RhdHVzID09IDIwMCkge1xuIFxuIFx0XHRcdGxldCByZXN1bHQgPSB2b2lkIDA7XG4gXG4gXHRcdFx0dHJ5IHtcbiBcbiBcdFx0XHRcdHJlc3VsdCA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG5cbiBcdFx0XHR9IGNhdGNoIChlcnIpIHtcbiBcbiBcdFx0XHRcdHJlc3VsdCA9IHJlcS5yZXNwb25zZVRleHQ7XG5cbiBcdFx0XHR9XG4gXG4gXHRcdFx0Y2FsbGJhY2socmVzdWx0KTtcbiBcdFx0fVxuXG4gXHR9O1xuIFxuIFx0cmVxLm9wZW4oJ0dFVCcsIHBhdGgpO1xuIFxuIFx0cmVxLnNlbmQoc2VyaWFsaXplKGRhdGEpKTtcblxufVxuIFxuZnVuY3Rpb24gcG9zdChwYXRoLCBkYXRhLCBjYWxsYmFjaykge1xuXG5cdGlmICh0eXBlb2YgZGF0YSA9PT0gJ2Z1bmN0aW9uJykge1xuXG5cdFx0Y2FsbGJhY2sgPSBkYXRhO1xuXG5cdH1cbiBcbiBcdGxldCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiBcbiBcdHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gXG4gXHRcdGlmIChyZXEucmVhZHlTdGF0ZSA9PSA0ICYmIHJlcS5zdGF0dXMgPT0gMjAwKSB7XG4gXG4gXHRcdFx0bGV0IGpzb24gPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuIFxuIFx0XHRcdGlmIChqc29uKSB7XG4gXG4gXHRcdFx0XHRjYWxsYmFjayhqc29uKTtcblxuIFx0XHRcdH0gZWxzZSB7XG4gXG4gXHRcdFx0XHRjYWxsYmFjayhyZXEucmVzcG9uc2VUZXh0KTtcblxuIFx0XHRcdH1cblxuIFx0XHR9XG5cbiBcdH07XG4gXG4gXHRyZXEub3BlbignUE9TVCcsIHBhdGgpO1xuIFxuIFx0cmVxLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcbiBcbiBcdHJlcS5zZW5kKHNlcmlhbGl6ZShkYXRhKSk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiBcdGdldDogZ2V0LFxuIFx0cG9zdDogcG9zdFxuIFxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQpIHtcbiBcbiAgICBsZXQgdGltZW91dCwgYXJncywgdGltZXN0YW1wO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG5cbiAgICAgICAgdGltZXN0YW1wID0gbmV3IERhdGUoKTtcblxuICAgICAgICBsZXQgbGF0ZXIgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgbGV0IGxhc3QgPSAobmV3IERhdGUoKSkgLSB0aW1lc3RhbXA7XG5cbiAgICAgICAgICAgIGlmIChsYXN0IDwgd2FpdCkge1xuICAgICAgICAgICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0IC0gbGFzdCk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBmdW5jLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCF0aW1lb3V0KSB7XG4gICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgICAgIH1cbiAgICB9O1xufTsiLCJpbXBvcnQgbWFuaWxhIGZyb20gJ21ubGEvY2xpZW50JztcblxubGV0IG9wZW5GaWxlcyA9IHt9O1xuXG5mdW5jdGlvbiBvcGVuKGZpbGUpIHtcblxuXHRtYW5pbGEuY29tcG9uZW50cy5lZGl0b3IudXBkYXRlKGZpbGUucGF0aCk7XG5cblx0bWFuaWxhLmNvbXBvbmVudHMubmF2LnVwZGF0ZShmaWxlLnBhdGgsIHRydWUpO1xuXG5cdG1hbmlsYS5jb21wb25lbnRzLnRhYnMudXBkYXRlKGZpbGUsIHRydWUpO1xuXG5cdG9wZW5GaWxlc1tmaWxlLnBhdGhdID0gZmlsZTtcblxufVxuXG5mdW5jdGlvbiBjbG9zZShmaWxlKSB7XG5cblx0bGV0IG9wZW5MaXN0O1xuXG5cdG1hbmlsYS5jb21wb25lbnRzLmVkaXRvci51cGRhdGUoJycpO1xuXG5cdG1hbmlsYS5jb21wb25lbnRzLm5hdi51cGRhdGUoZmlsZS5wYXRoLCBmYWxzZSk7XG5cdFxuXHRtYW5pbGEuY29tcG9uZW50cy50YWJzLnVwZGF0ZShmaWxlLCBmYWxzZSk7XG5cblx0ZGVsZXRlIG9wZW5GaWxlc1tmaWxlLnBhdGhdO1xuXG5cdG9wZW5MaXN0ID0gT2JqZWN0LmtleXMob3BlbkZpbGVzKTtcblxuXHRpZiAob3Blbkxpc3QubGVuZ3RoKSB7XG5cblx0XHRvcGVuKG9wZW5GaWxlc1tvcGVuTGlzdFtvcGVuTGlzdC5sZW5ndGggLSAxXV0pO1xuXG5cdH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG5cblx0b3Blbjogb3Blbixcblx0Y2xvc2U6IGNsb3NlXG5cbn07IiwibGV0IGRyYWdnaW5nO1xuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmVzaXplJykuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZSA9PiB7XG5cblx0ZHJhZ2dpbmcgPSB0cnVlO1xuXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5jbGFzc0xpc3QuYWRkKCdkcmFnZ2luZycpO1xuXG59KTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBlID0+IHtcblxuXHRkcmFnZ2luZyA9IGZhbHNlO1xuXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnZ2luZycpO1xuXG59KTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGUgPT4ge1xuXG5cdGlmIChkcmFnZ2luZykge1xuXG5cdFx0bGV0IHdpZHRoID0gYGNhbGMoMTAwJSAtICR7ZS5jbGllbnRYfXB4KWA7XG5cblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmFja2dyb3VuZCcpLnN0eWxlLmxlZnQgPSBlLmNsaWVudFggKyAncHgnO1xuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2gtY29tcG9uZW50Jykuc3R5bGUud2lkdGggPSBlLmNsaWVudFggLSA1ICsgJ3B4Jztcblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmFja2dyb3VuZCcpLnN0eWxlLndpZHRoID0gd2lkdGg7XG5cdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhYnMtY29tcG9uZW50Jykuc3R5bGUud2lkdGggPSB3aWR0aDtcblxuXHR9XG5cbn0pOyIsImltcG9ydCBtYW5pbGEgZnJvbSAnbW5sYS9jbGllbnQnO1xuaW1wb3J0IGFqYXggZnJvbSAnLi4vc3JjL2FqYXgnO1xuXG5sZXQgYmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmFja2dyb3VuZCcpXG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlKCkge1xuXG5cdGxldCBmaWxlID0gbWFuaWxhLmNvbXBvbmVudHMubmF2LmdldEFjdGl2ZUZpbGUoKTtcblxuXHRpZiAoZmlsZSkge1xuXG5cdFx0YmcuY2xhc3NMaXN0LmFkZCgnYmx1cicpO1xuXG5cdFx0YWpheC5wb3N0KFxuXG5cdFx0XHQnL3NhdmU/ZmlsZT0nICsgZmlsZSxcblxuXHRcdFx0e1xuXHRcdFx0XHRkYXRhOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGV4dCcpLnZhbHVlXG5cdFx0XHR9LFxuXG5cdFx0XHRyZXN1bHQgPT4ge1xuXG5cdFx0XHRcdGlmIChyZXN1bHQuZXJyb3IpIHtcblxuXHRcdFx0XHRcdGFsZXJ0KHJlc3VsdC5lcnJvcik7XG5cdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IocmVzdWx0LmVycm9yKTtcblx0XHRcdFx0XG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRiZy5jbGFzc0xpc3QucmVtb3ZlKCdibHVyJyk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0XHRcblx0XHQpO1xuXG5cdH1cblxufTsiLCJjb25zdCBjb21waWxlID0gcmVxdWlyZSgnLi9jb21waWxlJyk7XG5cbndpbmRvdy5tYW5pbGEgPSB3aW5kb3cubWFuaWxhIHx8IHt9O1xuXG53aW5kb3cubWFuaWxhLmhhbmRsZXJzID0ge307XG5cbmxldCBjb21wb25lbnRzID0ge30sXG5cdFxuXHRzZWxlY3Rpb247XG5cbmZ1bmN0aW9uIGNvbXBvbmVudChjb21wb25lbnROYW1lLCBjb21wb25lbnQpIHtcblxuXHRsZXQgdm0gPSB3aW5kb3cubWFuaWxhLmRhdGFbY29tcG9uZW50TmFtZV0gfHwge30sXG5cblx0XHRlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWNvbXBvbmVudD1cIiR7Y29tcG9uZW50TmFtZX1cIl1gKTtcblxuXHRjb21waWxlKGAjJHtjb21wb25lbnROYW1lfS10ZW1wbGF0ZWApLnRoZW4ocmVuZGVyID0+IHtcblxuXHRcdGZ1bmN0aW9uIHJlc29sdmUoZGF0YSkge1xuXG5cdFx0XHRsZXQgaW5kZXggPSAwO1xuXG5cdFx0XHR3aW5kb3cubWFuaWxhLmhhbmRsZXJzW2NvbXBvbmVudE5hbWVdID0gW107XG5cblx0XHRcdGRhdGEub24gPSAoZXZlbnQsIGhhbmRsZXIsIC4uLmFyZ3MpID0+IHtcblxuXHRcdFx0XHRsZXQgZXZlbnRTdHJpbmc7XG5cblx0XHRcdFx0d2luZG93Lm1hbmlsYS5oYW5kbGVyc1tjb21wb25lbnROYW1lXVtpbmRleF0gPSBlID0+IHtcblxuXHRcdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0YXJncy5wdXNoKGUpO1xuXG5cdFx0XHRcdFx0aGFuZGxlci5hcHBseShkYXRhLCBhcmdzKTtcblxuXHRcdFx0XHRcdGlmIChlLnRhcmdldC50YWdOYW1lICE9PSAnSU5QVVQnICYmIFxuXHRcdFx0XHRcdFx0IGUudGFyZ2V0LnRhZ05hbWUgIT09ICdURVhUQVJFQScpIHtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhKTtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGV2ZW50U3RyaW5nID0gYG9uJHtldmVudH09bWFuaWxhLmhhbmRsZXJzLiR7Y29tcG9uZW50TmFtZX1bJHtpbmRleH1dKGV2ZW50KWA7XG5cblx0XHRcdFx0aW5kZXgrKztcblxuXHRcdFx0XHRyZXR1cm4gZXZlbnRTdHJpbmc7XG5cblx0XHRcdH07XG5cblx0XHRcdGVsLmlubmVySFRNTCA9IHJlbmRlcihkYXRhKTtcblxuXHRcdH1cblxuXHRcdHZtLnJlbmRlciA9ICgpID0+IHtcblxuXHRcdFx0cmVzb2x2ZSh2bSk7XG5cdFx0XHRcblx0XHR9O1xuXG5cdFx0bGV0IG1ldGhvZHMgPSBjb21wb25lbnQodm0pO1xuXG5cdFx0aWYgKG1ldGhvZHMpIHtcblxuXHRcdFx0Y29tcG9uZW50c1tjb21wb25lbnROYW1lXSA9IHt9O1xuXG5cdFx0XHRPYmplY3Qua2V5cyhtZXRob2RzKS5mb3JFYWNoKGtleSA9PiB7XG5cblx0XHRcdFx0Y29tcG9uZW50c1tjb21wb25lbnROYW1lXVtrZXldID0gKC4uLmFyZ3MpID0+IHtcblxuXHRcdFx0XHRcdGxldCByZXN1bHQgPSBtZXRob2RzW2tleV0uYXBwbHkodm0sIGFyZ3MpO1xuXG5cdFx0XHRcdFx0cmVzb2x2ZSh2bSk7XG5cblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXG5cdFx0XHRcdH07XG5cblx0XHRcdH0pO1xuXG5cdFx0fVxuXG5cdFx0cmVzb2x2ZSh2bSk7XG5cblx0fSk7XG5cblx0cmV0dXJuIHdpbmRvdy5tYW5pbGE7XG5cbn1cblxud2luZG93Lm1hbmlsYS5jb21wb25lbnQgPSBjb21wb25lbnQ7XG53aW5kb3cubWFuaWxhLmNvbXBvbmVudHMgPSBjb21wb25lbnRzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0Y29tcG9uZW50OiBjb21wb25lbnQsXG5cdGNvbXBvbmVudHM6IGNvbXBvbmVudHNcbn07XG4iLCJjb25zdCBtYW5pbGEgPSByZXF1aXJlKCdtYW5pbGEvcGFyc2UnKTtcblxubGV0IGNhY2hlID0ge30sXG5cblx0ZXNjYXBlTWFwID0ge1xuICAgICAgICAnPCc6ICcmbHQ7JyxcbiAgICAgICAgJz4nOiAnJmd0OycsXG4gICAgICAgICdcIic6ICcmcXVvdDsnLFxuICAgICAgICAnXFwnJzogJyZhcG9zOydcbiAgICB9O1xuXG5mdW5jdGlvbiBodG1sRXNjYXBlKHN0cikge1xuXG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bJjw+J1wiXS9nLCBjID0+IHtcblxuICAgICAgICByZXR1cm4gZXNjYXBlTWFwW2NdO1xuXG4gICAgfSk7XG5cbn1cblxud2luZG93Lm1hbmlsYSA9IHdpbmRvdy5tYW5pbGEgfHwge307XG5cbndpbmRvdy5tYW5pbGEuZSA9IGZ1bmN0aW9uKHZhbCkge1xuXG4gICAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnID8gaHRtbEVzY2FwZSh2YWwpIDogdmFsO1xuICAgIFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21waWxlKHNlbGVjdG9yKSB7XG5cblx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuXG5cdFx0aWYgKCFzZWxlY3Rvcikge1xuXG5cdFx0XHRyZXNvbHZlKCAoKT0+e30gKTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdGlmIChjYWNoZVtzZWxlY3Rvcl0pIHtcblxuXHRcdFx0XHRyZXNvbHZlKGNhY2hlW3NlbGVjdG9yXSk7XG5cblx0XHRcdH1cblxuXHRcdFx0Y2FjaGVbc2VsZWN0b3JdID0gbWFuaWxhKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpLmlubmVySFRNTCk7XG5cblx0XHRcdHJlc29sdmUoY2FjaGVbc2VsZWN0b3JdKTtcblxuXHRcdH1cblxuXHR9KTtcblxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0ZW1wbGF0ZSkge1xuXG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbignY29udGV4dCcsXG5cbiAgICAgICAgXCJ2YXIgcD1bXTt3aXRoKGNvbnRleHQpe3AucHVzaChgXCIgK1xuICAgICAgIFxuICAgICAgICB0ZW1wbGF0ZVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFwvZywgXCJcXFxcXFxcXFwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoL2AvZywgXCJcXFxcYFwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoLzw6Oig/IVxccyp9Lio/Ojo+KSg/IS4qe1xccyo6Oj4pKC4qPyk6Oj4vZywgXCJgKTt0cnl7cC5wdXNoKCQxKX1jYXRjaChlKXt9cC5wdXNoKGBcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC88Ojo/KD8hXFxzKn0uKj86Oj8+KSg/IS4qe1xccyo6Oj8+KSguKj8pOjo/Pi9nLCBcImApO3RyeXtwLnB1c2gobWFuaWxhLmUoJDEpKX1jYXRjaChlKXt9cC5wdXNoKGBcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC88Ojo/KC4qPyk6Oj8+L2csIFwiYCk7JDFcXG5wLnB1c2goYFwiKVxuXG4gICAgICArIFwiYCk7fXJldHVybiBwLmpvaW4oJycpO1wiKTtcbn07Il19
