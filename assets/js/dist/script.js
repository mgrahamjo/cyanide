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

},{"./components/contextMenu":2,"./components/editor":3,"./components/nav":4,"./components/search":5,"./components/tabs":6,"./src/addKeyboardShortcuts":7,"./src/resize":12}],2:[function(require,module,exports){
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

},{"../src/ajax":8,"../src/fileManager":10,"mnla/client":14}],3:[function(require,module,exports){
'use strict';

var _ajax = require('../src/ajax');

var _ajax2 = _interopRequireDefault(_ajax);

var _client = require('mnla/client');

var _client2 = _interopRequireDefault(_client);

var _loadMode = require('../src/loadMode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_client2.default.component('editor', function (vm) {

	var openFiles = {},
	    editor = void 0,
	    currentPath = void 0;

	vm.loading = false;

	function showText(text, extension) {

		vm.text = text;

		vm.loading = false;

		vm.render();

		if (text && extension) {

			(0, _loadMode.loadMode)(extension).then(function (mode) {

				editor = CodeMirror.fromTextArea(document.querySelector('.text'), {
					theme: 'monokai',
					lineNumbers: true,
					lineWrapping: true,
					scrollbarStyle: null,
					mode: mode
				});
			});
		}
	}

	return {

		update: function update(path) {

			var extension = path.split('.');

			extension = extension[extension.length - 1];

			showText('');

			if (currentPath && editor) {

				openFiles[currentPath] = editor.getValue();
			}

			currentPath = path;

			if (openFiles[path]) {

				showText(openFiles[path], extension);
			} else {

				vm.loading = true;

				_ajax2.default.get('/open?file=' + path, function (data) {

					showText(data.data, extension);
				});
			}
		},

		close: function close(path) {

			showText('');

			delete openFiles[path];
		}

	};
});

},{"../src/ajax":8,"../src/loadMode":11,"mnla/client":14}],4:[function(require,module,exports){
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

},{"../src/ajax":8,"../src/fileManager":10,"mnla/client":14}],5:[function(require,module,exports){
'use strict';

var _ajax = require('../src/ajax');

var _ajax2 = _interopRequireDefault(_ajax);

var _client = require('mnla/client');

var _client2 = _interopRequireDefault(_client);

var _debounce = require('../src/debounce');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_client2.default.component('search', function (vm) {

	var req = void 0;

	function search(e) {

		document.querySelector('.search-loader').classList.add('visible');

		if (req) {

			req.abort();
		}

		req = _ajax2.default.get('/search?term=' + e.target.value, function (results) {

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

},{"../src/ajax":8,"../src/debounce":9,"mnla/client":14}],6:[function(require,module,exports){
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

},{"../src/fileManager":10,"../src/save":13,"mnla/client":14}],7:[function(require,module,exports){
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

},{"./save":13}],8:[function(require,module,exports){
'use strict';

function serialize(data) {

  var parts = [];

  for (var key in data) {

    parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
  }

  return parts.join('&');
}

function error(text) {

  alert('An error occurred. ' + text);
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

    if (req.readyState === 4) {

      if (req.status === 200) {

        var result = void 0;

        try {

          result = JSON.parse(req.responseText);
        } catch (err) {

          result = req.responseText;
        }

        callback(result);
      } else if (req.status >= 400) {

        error(req.statusText);
      }
    }
  };

  req.onerror = function () {

    error(path);
  };

  req.open('GET', path);

  req.send(serialize(data));

  return req;
}

function post(path, data, callback) {

  if (typeof data === 'function') {

    callback = data;
  }

  var req = new XMLHttpRequest();

  req.onreadystatechange = function () {

    if (req.readyState === 4) {

      if (req.status === 200) {

        var json = JSON.parse(req.responseText);

        if (json) {

          callback(json);
        } else {

          callback(req.responseText);
        }
      } else if (req.status >= 400) {

        alert(req.statusText);
      }
    }
  };

  req.onerror = function () {

    error(path);
  };

  req.open('POST', path);

  req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  req.send(serialize(data));

  return req;
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

	_client2.default.components.editor.close(file.path);

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

},{"mnla/client":14}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.loadMode = loadMode;
var body = document.querySelector('body'),
    loadedModes = {
	xml: true,
	css: true,
	javascript: true,
	htmlmixed: true
};

function loadMode(extension) {

	return new Promise(function (resolve) {

		var mode = modes[extension] ? modes[extension].name || modes[extension] : 'shell';

		if (!loadedModes[mode]) {

			loadedModes[mode] = true;

			var script = document.createElement('script');

			script.type = 'text/javascript';

			script.src = '/assets/js/dist/' + mode + '.js';

			script.onload = function () {

				resolve(mode);
			};

			body.appendChild(script);
		} else {

			resolve(mode);
		}
	});
};

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{"../src/ajax":8,"mnla/client":14}],14:[function(require,module,exports){
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

},{"./compile":15}],15:[function(require,module,exports){
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

},{"manila/parse":16}],16:[function(require,module,exports){
'use strict';

module.exports = function (template) {

    return new Function('context', "var p=[];with(context){p.push(`" + template.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/<::(?!\s*}.*?::>)(?!.*{\s*::>)(.*?)::>/g, "`);try{p.push($1)}catch(e){}p.push(`").replace(/<::?(?!\s*}.*?::?>)(?!.*{\s*::?>)(.*?)::?>/g, "`);try{p.push(manila.e($1))}catch(e){}p.push(`").replace(/<::?(.*?)::?>/g, "`);$1\np.push(`") + "`);}return p.join('');");
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvYXBwLmpzIiwiYXNzZXRzL2pzL2NvbXBvbmVudHMvY29udGV4dE1lbnUuanMiLCJhc3NldHMvanMvY29tcG9uZW50cy9lZGl0b3IuanMiLCJhc3NldHMvanMvY29tcG9uZW50cy9uYXYuanMiLCJhc3NldHMvanMvY29tcG9uZW50cy9zZWFyY2guanMiLCJhc3NldHMvanMvY29tcG9uZW50cy90YWJzLmpzIiwiYXNzZXRzL2pzL3NyYy9hZGRLZXlib2FyZFNob3J0Y3V0cy5qcyIsImFzc2V0cy9qcy9zcmMvYWpheC5qcyIsImFzc2V0cy9qcy9zcmMvZGVib3VuY2UuanMiLCJhc3NldHMvanMvc3JjL2ZpbGVNYW5hZ2VyLmpzIiwiYXNzZXRzL2pzL3NyYy9sb2FkTW9kZS5qcyIsImFzc2V0cy9qcy9zcmMvcmVzaXplLmpzIiwiYXNzZXRzL2pzL3NyYy9zYXZlLmpzIiwibm9kZV9tb2R1bGVzL21ubGEvY2xpZW50LmpzIiwibm9kZV9tb2R1bGVzL21ubGEvY29tcGlsZS5qcyIsIm5vZGVfbW9kdWxlcy9tbmxhL25vZGVfbW9kdWxlcy9tYW5pbGEvcGFyc2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7QUNOQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQUksZ0JBQUo7O0FBRUEsaUJBQU8sU0FBUCxDQUFpQixhQUFqQixFQUFnQyxjQUFNOztBQUVyQyxJQUFHLElBQUgsR0FBVSxJQUFWOztBQUVBLFVBQVMsSUFBVCxDQUFjLElBQWQsRUFBb0IsQ0FBcEIsRUFBdUI7O0FBRXRCLElBQUUsY0FBRjs7QUFFQSxZQUFVLElBQVY7O0FBRUEsS0FBRyxJQUFILEdBQVUsRUFBRSxPQUFaOztBQUVBLEtB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T0FGTCxDQUVhLElBRmIsRUFFbUIsS0FGbkIsRUFHSyxPQUhMLENBR2EseUNBSGIsRUFHd0Qsc0NBSHhELEVBSUssT0FKTCxDQUlhLDZDQUpiLEVBSTRELGdEQUo1RCxFQUtLLE9BTEwsQ0FLYSxnQkFMYixFQUsrQixpQkFML0IsQ0FGQSxHQVNBLHdCQVhHLENBQVA7QUFZSCxDQWREIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBhZGRLZXlib2FyZFNob3J0Y3V0cyBmcm9tICcuL3NyYy9hZGRLZXlib2FyZFNob3J0Y3V0cyc7XG5pbXBvcnQgcmVzaXplIGZyb20gJy4vc3JjL3Jlc2l6ZSc7XG5pbXBvcnQgbmF2IGZyb20gJy4vY29tcG9uZW50cy9uYXYnO1xuaW1wb3J0IGVkaXRvciBmcm9tICcuL2NvbXBvbmVudHMvZWRpdG9yJztcbmltcG9ydCB0YWJzIGZyb20gJy4vY29tcG9uZW50cy90YWJzJztcbmltcG9ydCBjb250ZXh0TWVudSBmcm9tICcuL2NvbXBvbmVudHMvY29udGV4dE1lbnUnO1xuaW1wb3J0IHNlYXJjaCBmcm9tICcuL2NvbXBvbmVudHMvc2VhcmNoJztcbiIsImltcG9ydCBtYW5pbGEgZnJvbSAnbW5sYS9jbGllbnQnO1xuaW1wb3J0IGFqYXggZnJvbSAnLi4vc3JjL2FqYXgnO1xuaW1wb3J0IGZpbGVNYW5hZ2VyIGZyb20gJy4uL3NyYy9maWxlTWFuYWdlcic7XG5cbmxldCBjdXJyZW50O1xuXG5tYW5pbGEuY29tcG9uZW50KCdjb250ZXh0TWVudScsIHZtID0+IHtcblxuXHR2bS5maWxlID0gdHJ1ZTtcblxuXHRmdW5jdGlvbiBvcGVuKGl0ZW0sIGUpIHtcblxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGN1cnJlbnQgPSBpdGVtO1xuXG5cdFx0dm0ubGVmdCA9IGUuY2xpZW50WDtcblxuXHRcdHZtLnRvcCA9IGUuY2xpZW50WTtcblxuXHRcdHZtLnZpc2libGUgPSB0cnVlO1xuXG5cdH1cblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblxuXHRcdGlmICh2bS52aXNpYmxlKSB7XG5cblx0XHRcdHZtLnZpc2libGUgPSBmYWxzZTtcblxuXHRcdFx0dm0ucmVuZGVyKCk7XG5cblx0XHR9XG5cblx0fSk7XG5cblx0dm0ucmVuYW1lID0gKCkgPT4ge1xuXG5cdFx0dm0udmlzaWJsZSA9IGZhbHNlO1xuXG5cdFx0dm0ucmVuZGVyKCk7XG5cblx0XHRsZXQgbmFtZSA9IHByb21wdCgnTmV3IG5hbWU6Jyk7XG5cblx0XHRpZiAobmFtZSkge1xuXG5cdFx0XHRhamF4LnBvc3QoXG5cblx0XHRcdFx0Jy9yZW5hbWU/cGF0aD0nICsgY3VycmVudC5wYXRoLFxuXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRuYW1lOiBuYW1lXG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0cmVzdWx0ID0+IHtcblxuXHRcdFx0XHRcdGlmIChyZXN1bHQuZXJyb3IpIHtcblxuXHRcdFx0XHRcdFx0YWxlcnQocmVzdWx0LmVycm9yKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IocmVzdWx0LmVycm9yKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0XHR2bS5yZW5kZXIoKTtcblxuXHRcdFx0XHRcdFx0ZmlsZU1hbmFnZXIuY2xvc2UoY3VycmVudCk7XG5cblx0XHRcdFx0XHRcdGN1cnJlbnQubmFtZSA9IG5hbWU7XG5cblx0XHRcdFx0XHRcdGN1cnJlbnQucGF0aCA9IHJlc3VsdC5kYXRhO1xuXG5cdFx0XHRcdFx0XHRmaWxlTWFuYWdlci5vcGVuKGN1cnJlbnQpO1xuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHQpO1xuXG5cdFx0fVxuXG5cdH07XG5cblx0dm0uZGVsZXRlUGF0aCA9ICgpID0+IHtcblxuXHRcdHZtLnZpc2libGUgPSBmYWxzZTtcblxuXHRcdGFqYXgucG9zdChcblxuXHRcdFx0Jy9kZWxldGU/cGF0aD0nICsgY3VycmVudC5wYXRoLFxuXG5cdFx0XHRyZXN1bHQgPT4ge1xuXG5cdFx0XHRcdGlmIChyZXN1bHQuZXJyb3IpIHtcblxuXHRcdFx0XHRcdGFsZXJ0KHJlc3VsdC5lcnJvcik7XG5cdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IocmVzdWx0LmVycm9yKTtcblx0XHRcdFx0XG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRpZiAodm0uZmlsZSkge1xuXG5cdFx0XHRcdFx0XHRmaWxlTWFuYWdlci5jbG9zZShjdXJyZW50KTtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGN1cnJlbnQuZGVsZXRlZCA9IHRydWU7XG5cblx0XHRcdFx0XHRtYW5pbGEuY29tcG9uZW50cy5uYXYucmVuZGVyKCk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0XHRcblx0XHQpO1xuXG5cdH07XG5cblx0dm0ubmV3RmlsZSA9ICgpID0+IHtcblxuXHRcdHZtLnZpc2libGUgPSBmYWxzZTtcblxuXHRcdHZtLnJlbmRlcigpO1xuXG5cdFx0bGV0IG5hbWUgPSBwcm9tcHQoJ0ZpbGUgbmFtZTonKTtcblxuXHRcdGFqYXgucG9zdChcblxuXHRcdFx0Jy9uZXctZmlsZT9wYXRoPScgKyBjdXJyZW50LnBhdGgsXG5cblx0XHRcdHtcblx0XHRcdFx0bmFtZTogbmFtZVxuXHRcdFx0fSxcblxuXHRcdFx0cmVzdWx0ID0+IHtcblxuXHRcdFx0XHRpZiAocmVzdWx0LmVycm9yKSB7XG5cblx0XHRcdFx0XHRhbGVydChyZXN1bHQuZXJyb3IpO1xuXHRcdFx0XHRcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKHJlc3VsdC5lcnJvcik7XG5cdFx0XHRcdFxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0bGV0IG5ld0ZpbGUgPSB7XG5cdFx0XHRcdFx0XHRuYW1lOiBuYW1lLFxuXHRcdFx0XHRcdFx0cGF0aDogcmVzdWx0LmRhdGFcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0Y3VycmVudC5jaGlsZHJlbiA9IGN1cnJlbnQuY2hpbGRyZW4gfHwgeyBmaWxlczpbXSB9O1xuXG5cdFx0XHRcdFx0Y3VycmVudC5jaGlsZHJlbi5maWxlcy5wdXNoKG5ld0ZpbGUpO1xuXG5cdFx0XHRcdFx0ZmlsZU1hbmFnZXIub3BlbihuZXdGaWxlKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHRcdFxuXHRcdCk7XG5cblx0fTtcblxuXHR2bS5uZXdEaXIgPSAoKSA9PiB7XG5cblx0XHR2bS52aXNpYmxlID0gZmFsc2U7XG5cblx0XHR2bS5yZW5kZXIoKTtcblxuXHRcdGxldCBuYW1lID0gcHJvbXB0KCdGb2xkZXIgbmFtZTonKTtcblxuXHRcdGFqYXgucG9zdChcblxuXHRcdFx0Jy9uZXctZGlyP3BhdGg9JyArIGN1cnJlbnQucGF0aCxcblxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiBuYW1lXG5cdFx0XHR9LFxuXG5cdFx0XHRyZXN1bHQgPT4ge1xuXG5cdFx0XHRcdGlmIChyZXN1bHQuZXJyb3IpIHtcblxuXHRcdFx0XHRcdGFsZXJ0KHJlc3VsdC5lcnJvcik7XG5cdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IocmVzdWx0LmVycm9yKTtcblx0XHRcdFx0XG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRjdXJyZW50LmNoaWxkcmVuID0gY3VycmVudC5jaGlsZHJlbiB8fCB7IGRpcnM6W10gfTtcblxuXHRcdFx0XHRcdGN1cnJlbnQuY2hpbGRyZW4uZGlycy5wdXNoKHtcblx0XHRcdFx0XHRcdG5hbWU6IG5hbWUsXG5cdFx0XHRcdFx0XHRwYXRoOiByZXN1bHQuZGF0YVxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0bWFuaWxhLmNvbXBvbmVudHMubmF2LnJlbmRlcigpO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0KTtcblxuXHR9O1xuXG5cdHJldHVybiB7XG5cblx0XHRyaWdodENsaWNrRGlyOiAoZGlyLCBlKSA9PiB7XG5cblx0XHRcdHZtLmZpbGUgPSBmYWxzZTtcblxuXHRcdFx0dm0ucGFyZW50ID0gZGlyLnBhcmVudDtcblxuXHRcdFx0b3BlbihkaXIsIGUpO1xuXG5cdFx0fSxcblxuXHRcdHJpZ2h0Q2xpY2tGaWxlOiAoZmlsZSwgZSkgPT4ge1xuXG5cdFx0XHR2bS5maWxlID0gdHJ1ZTtcblxuXHRcdFx0dm0ucGFyZW50ID0gZmFsc2U7XG5cblx0XHRcdG9wZW4oZmlsZSwgZSlcblxuXHRcdH1cblxuXHR9XG5cbn0pO1xuIiwiaW1wb3J0IGFqYXggZnJvbSAnLi4vc3JjL2FqYXgnO1xuaW1wb3J0IG1hbmlsYSBmcm9tICdtbmxhL2NsaWVudCc7XG5pbXBvcnQgeyBsb2FkTW9kZSB9IGZyb20gJy4uL3NyYy9sb2FkTW9kZSc7XG5cbm1hbmlsYS5jb21wb25lbnQoJ2VkaXRvcicsIHZtID0+IHtcblxuXHRsZXQgb3BlbkZpbGVzID0ge30sXG5cdFx0ZWRpdG9yLFxuXHRcdGN1cnJlbnRQYXRoO1xuXG5cdHZtLmxvYWRpbmcgPSBmYWxzZTtcblxuXHRmdW5jdGlvbiBzaG93VGV4dCh0ZXh0LCBleHRlbnNpb24pIHtcblxuXHRcdHZtLnRleHQgPSB0ZXh0O1xuXG5cdFx0dm0ubG9hZGluZyA9IGZhbHNlO1xuXG5cdFx0dm0ucmVuZGVyKCk7XG5cblx0XHRpZiAodGV4dCAmJiBleHRlbnNpb24pIHtcblxuXHRcdFx0bG9hZE1vZGUoZXh0ZW5zaW9uKS50aGVuKG1vZGUgPT4ge1xuXG5cdFx0XHRcdGVkaXRvciA9IENvZGVNaXJyb3IuZnJvbVRleHRBcmVhKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZXh0JyksIHtcblx0XHRcdFx0XHR0aGVtZTogJ21vbm9rYWknLFxuXHRcdFx0XHQgXHRsaW5lTnVtYmVyczogdHJ1ZSxcblx0XHRcdFx0IFx0bGluZVdyYXBwaW5nOiB0cnVlLFxuXHRcdFx0XHQgXHRzY3JvbGxiYXJTdHlsZTogbnVsbCxcblx0XHRcdFx0IFx0bW9kZTogbW9kZVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0fSk7XG5cblx0XHR9XG5cblxuXG5cdH1cblxuXHRyZXR1cm4ge1xuXG5cdFx0dXBkYXRlOiBwYXRoID0+IHtcblxuXHRcdFx0bGV0IGV4dGVuc2lvbiA9IHBhdGguc3BsaXQoJy4nKTtcblxuXHRcdFx0ZXh0ZW5zaW9uID0gZXh0ZW5zaW9uW2V4dGVuc2lvbi5sZW5ndGggLSAxXTtcblxuXHRcdFx0c2hvd1RleHQoJycpO1xuXG5cdFx0XHRpZiAoY3VycmVudFBhdGggJiYgZWRpdG9yKSB7XG5cblx0XHRcdFx0b3BlbkZpbGVzW2N1cnJlbnRQYXRoXSA9IGVkaXRvci5nZXRWYWx1ZSgpO1xuXG5cdFx0XHR9XG5cblx0XHRcdGN1cnJlbnRQYXRoID0gcGF0aDtcblxuXHRcdFx0aWYgKG9wZW5GaWxlc1twYXRoXSkge1xuXG5cdFx0XHRcdHNob3dUZXh0KG9wZW5GaWxlc1twYXRoXSwgZXh0ZW5zaW9uKTtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHR2bS5sb2FkaW5nID0gdHJ1ZTtcblxuXHRcdFx0XHRhamF4LmdldCgnL29wZW4/ZmlsZT0nICsgcGF0aCwgZGF0YSA9PiB7XG5cblx0XHRcdFx0XHRzaG93VGV4dChkYXRhLmRhdGEsIGV4dGVuc2lvbik7XG5cblx0XHRcdFx0fSk7XG5cblx0XHRcdH1cblxuXHRcdH0sXG5cblx0XHRjbG9zZTogcGF0aCA9PiB7XG5cblx0XHRcdHNob3dUZXh0KCcnKTtcblxuXHRcdFx0ZGVsZXRlIG9wZW5GaWxlc1twYXRoXTtcblxuXHRcdH1cblxuXHR9O1xuXG59KTtcbiIsImltcG9ydCBmaWxlTWFuYWdlciBmcm9tICcuLi9zcmMvZmlsZU1hbmFnZXInO1xuaW1wb3J0IGFqYXggZnJvbSAnLi4vc3JjL2FqYXgnO1xuaW1wb3J0IG1hbmlsYSBmcm9tICdtbmxhL2NsaWVudCc7XG5cbm1hbmlsYS5jb21wb25lbnQoJ25hdicsIHZtID0+IHtcblxuXHRsZXQgY2FjaGUgPSB2bS5kaXI7XG5cblx0dm0ub3BlbiA9IHt9O1xuXG5cdHZtLmNsaWNrRGlyID0gKGRpciwgZSkgPT4ge1xuXG5cdFx0ZGlyLm9wZW4gPSAhZGlyLm9wZW47XG5cblx0XHRpZiAoIWRpci5jaGlsZHJlbikge1xuXG5cdFx0XHR2bS5sb2FkaW5nID0gdHJ1ZTtcblxuXHRcdFx0YWpheC5nZXQoJy9uYXY/cGF0aD0nICsgZGlyLnBhdGgsIGRhdGEgPT4ge1xuXG5cdFx0XHRcdGRpci5jaGlsZHJlbiA9IGRhdGEuZGlyO1xuXG5cdFx0XHRcdGRlbGV0ZSB2bS5sb2FkaW5nO1xuXG5cdFx0XHRcdHZtLnJlbmRlcigpO1xuXG5cdFx0XHR9KTtcblxuXHRcdH1cblxuXHR9O1xuXG5cdHZtLmNsaWNrRmlsZSA9IGZpbGUgPT4ge1xuXG5cdFx0ZmlsZU1hbmFnZXIub3BlbihmaWxlKTtcblxuXHR9O1xuXG5cdHZtLnJpZ2h0Q2xpY2tEaXIgPSAoZGlyLCBlKSA9PiB7XG5cdFxuXHRcdG1hbmlsYS5jb21wb25lbnRzLmNvbnRleHRNZW51LnJpZ2h0Q2xpY2tEaXIoZGlyLCBlKTtcblxuXHR9O1xuXG5cdHZtLnJpZ2h0Q2xpY2tGaWxlID0gKGZpbGUsIGUpID0+IHtcblx0XG5cdFx0bWFuaWxhLmNvbXBvbmVudHMuY29udGV4dE1lbnUucmlnaHRDbGlja0ZpbGUoZmlsZSwgZSk7XG5cblx0fTtcblxuXHRyZXR1cm4ge1xuXG5cdFx0dXBkYXRlOiAocGF0aCwgb3BlbikgPT4ge1xuXG5cdFx0XHRpZiAob3Blbikge1xuXG5cdFx0XHRcdHZtLm9wZW5bcGF0aF0gPSBwYXRoO1xuXG5cdFx0XHRcdHZtLmFjdGl2ZSA9IHBhdGg7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0ZGVsZXRlIHZtLm9wZW5bcGF0aF07XG5cblx0XHRcdFx0ZGVsZXRlIHZtLmFjdGl2ZTtcblxuXHRcdFx0fVxuXG5cdFx0fSxcblxuXHRcdGdldEFjdGl2ZUZpbGU6ICgpID0+IHtcblxuXHRcdFx0cmV0dXJuIHZtLmFjdGl2ZTtcblxuXHRcdH0sXG5cblx0XHRyZW5kZXI6ICgpID0+IHtcblxuXHRcdFx0dm0ucmVuZGVyKCk7XG5cblx0XHR9LFxuXG5cdFx0c2hvd1NlYXJjaFJlc3VsdHM6IHJlc3VsdHMgPT4ge1xuXG5cdFx0XHR2bS5kaXIgPSByZXN1bHRzO1xuXG5cdFx0fSxcblxuXHRcdGhpZGVTZWFyY2hSZXN1bHRzOiAoKSA9PiB7XG5cblx0XHRcdHZtLmRpciA9IGNhY2hlO1xuXG5cdFx0fVxuXG5cdH07XG5cbn0pO1xuIiwiaW1wb3J0IGFqYXggZnJvbSAnLi4vc3JjL2FqYXgnO1xuaW1wb3J0IG1hbmlsYSBmcm9tICdtbmxhL2NsaWVudCc7XG5pbXBvcnQgeyBkZWJvdW5jZSB9IGZyb20gJy4uL3NyYy9kZWJvdW5jZSc7XG5cbm1hbmlsYS5jb21wb25lbnQoJ3NlYXJjaCcsIHZtID0+IHtcblxuXHRsZXQgcmVxO1xuXG5cdGZ1bmN0aW9uIHNlYXJjaChlKSB7XG5cblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VhcmNoLWxvYWRlcicpLmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKTtcblxuXHRcdGlmIChyZXEpIHtcblxuXHRcdFx0cmVxLmFib3J0KCk7XG5cblx0XHR9XG5cblx0XHRyZXEgPSBhamF4LmdldChgL3NlYXJjaD90ZXJtPSR7ZS50YXJnZXQudmFsdWV9YCwgcmVzdWx0cyA9PiB7XG5cdFx0XG5cdFx0XHRtYW5pbGEuY29tcG9uZW50cy5uYXYuc2hvd1NlYXJjaFJlc3VsdHMocmVzdWx0cyk7XG5cblx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2gtbG9hZGVyJykuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpO1xuXG5cdFx0fSk7XG5cdFx0XG5cdH1cblxuXHR2bS5zZWFyY2ggPSBkZWJvdW5jZShzZWFyY2gsIDI1MCk7XG5cblx0dm0uY2xvc2UgPSBlID0+IHtcblxuXHRcdGUudGFyZ2V0LnZhbHVlID0gJyc7XG5cblx0XHRtYW5pbGEuY29tcG9uZW50cy5uYXYuaGlkZVNlYXJjaFJlc3VsdHMoKTtcblxuXHR9O1xuXG59KTtcbiIsImltcG9ydCBmaWxlTWFuYWdlciBmcm9tICcuLi9zcmMvZmlsZU1hbmFnZXInO1xuaW1wb3J0IG1hbmlsYSBmcm9tICdtbmxhL2NsaWVudCc7XG5pbXBvcnQgeyBzYXZlIH0gZnJvbSAnLi4vc3JjL3NhdmUnO1xuXG5tYW5pbGEuY29tcG9uZW50KCd0YWJzJywgdm0gPT4ge1xuXG5cdHZtLnRhYnMgPSB7fTtcblxuXHR2bS5jbG9zZSA9IHBhdGggPT4ge1xuXG5cdFx0ZGVsZXRlIHZtLnRhYnNbcGF0aF07XG5cblx0XHRmaWxlTWFuYWdlci5jbG9zZSh7XG5cdFx0XHRwYXRoOiBwYXRoLFxuXHRcdFx0bmFtZTogdm0udGFic1twYXRoXVxuXHRcdH0pO1xuXG5cdH07XG5cblx0dm0ub3BlbiA9IHBhdGggPT4ge1xuXG5cdFx0ZmlsZU1hbmFnZXIub3Blbih7XG5cdFx0XHRwYXRoOiBwYXRoLFxuXHRcdFx0bmFtZTogdm0udGFic1twYXRoXVxuXHRcdH0pO1xuXG5cdH07XG5cblx0dm0uc2F2ZSA9IHNhdmU7XG5cblx0cmV0dXJuIHtcblxuXHRcdHVwZGF0ZTogKGZpbGUsIG9wZW4pID0+IHtcblxuXHRcdFx0aWYgKG9wZW4pIHtcblxuXHRcdFx0XHR2bS5hY3RpdmUgPSBmaWxlLnBhdGg7XG5cblx0XHRcdFx0dm0udGFic1tmaWxlLnBhdGhdID0gZmlsZS5uYW1lO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGRlbGV0ZSB2bS50YWJzW2ZpbGUucGF0aF07XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9O1xuXG59KTtcbiIsImltcG9ydCB7IHNhdmUgfSBmcm9tICcuL3NhdmUnO1xuXG5jb25zdCBrZXltYXAgPSB7XG5cblx0XHQ5MToge1xuXHRcdFx0Y2FsbGJhY2s6IHNhdmUsXG5cdFx0XHRwYWlyOiA4MyBcblx0XHR9LFxuXG5cdFx0ODM6IHtcblx0XHRcdGNhbGxiYWNrOiBzYXZlLFxuXHRcdFx0cGFpcjogOTFcblx0XHR9LFxuXG5cdH07XG5cbmxldCBwcmVzc2VkID0geyB9O1xuXG5cbmZ1bmN0aW9uIGtleWRvd24oZSkge1xuXG5cdGxldCBjb2RlID0gZS5rZXlDb2RlIHx8IGUud2hpY2gsXG5cblx0XHRrZXkgPSBrZXltYXBbY29kZV07XG5cblx0aWYgKGtleSkge1xuXG5cdFx0cHJlc3NlZFtjb2RlXSA9IHRydWU7XG5cblx0XHRpZiAocHJlc3NlZFtrZXkucGFpcl0pIHtcblxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRrZXkuY2FsbGJhY2soKTtcblxuXHRcdFx0ZGVsZXRlIHByZXNzZWRbY29kZV07XG5cdFx0XHRkZWxldGUgcHJlc3NlZFtrZXkucGFpcl07XG5cblx0XHR9XG5cblx0fVxuXG59XG5cblxuZnVuY3Rpb24ga2V5dXAoZSkge1xuXG5cdGRlbGV0ZSBwcmVzc2VkW2Uua2V5Q29kZSB8fCBlLndoaWNoXTtcblxufVxuXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBrZXlkb3duKTtcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywga2V5dXApO1xuIiwiZnVuY3Rpb24gc2VyaWFsaXplKGRhdGEpIHtcbiBcbiBcdGxldCBwYXJ0cyA9IFtdO1xuIFxuIFx0Zm9yIChsZXQga2V5IGluIGRhdGEpIHtcbiBcbiBcdFx0cGFydHMucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KGRhdGFba2V5XSkpO1xuXG4gXHR9XG4gXG4gXHRyZXR1cm4gcGFydHMuam9pbignJicpO1xufVxuXG5mdW5jdGlvbiBlcnJvcih0ZXh0KSB7XG5cblx0YWxlcnQoJ0FuIGVycm9yIG9jY3VycmVkLiAnICsgdGV4dCk7XG5cbn1cbiBcbmZ1bmN0aW9uIGdldChwYXRoLCBkYXRhLCBjYWxsYmFjaykge1xuXG5cdGlmICh0eXBlb2YgZGF0YSA9PT0gJ2Z1bmN0aW9uJykge1xuXG5cdFx0Y2FsbGJhY2sgPSBkYXRhO1xuXG5cdH1cbiBcbiBcdGxldCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiBcbiBcdGlmICh0eXBlb2YgZGF0YSA9PT0gJ2Z1bmN0aW9uJykge1xuIFxuIFx0XHRjYWxsYmFjayA9IGRhdGE7XG4gXG4gXHRcdGRhdGEgPSB7fTtcblxuIFx0fVxuIFxuIFx0cmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiBcbiBcdFx0aWYgKHJlcS5yZWFkeVN0YXRlID09PSA0KSB7XG5cbiBcdFx0XHRpZiAocmVxLnN0YXR1cyA9PT0gMjAwKSB7XG4gXG5cdCBcdFx0XHRsZXQgcmVzdWx0ID0gdm9pZCAwO1xuXHQgXG5cdCBcdFx0XHR0cnkge1xuXHQgXG5cdCBcdFx0XHRcdHJlc3VsdCA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG5cblx0IFx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHQgXG5cdCBcdFx0XHRcdHJlc3VsdCA9IHJlcS5yZXNwb25zZVRleHQ7XG5cblx0IFx0XHRcdH1cblx0IFxuXHQgXHRcdFx0Y2FsbGJhY2socmVzdWx0KTtcblxuXHQgXHRcdH0gZWxzZSBpZiAocmVxLnN0YXR1cyA+PSA0MDApIHtcblxuXHQgXHRcdFx0ZXJyb3IocmVxLnN0YXR1c1RleHQpO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cbiBcdH07XG5cbiBcdHJlcS5vbmVycm9yID0gKCkgPT4ge1xuXG4gXHRcdGVycm9yKHBhdGgpO1xuXG4gXHR9O1xuIFxuIFx0cmVxLm9wZW4oJ0dFVCcsIHBhdGgpO1xuIFxuIFx0cmVxLnNlbmQoc2VyaWFsaXplKGRhdGEpKTtcblxuIFx0cmV0dXJuIHJlcTtcblxufVxuIFxuZnVuY3Rpb24gcG9zdChwYXRoLCBkYXRhLCBjYWxsYmFjaykge1xuXG5cdGlmICh0eXBlb2YgZGF0YSA9PT0gJ2Z1bmN0aW9uJykge1xuXG5cdFx0Y2FsbGJhY2sgPSBkYXRhO1xuXG5cdH1cbiBcbiBcdGxldCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiBcbiBcdHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gXG4gXHRcdGlmIChyZXEucmVhZHlTdGF0ZSA9PT0gNCkge1xuXG4gXHRcdFx0aWYgKHJlcS5zdGF0dXMgPT09IDIwMCkge1xuIFxuXHQgXHRcdFx0bGV0IGpzb24gPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuXHQgXG5cdCBcdFx0XHRpZiAoanNvbikge1xuXHQgXG5cdCBcdFx0XHRcdGNhbGxiYWNrKGpzb24pO1xuXG5cdCBcdFx0XHR9IGVsc2Uge1xuXHQgXG5cdCBcdFx0XHRcdGNhbGxiYWNrKHJlcS5yZXNwb25zZVRleHQpO1xuXG5cdCBcdFx0XHR9XG5cblx0IFx0XHR9IGVsc2UgaWYgKHJlcS5zdGF0dXMgPj0gNDAwKSB7XG5cblx0IFx0XHRcdGFsZXJ0KHJlcS5zdGF0dXNUZXh0KTtcblxuXHQgXHRcdH1cblxuIFx0XHR9XG5cbiBcdH07XG5cbiBcdHJlcS5vbmVycm9yID0gKCkgPT4ge1xuXG4gXHRcdGVycm9yKHBhdGgpO1xuXG4gXHR9O1xuIFxuIFx0cmVxLm9wZW4oJ1BPU1QnLCBwYXRoKTtcbiBcbiBcdHJlcS5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XG4gXG4gXHRyZXEuc2VuZChzZXJpYWxpemUoZGF0YSkpO1xuXG4gXHRyZXR1cm4gcmVxO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gXHRnZXQ6IGdldCxcbiBcdHBvc3Q6IHBvc3RcbiBcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0KSB7XG4gXG4gICAgbGV0IHRpbWVvdXQsIGFyZ3MsIHRpbWVzdGFtcDtcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcblxuICAgICAgICBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgICAgIHRpbWVzdGFtcCA9IG5ldyBEYXRlKCk7XG5cbiAgICAgICAgbGV0IGxhdGVyID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGxldCBsYXN0ID0gKG5ldyBEYXRlKCkpIC0gdGltZXN0YW1wO1xuXG4gICAgICAgICAgICBpZiAobGFzdCA8IHdhaXQpIHtcbiAgICAgICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZnVuYy5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICghdGltZW91dCkge1xuICAgICAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgICAgICB9XG4gICAgfTtcbn07IiwiaW1wb3J0IG1hbmlsYSBmcm9tICdtbmxhL2NsaWVudCc7XG5cbmxldCBvcGVuRmlsZXMgPSB7fTtcblxuZnVuY3Rpb24gb3BlbihmaWxlKSB7XG5cblx0bWFuaWxhLmNvbXBvbmVudHMuZWRpdG9yLnVwZGF0ZShmaWxlLnBhdGgpO1xuXG5cdG1hbmlsYS5jb21wb25lbnRzLm5hdi51cGRhdGUoZmlsZS5wYXRoLCB0cnVlKTtcblxuXHRtYW5pbGEuY29tcG9uZW50cy50YWJzLnVwZGF0ZShmaWxlLCB0cnVlKTtcblxuXHRvcGVuRmlsZXNbZmlsZS5wYXRoXSA9IGZpbGU7XG5cbn1cblxuZnVuY3Rpb24gY2xvc2UoZmlsZSkge1xuXG5cdGxldCBvcGVuTGlzdDtcblxuXHRtYW5pbGEuY29tcG9uZW50cy5lZGl0b3IuY2xvc2UoZmlsZS5wYXRoKTtcblxuXHRtYW5pbGEuY29tcG9uZW50cy5uYXYudXBkYXRlKGZpbGUucGF0aCwgZmFsc2UpO1xuXHRcblx0bWFuaWxhLmNvbXBvbmVudHMudGFicy51cGRhdGUoZmlsZSwgZmFsc2UpO1xuXG5cdGRlbGV0ZSBvcGVuRmlsZXNbZmlsZS5wYXRoXTtcblxuXHRvcGVuTGlzdCA9IE9iamVjdC5rZXlzKG9wZW5GaWxlcyk7XG5cblx0aWYgKG9wZW5MaXN0Lmxlbmd0aCkge1xuXG5cdFx0b3BlbihvcGVuRmlsZXNbb3Blbkxpc3Rbb3Blbkxpc3QubGVuZ3RoIC0gMV1dKTtcblxuXHR9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuXG5cdG9wZW46IG9wZW4sXG5cdGNsb3NlOiBjbG9zZVxuXG59OyIsImxldCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpLFxuXG5cdGxvYWRlZE1vZGVzID0ge1xuXHRcdHhtbDogdHJ1ZSxcblx0XHRjc3M6IHRydWUsXG5cdFx0amF2YXNjcmlwdDogdHJ1ZSxcblx0XHRodG1sbWl4ZWQ6IHRydWVcblx0fTtcblxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRNb2RlKGV4dGVuc2lvbikge1xuXG5cdHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcblxuXHRcdGxldCBtb2RlID0gbW9kZXNbZXh0ZW5zaW9uXSA/IG1vZGVzW2V4dGVuc2lvbl0ubmFtZSB8fCBtb2Rlc1tleHRlbnNpb25dIDogJ3NoZWxsJztcblxuXHRcdGlmICghbG9hZGVkTW9kZXNbbW9kZV0pIHtcblxuXHRcdFx0bG9hZGVkTW9kZXNbbW9kZV0gPSB0cnVlO1xuXG5cdFx0XHRsZXQgc2NyaXB0ICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuXG5cdFx0XHRzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuXG5cdFx0XHRzY3JpcHQuc3JjICA9IGAvYXNzZXRzL2pzL2Rpc3QvJHttb2RlfS5qc2A7XG5cblx0XHRcdHNjcmlwdC5vbmxvYWQgPSAoKSA9PiB7XG5cblx0XHRcdFx0cmVzb2x2ZShtb2RlKTtcblxuXHRcdFx0fTtcblxuXHRcdFx0Ym9keS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0cmVzb2x2ZShtb2RlKTtcblxuXHRcdH1cblxuXHR9KTtcbn07IiwibGV0IGRyYWdnaW5nO1xuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmVzaXplJykuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZSA9PiB7XG5cblx0ZHJhZ2dpbmcgPSB0cnVlO1xuXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5jbGFzc0xpc3QuYWRkKCdkcmFnZ2luZycpO1xuXG59KTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBlID0+IHtcblxuXHRkcmFnZ2luZyA9IGZhbHNlO1xuXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnZ2luZycpO1xuXG59KTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGUgPT4ge1xuXG5cdGlmIChkcmFnZ2luZykge1xuXG5cdFx0bGV0IHdpZHRoID0gYGNhbGMoMTAwJSAtICR7ZS5jbGllbnRYfXB4KWA7XG5cblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmFja2dyb3VuZCcpLnN0eWxlLmxlZnQgPSBlLmNsaWVudFggKyAncHgnO1xuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2gtY29tcG9uZW50Jykuc3R5bGUud2lkdGggPSBlLmNsaWVudFggLSA1ICsgJ3B4Jztcblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmFja2dyb3VuZCcpLnN0eWxlLndpZHRoID0gd2lkdGg7XG5cdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhYnMtY29tcG9uZW50Jykuc3R5bGUud2lkdGggPSB3aWR0aDtcblxuXHR9XG5cbn0pOyIsImltcG9ydCBtYW5pbGEgZnJvbSAnbW5sYS9jbGllbnQnO1xuaW1wb3J0IGFqYXggZnJvbSAnLi4vc3JjL2FqYXgnO1xuXG5sZXQgYmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmFja2dyb3VuZCcpXG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlKCkge1xuXG5cdGxldCBmaWxlID0gbWFuaWxhLmNvbXBvbmVudHMubmF2LmdldEFjdGl2ZUZpbGUoKTtcblxuXHRpZiAoZmlsZSkge1xuXG5cdFx0YmcuY2xhc3NMaXN0LmFkZCgnYmx1cicpO1xuXG5cdFx0YWpheC5wb3N0KFxuXG5cdFx0XHQnL3NhdmU/ZmlsZT0nICsgZmlsZSxcblxuXHRcdFx0e1xuXHRcdFx0XHRkYXRhOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGV4dCcpLnZhbHVlXG5cdFx0XHR9LFxuXG5cdFx0XHRyZXN1bHQgPT4ge1xuXG5cdFx0XHRcdGlmIChyZXN1bHQuZXJyb3IpIHtcblxuXHRcdFx0XHRcdGFsZXJ0KHJlc3VsdC5lcnJvcik7XG5cdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IocmVzdWx0LmVycm9yKTtcblx0XHRcdFx0XG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRiZy5jbGFzc0xpc3QucmVtb3ZlKCdibHVyJyk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0XHRcblx0XHQpO1xuXG5cdH1cblxufTsiLCJjb25zdCBjb21waWxlID0gcmVxdWlyZSgnLi9jb21waWxlJyk7XG5cbndpbmRvdy5tYW5pbGEgPSB3aW5kb3cubWFuaWxhIHx8IHt9O1xuXG53aW5kb3cubWFuaWxhLmhhbmRsZXJzID0ge307XG5cbmxldCBjb21wb25lbnRzID0ge30sXG5cdFxuXHRzZWxlY3Rpb247XG5cbmZ1bmN0aW9uIGNvbXBvbmVudChjb21wb25lbnROYW1lLCBjb21wb25lbnQpIHtcblxuXHRsZXQgdm0gPSB3aW5kb3cubWFuaWxhLmRhdGFbY29tcG9uZW50TmFtZV0gfHwge30sXG5cblx0XHRlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWNvbXBvbmVudD1cIiR7Y29tcG9uZW50TmFtZX1cIl1gKTtcblxuXHRjb21waWxlKGAjJHtjb21wb25lbnROYW1lfS10ZW1wbGF0ZWApLnRoZW4ocmVuZGVyID0+IHtcblxuXHRcdGZ1bmN0aW9uIHJlc29sdmUoZGF0YSkge1xuXG5cdFx0XHRsZXQgaW5kZXggPSAwO1xuXG5cdFx0XHR3aW5kb3cubWFuaWxhLmhhbmRsZXJzW2NvbXBvbmVudE5hbWVdID0gW107XG5cblx0XHRcdGRhdGEub24gPSAoZXZlbnQsIGhhbmRsZXIsIC4uLmFyZ3MpID0+IHtcblxuXHRcdFx0XHRsZXQgZXZlbnRTdHJpbmc7XG5cblx0XHRcdFx0d2luZG93Lm1hbmlsYS5oYW5kbGVyc1tjb21wb25lbnROYW1lXVtpbmRleF0gPSBlID0+IHtcblxuXHRcdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0YXJncy5wdXNoKGUpO1xuXG5cdFx0XHRcdFx0aGFuZGxlci5hcHBseShkYXRhLCBhcmdzKTtcblxuXHRcdFx0XHRcdGlmIChlLnRhcmdldC50YWdOYW1lICE9PSAnSU5QVVQnICYmIFxuXHRcdFx0XHRcdFx0IGUudGFyZ2V0LnRhZ05hbWUgIT09ICdURVhUQVJFQScpIHtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhKTtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGV2ZW50U3RyaW5nID0gYG9uJHtldmVudH09bWFuaWxhLmhhbmRsZXJzLiR7Y29tcG9uZW50TmFtZX1bJHtpbmRleH1dKGV2ZW50KWA7XG5cblx0XHRcdFx0aW5kZXgrKztcblxuXHRcdFx0XHRyZXR1cm4gZXZlbnRTdHJpbmc7XG5cblx0XHRcdH07XG5cblx0XHRcdGVsLmlubmVySFRNTCA9IHJlbmRlcihkYXRhKTtcblxuXHRcdH1cblxuXHRcdHZtLnJlbmRlciA9ICgpID0+IHtcblxuXHRcdFx0cmVzb2x2ZSh2bSk7XG5cdFx0XHRcblx0XHR9O1xuXG5cdFx0bGV0IG1ldGhvZHMgPSBjb21wb25lbnQodm0pO1xuXG5cdFx0aWYgKG1ldGhvZHMpIHtcblxuXHRcdFx0Y29tcG9uZW50c1tjb21wb25lbnROYW1lXSA9IHt9O1xuXG5cdFx0XHRPYmplY3Qua2V5cyhtZXRob2RzKS5mb3JFYWNoKGtleSA9PiB7XG5cblx0XHRcdFx0Y29tcG9uZW50c1tjb21wb25lbnROYW1lXVtrZXldID0gKC4uLmFyZ3MpID0+IHtcblxuXHRcdFx0XHRcdGxldCByZXN1bHQgPSBtZXRob2RzW2tleV0uYXBwbHkodm0sIGFyZ3MpO1xuXG5cdFx0XHRcdFx0cmVzb2x2ZSh2bSk7XG5cblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXG5cdFx0XHRcdH07XG5cblx0XHRcdH0pO1xuXG5cdFx0fVxuXG5cdFx0cmVzb2x2ZSh2bSk7XG5cblx0fSk7XG5cblx0cmV0dXJuIHdpbmRvdy5tYW5pbGE7XG5cbn1cblxud2luZG93Lm1hbmlsYS5jb21wb25lbnQgPSBjb21wb25lbnQ7XG53aW5kb3cubWFuaWxhLmNvbXBvbmVudHMgPSBjb21wb25lbnRzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0Y29tcG9uZW50OiBjb21wb25lbnQsXG5cdGNvbXBvbmVudHM6IGNvbXBvbmVudHNcbn07XG4iLCJjb25zdCBtYW5pbGEgPSByZXF1aXJlKCdtYW5pbGEvcGFyc2UnKTtcblxubGV0IGNhY2hlID0ge30sXG5cblx0ZXNjYXBlTWFwID0ge1xuICAgICAgICAnPCc6ICcmbHQ7JyxcbiAgICAgICAgJz4nOiAnJmd0OycsXG4gICAgICAgICdcIic6ICcmcXVvdDsnLFxuICAgICAgICAnXFwnJzogJyZhcG9zOydcbiAgICB9O1xuXG5mdW5jdGlvbiBodG1sRXNjYXBlKHN0cikge1xuXG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bJjw+J1wiXS9nLCBjID0+IHtcblxuICAgICAgICByZXR1cm4gZXNjYXBlTWFwW2NdO1xuXG4gICAgfSk7XG5cbn1cblxud2luZG93Lm1hbmlsYSA9IHdpbmRvdy5tYW5pbGEgfHwge307XG5cbndpbmRvdy5tYW5pbGEuZSA9IGZ1bmN0aW9uKHZhbCkge1xuXG4gICAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnID8gaHRtbEVzY2FwZSh2YWwpIDogdmFsO1xuICAgIFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21waWxlKHNlbGVjdG9yKSB7XG5cblx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuXG5cdFx0aWYgKCFzZWxlY3Rvcikge1xuXG5cdFx0XHRyZXNvbHZlKCAoKT0+e30gKTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdGlmIChjYWNoZVtzZWxlY3Rvcl0pIHtcblxuXHRcdFx0XHRyZXNvbHZlKGNhY2hlW3NlbGVjdG9yXSk7XG5cblx0XHRcdH1cblxuXHRcdFx0Y2FjaGVbc2VsZWN0b3JdID0gbWFuaWxhKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpLmlubmVySFRNTCk7XG5cblx0XHRcdHJlc29sdmUoY2FjaGVbc2VsZWN0b3JdKTtcblxuXHRcdH1cblxuXHR9KTtcblxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0ZW1wbGF0ZSkge1xuXG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbignY29udGV4dCcsXG5cbiAgICAgICAgXCJ2YXIgcD1bXTt3aXRoKGNvbnRleHQpe3AucHVzaChgXCIgK1xuICAgICAgIFxuICAgICAgICB0ZW1wbGF0ZVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFwvZywgXCJcXFxcXFxcXFwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoL2AvZywgXCJcXFxcYFwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoLzw6Oig/IVxccyp9Lio/Ojo+KSg/IS4qe1xccyo6Oj4pKC4qPyk6Oj4vZywgXCJgKTt0cnl7cC5wdXNoKCQxKX1jYXRjaChlKXt9cC5wdXNoKGBcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC88Ojo/KD8hXFxzKn0uKj86Oj8+KSg/IS4qe1xccyo6Oj8+KSguKj8pOjo/Pi9nLCBcImApO3RyeXtwLnB1c2gobWFuaWxhLmUoJDEpKX1jYXRjaChlKXt9cC5wdXNoKGBcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC88Ojo/KC4qPyk6Oj8+L2csIFwiYCk7JDFcXG5wLnB1c2goYFwiKVxuXG4gICAgICArIFwiYCk7fXJldHVybiBwLmpvaW4oJycpO1wiKTtcbn07Il19
