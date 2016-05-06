(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _addKeyboardShortcuts = require('./src/addKeyboardShortcuts');

var _nav = require('./components/nav');

var _nav2 = _interopRequireDefault(_nav);

var _editor = require('./components/editor');

var _editor2 = _interopRequireDefault(_editor);

var _tabs = require('./components/tabs');

var _tabs2 = _interopRequireDefault(_tabs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.manila.component({

	nav: _nav2.default,
	editor: _editor2.default,
	tabs: _tabs2.default

});

(0, _addKeyboardShortcuts.addKeyboardShortcuts)();

},{"./components/editor":2,"./components/nav":3,"./components/tabs":4,"./src/addKeyboardShortcuts":5}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _loader = require('../src/loader');

var _loader2 = _interopRequireDefault(_loader);

var _ajax = require('../src/ajax');

var _ajax2 = _interopRequireDefault(_ajax);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var numbers = document.querySelector('.numbers'),
    vm = {
	text: ''
};

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

	return vm;
}

function listen(path) {

	return new Promise(function (resolve) {

		_loader2.default.after('.overlay');

		if (path) {

			_ajax2.default.get('/open?file=' + path, function (data) {

				resolve(update(data.data));

				vm.resetHeight();
			});
		} else {

			resolve(update(''));

			vm.resetHeight();
		}
	});
}

exports.default = {

	init: function init() {

		return new Promise(function (resolve) {

			resolve(vm);
		});
	},

	listen: listen

};

},{"../src/ajax":6,"../src/loader":8}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _fileManager = require('../src/fileManager');

var _fileManager2 = _interopRequireDefault(_fileManager);

var _ajax = require('../src/ajax');

var _ajax2 = _interopRequireDefault(_ajax);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vm = {
	selected: '',
	active: '',
	open: {}
};

vm.clickDir = function (dir) {

	return new Promise(function (resolve) {

		dir.open = !dir.open;

		vm.selected = dir.path;

		if (!dir.children) {

			_ajax2.default.get('/nav?path=' + dir.path, function (data) {

				dir.children = data.dir;

				resolve(vm);
			});
		} else {

			resolve(vm);
		}
	});
};

vm.clickFile = function (file) {

	_fileManager2.default.open(file);
};

function listen(path, open) {

	return new Promise(function (resolve) {

		if (open) {

			vm.open[path] = path;

			vm.active = path;
		} else {

			delete vm.open[path];
		}

		resolve(vm);
	});
}

exports.default = {

	init: function init() {

		return new Promise(function (resolve) {

			vm.dir = JSON.parse(window.manila.json).nav.dir;

			resolve(vm);
		});
	},

	listen: listen

};

},{"../src/ajax":6,"../src/fileManager":7}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _fileManager = require('../src/fileManager');

var _fileManager2 = _interopRequireDefault(_fileManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vm = {

	tabs: {}

};

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

function listen(file, open) {

	return new Promise(function (resolve) {

		if (open) {

			vm.active = file.path;

			vm.tabs[file.path] = file.name;
		} else {

			delete vm.tabs[file.path];
		}

		resolve(vm);
	});
}

exports.default = {

	init: function init() {

		return new Promise(function (resolve) {

			resolve(vm);
		});
	},

	listen: listen

};

},{"../src/fileManager":7}],5:[function(require,module,exports){
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

var _tabs = require('../components/tabs');

var _tabs2 = _interopRequireDefault(_tabs);

var _editor = require('../components/editor');

var _editor2 = _interopRequireDefault(_editor);

var _nav = require('../components/nav');

var _nav2 = _interopRequireDefault(_nav);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var openFiles = {};

function open(file) {

	_editor2.default.notify(file.path);

	_nav2.default.notify(file.path, true);

	_tabs2.default.notify(file, true);

	openFiles[file.path] = file;
}

function close(file) {

	var openList = void 0;

	_editor2.default.notify('');

	_nav2.default.notify(file.path, false);

	_tabs2.default.notify(file, false);

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

},{"../components/editor":2,"../components/nav":3,"../components/tabs":4}],8:[function(require,module,exports){
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

},{"../components/nav":3,"../src/ajax":6}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvYXBwLmpzIiwiYXNzZXRzL2pzL2NvbXBvbmVudHMvZWRpdG9yLmpzIiwiYXNzZXRzL2pzL2NvbXBvbmVudHMvbmF2LmpzIiwiYXNzZXRzL2pzL2NvbXBvbmVudHMvdGFicy5qcyIsImFzc2V0cy9qcy9zcmMvYWRkS2V5Ym9hcmRTaG9ydGN1dHMuanMiLCJhc3NldHMvanMvc3JjL2FqYXguanMiLCJhc3NldHMvanMvc3JjL2ZpbGVNYW5hZ2VyLmpzIiwiYXNzZXRzL2pzL3NyYy9sb2FkZXIuanMiLCJhc3NldHMvanMvc3JjL3NhdmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsT0FBTyxNQUFQLENBQWMsU0FBZCxDQUF3Qjs7QUFFdkIsbUJBRnVCO0FBR3ZCLHlCQUh1QjtBQUl2QixxQkFKdUI7O0NBQXhCOztBQVFBOzs7Ozs7Ozs7QUNiQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFJLFVBQVUsU0FBUyxhQUFULENBQXVCLFVBQXZCLENBQVY7SUFFSCxLQUFLO0FBQ0osT0FBTSxFQUFOO0NBREQ7O0FBSUQsR0FBRyxXQUFILEdBQWlCLGFBQUs7O0FBRXJCLEtBQUksS0FBSyxTQUFTLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBTDtLQUVILGVBRkQsQ0FGcUI7O0FBTXJCLElBQUcsS0FBSCxDQUFTLE1BQVQsR0FBa0IsRUFBbEIsQ0FOcUI7O0FBUXJCLFVBQVMsR0FBRyxZQUFILENBUlk7O0FBVXJCLFNBQVEsS0FBUixDQUFjLE1BQWQsR0FBdUIsRUFBdkIsQ0FWcUI7O0FBWXJCLEtBQUksUUFBUSxZQUFSLEdBQXVCLE1BQXZCLEVBQStCOztBQUVsQyxTQUFPLFFBQVEsWUFBUixHQUF1QixNQUF2QixFQUErQjs7QUFFckMsV0FBUSxTQUFSLElBQXFCLHlC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QUFTLGFBQVQsQ0FBdUIsT0FBdkIsRUFBZ0MsS0FBaEM7R0FMUixFQVFDLGtCQUFVOztBQUVULE9BQUksT0FBTyxLQUFQLEVBQWM7O0FBRWpCLFVBQU0sT0FBTyxLQUFQLENBQU4sQ0FGaUI7O0FBSWpCLFlBQVEsS0FBUixDQUFjLE9BQU8sS0FBUCxDQUFkLENBSmlCO0lBQWxCLE1BTU87O0FBRU4sUUFBSSxXQUFXLFNBQVgsQ0FBcUIsUUFBckIsQ0FBOEIsS0FBOUIsQ0FBSixFQUEwQzs7QUFFekMsU0FBSSxjQUFjLFNBQVMsYUFBVCxDQUF1QixlQUF2QixDQUFkLENBRnFDOztBQUl6QyxnQkFBVyxTQUFYLENBQXFCLE1BQXJCLENBQTRCLEtBQTVCLEVBSnlDOztBQU16QyxTQUFJLFdBQUosRUFBaUI7O0FBRWhCLGtCQUFZLGtCQUFaLENBQStCLFNBQS9CLEdBQTJDLEVBQTNDLENBRmdCOztBQUloQixvQkFBSSxNQUFKLENBQVcsV0FBWCxFQUF3QixJQUF4QixFQUpnQjtNQUFqQixNQU1POztBQUVOLG9CQUFJLFlBQUosR0FGTTtNQU5QO0tBTkQ7O0FBbUJBLE9BQUcsU0FBSCxDQUFhLE1BQWIsQ0FBb0IsTUFBcEIsRUFyQk07SUFOUDtHQUZELENBUkQsQ0FOZTtFQUFoQjtDQVJNIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7IGFkZEtleWJvYXJkU2hvcnRjdXRzIH0gZnJvbSAnLi9zcmMvYWRkS2V5Ym9hcmRTaG9ydGN1dHMnO1xuaW1wb3J0IG5hdiBmcm9tICcuL2NvbXBvbmVudHMvbmF2JztcbmltcG9ydCBlZGl0b3IgZnJvbSAnLi9jb21wb25lbnRzL2VkaXRvcic7XG5pbXBvcnQgdGFicyBmcm9tICcuL2NvbXBvbmVudHMvdGFicyc7XG5cbndpbmRvdy5tYW5pbGEuY29tcG9uZW50KHtcblxuXHRuYXY6IG5hdixcblx0ZWRpdG9yOiBlZGl0b3IsXG5cdHRhYnM6IHRhYnNcblxufSk7XG5cbmFkZEtleWJvYXJkU2hvcnRjdXRzKCk7XG4iLCJpbXBvcnQgbG9hZGVyIGZyb20gJy4uL3NyYy9sb2FkZXInO1xuaW1wb3J0IGFqYXggZnJvbSAnLi4vc3JjL2FqYXgnO1xuXG5sZXQgbnVtYmVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5udW1iZXJzJyksXG5cblx0dm0gPSB7XG5cdFx0dGV4dDogJydcblx0fTtcblxudm0ucmVzZXRIZWlnaHQgPSBlID0+IHtcblxuXHRsZXQgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGV4dCcpLFxuXG5cdFx0aGVpZ2h0O1xuXG5cdGVsLnN0eWxlLmhlaWdodCA9ICcnO1xuXG5cdGhlaWdodCA9IGVsLnNjcm9sbEhlaWdodDtcblxuXHRudW1iZXJzLnN0eWxlLmhlaWdodCA9ICcnO1xuXG5cdGlmIChudW1iZXJzLmNsaWVudEhlaWdodCA8IGhlaWdodCkge1xuXG5cdFx0d2hpbGUgKG51bWJlcnMuY2xpZW50SGVpZ2h0IDwgaGVpZ2h0KSB7XG5cblx0XHRcdG51bWJlcnMuaW5uZXJIVE1MICs9ICc8ZGl2IGNsYXNzPVwibnVtXCI+PC9kaXY+JztcblxuXHRcdH1cblxuXHR9IGVsc2Uge1xuXG5cdFx0bnVtYmVycy5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuXG5cdH1cblxuXHRlbC5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuXG59O1xuXG5mdW5jdGlvbiB1cGRhdGUodGV4dCkge1xuXG5cdHZtLnRleHQgPSB0ZXh0O1xuXG5cdGxvYWRlci5oaWRlKCk7XG5cblx0cmV0dXJuIHZtO1xuXG59XG5cbmZ1bmN0aW9uIGxpc3RlbihwYXRoKSB7XG5cblx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuXG5cdFx0bG9hZGVyLmFmdGVyKCcub3ZlcmxheScpO1xuXG5cdFx0aWYgKHBhdGgpIHtcblxuXHRcdFx0YWpheC5nZXQoJy9vcGVuP2ZpbGU9JyArIHBhdGgsIGRhdGEgPT4ge1xuXG5cdFx0XHRcdHJlc29sdmUodXBkYXRlKGRhdGEuZGF0YSkpO1xuXG5cdFx0XHRcdHZtLnJlc2V0SGVpZ2h0KCk7XG5cblx0XHRcdH0pO1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0cmVzb2x2ZSh1cGRhdGUoJycpKTtcblxuXHRcdFx0dm0ucmVzZXRIZWlnaHQoKTtcblxuXHRcdH1cblxuXHR9KTtcblxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG5cblx0aW5pdDogKCkgPT4ge1xuXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuXG5cdFx0XHRyZXNvbHZlKHZtKTtcblxuXHRcdH0pO1xuXG5cdH0sXG5cblx0bGlzdGVuOiBsaXN0ZW5cblxufTsiLCJpbXBvcnQgZmlsZU1hbmFnZXIgZnJvbSAnLi4vc3JjL2ZpbGVNYW5hZ2VyJztcbmltcG9ydCBhamF4IGZyb20gJy4uL3NyYy9hamF4JztcblxubGV0IHZtID0ge1xuXHRzZWxlY3RlZDogJycsXG5cdGFjdGl2ZTogJycsXG5cdG9wZW46IHt9XG59O1xuXG52bS5jbGlja0RpciA9IGRpciA9PiB7XG5cblx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuXG5cdFx0ZGlyLm9wZW4gPSAhZGlyLm9wZW47XG5cblx0XHR2bS5zZWxlY3RlZCA9IGRpci5wYXRoO1xuXG5cdFx0aWYgKCFkaXIuY2hpbGRyZW4pIHtcblxuXHRcdFx0YWpheC5nZXQoJy9uYXY/cGF0aD0nICsgZGlyLnBhdGgsIGRhdGEgPT4ge1xuXG5cdFx0XHRcdGRpci5jaGlsZHJlbiA9IGRhdGEuZGlyO1xuXG5cdFx0XHRcdHJlc29sdmUodm0pO1xuXG5cdFx0XHR9KTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdHJlc29sdmUodm0pO1xuXG5cdFx0fVxuXG5cdH0pO1xuXG59O1xuXG52bS5jbGlja0ZpbGUgPSBmaWxlID0+IHtcblxuXHRmaWxlTWFuYWdlci5vcGVuKGZpbGUpO1xuXG59O1xuXG5mdW5jdGlvbiBsaXN0ZW4ocGF0aCwgb3Blbikge1xuXG5cdHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcblxuXHRcdGlmIChvcGVuKSB7XG5cblx0XHRcdHZtLm9wZW5bcGF0aF0gPSBwYXRoO1xuXG5cdFx0XHR2bS5hY3RpdmUgPSBwYXRoO1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0ZGVsZXRlIHZtLm9wZW5bcGF0aF07XG5cblx0XHR9XG5cblx0XHRyZXNvbHZlKHZtKTtcblxuXHR9KTtcblxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG5cblx0aW5pdDogKCkgPT4ge1xuXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuXG5cdFx0XHR2bS5kaXIgPSBKU09OLnBhcnNlKHdpbmRvdy5tYW5pbGEuanNvbikubmF2LmRpcjtcblxuXHRcdFx0cmVzb2x2ZSh2bSk7XG5cblx0XHR9KTtcblxuXHR9LFxuXG5cdGxpc3RlbjogbGlzdGVuXG5cbn07IiwiaW1wb3J0IGZpbGVNYW5hZ2VyIGZyb20gJy4uL3NyYy9maWxlTWFuYWdlcic7XG5cbmxldCB2bSA9IHtcblxuXHR0YWJzOiB7fVxuXG59O1xuXG52bS5jbG9zZSA9IHBhdGggPT4ge1xuXG5cdGRlbGV0ZSB2bS50YWJzW3BhdGhdO1xuXG5cdGZpbGVNYW5hZ2VyLmNsb3NlKHtcblx0XHRwYXRoOiBwYXRoLFxuXHRcdG5hbWU6IHZtLnRhYnNbcGF0aF1cblx0fSk7XG5cbn07XG5cbnZtLm9wZW4gPSBwYXRoID0+IHtcblxuXHRmaWxlTWFuYWdlci5vcGVuKHtcblx0XHRwYXRoOiBwYXRoLFxuXHRcdG5hbWU6IHZtLnRhYnNbcGF0aF1cblx0fSk7XG5cbn07XG5cbmZ1bmN0aW9uIGxpc3RlbihmaWxlLCBvcGVuKSB7XG5cblx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuXG5cdFx0aWYgKG9wZW4pIHtcblxuXHRcdFx0dm0uYWN0aXZlID0gZmlsZS5wYXRoO1xuXG5cdFx0XHR2bS50YWJzW2ZpbGUucGF0aF0gPSBmaWxlLm5hbWU7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRkZWxldGUgdm0udGFic1tmaWxlLnBhdGhdO1xuXG5cdFx0fVxuXG5cdFx0cmVzb2x2ZSh2bSk7XG5cblx0fSk7XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuXHRcblx0aW5pdDogKCkgPT4ge1xuXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuXG5cdFx0XHRyZXNvbHZlKHZtKTtcblxuXHRcdH0pO1xuXG5cdH0sXG5cblx0bGlzdGVuOiBsaXN0ZW5cblxufTsiLCJpbXBvcnQgeyBzYXZlIH0gZnJvbSAnLi9zYXZlJztcblxuY29uc3Qga2V5bWFwID0ge1xuXG5cdFx0OTE6IHtcblx0XHRcdGNhbGxiYWNrOiBzYXZlLFxuXHRcdFx0cGFpcjogODMgXG5cdFx0fSxcblxuXHRcdDgzOiB7XG5cdFx0XHRjYWxsYmFjazogc2F2ZSxcblx0XHRcdHBhaXI6IDkxXG5cdFx0fVxuXG5cdH07XG5cbmxldCBwcmVzc2VkID0geyB9O1xuXG5cbmZ1bmN0aW9uIGtleWRvd24oZSkge1xuXG5cdGxldCBjb2RlID0gZS5rZXlDb2RlIHx8IGUud2hpY2gsXG5cblx0XHRrZXkgPSBrZXltYXBbY29kZV07XG5cblx0aWYgKGtleSkge1xuXG5cdFx0cHJlc3NlZFtjb2RlXSA9IHRydWU7XG5cblx0XHRpZiAocHJlc3NlZFtrZXkucGFpcl0pIHtcblxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRrZXkuY2FsbGJhY2soKTtcblxuXHRcdFx0ZGVsZXRlIHByZXNzZWRbY29kZV07XG5cdFx0XHRkZWxldGUgcHJlc3NlZFtrZXkucGFpcl07XG5cblx0XHR9XG5cblx0fVxuXG59XG5cblxuZnVuY3Rpb24ga2V5dXAoZSkge1xuXG5cdGRlbGV0ZSBwcmVzc2VkW2Uua2V5Q29kZSB8fCBlLndoaWNoXTtcblxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRLZXlib2FyZFNob3J0Y3V0cygpIHtcblx0XG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBrZXlkb3duKTtcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBrZXl1cCk7XG5cbn07XG4iLCJmdW5jdGlvbiBzZXJpYWxpemUoZGF0YSkge1xuIFxuIFx0bGV0IHBhcnRzID0gW107XG4gXG4gXHRmb3IgKGxldCBrZXkgaW4gZGF0YSkge1xuIFxuIFx0XHRwYXJ0cy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQoZGF0YVtrZXldKSk7XG5cbiBcdH1cbiBcbiBcdHJldHVybiBwYXJ0cy5qb2luKCcmJyk7XG59XG4gXG5mdW5jdGlvbiBnZXQocGF0aCwgZGF0YSwgY2FsbGJhY2spIHtcbiBcbiBcdGxldCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiBcbiBcdGlmICh0eXBlb2YgZGF0YSA9PT0gJ2Z1bmN0aW9uJykge1xuIFxuIFx0XHRjYWxsYmFjayA9IGRhdGE7XG4gXG4gXHRcdGRhdGEgPSB7fTtcblxuIFx0fVxuIFxuIFx0cmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiBcbiBcdFx0aWYgKHJlcS5yZWFkeVN0YXRlID09IDQgJiYgcmVxLnN0YXR1cyA9PSAyMDApIHtcbiBcbiBcdFx0XHRsZXQgcmVzdWx0ID0gdm9pZCAwO1xuIFxuIFx0XHRcdHRyeSB7XG4gXG4gXHRcdFx0XHRyZXN1bHQgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuXG4gXHRcdFx0fSBjYXRjaCAoZXJyKSB7XG4gXG4gXHRcdFx0XHRyZXN1bHQgPSByZXEucmVzcG9uc2VUZXh0O1xuXG4gXHRcdFx0fVxuIFxuIFx0XHRcdGNhbGxiYWNrKHJlc3VsdCk7XG4gXHRcdH1cblxuIFx0fTtcbiBcbiBcdHJlcS5vcGVuKCdHRVQnLCBwYXRoKTtcbiBcbiBcdHJlcS5zZW5kKHNlcmlhbGl6ZShkYXRhKSk7XG5cbn1cbiBcbmZ1bmN0aW9uIHBvc3QocGF0aCwgZGF0YSwgY2FsbGJhY2spIHtcbiBcbiBcdGxldCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiBcbiBcdHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gXG4gXHRcdGlmIChyZXEucmVhZHlTdGF0ZSA9PSA0ICYmIHJlcS5zdGF0dXMgPT0gMjAwKSB7XG4gXG4gXHRcdFx0bGV0IGpzb24gPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuIFxuIFx0XHRcdGlmIChqc29uKSB7XG4gXG4gXHRcdFx0XHRjYWxsYmFjayhqc29uKTtcblxuIFx0XHRcdH0gZWxzZSB7XG4gXG4gXHRcdFx0XHRjYWxsYmFjayhyZXEucmVzcG9uc2VUZXh0KTtcblxuIFx0XHRcdH1cblxuIFx0XHR9XG5cbiBcdH07XG4gXG4gXHRyZXEub3BlbignUE9TVCcsIHBhdGgpO1xuIFxuIFx0cmVxLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcbiBcbiBcdHJlcS5zZW5kKHNlcmlhbGl6ZShkYXRhKSk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiBcdGdldDogZ2V0LFxuIFx0cG9zdDogcG9zdFxuIFxufTtcbiIsImltcG9ydCB0YWJzIGZyb20gJy4uL2NvbXBvbmVudHMvdGFicyc7XG5pbXBvcnQgZWRpdG9yIGZyb20gJy4uL2NvbXBvbmVudHMvZWRpdG9yJztcbmltcG9ydCBuYXYgZnJvbSAnLi4vY29tcG9uZW50cy9uYXYnO1xuXG5sZXQgb3BlbkZpbGVzID0ge307XG5cbmZ1bmN0aW9uIG9wZW4oZmlsZSkge1xuXG5cdGVkaXRvci5ub3RpZnkoZmlsZS5wYXRoKTtcblxuXHRuYXYubm90aWZ5KGZpbGUucGF0aCwgdHJ1ZSk7XG5cblx0dGFicy5ub3RpZnkoZmlsZSwgdHJ1ZSk7XG5cblx0b3BlbkZpbGVzW2ZpbGUucGF0aF0gPSBmaWxlO1xuXG59XG5cbmZ1bmN0aW9uIGNsb3NlKGZpbGUpIHtcblxuXHRsZXQgb3Blbkxpc3Q7XG5cblx0ZWRpdG9yLm5vdGlmeSgnJyk7XG5cblx0bmF2Lm5vdGlmeShmaWxlLnBhdGgsIGZhbHNlKTtcblxuXHR0YWJzLm5vdGlmeShmaWxlLCBmYWxzZSk7XG5cblx0ZGVsZXRlIG9wZW5GaWxlc1tmaWxlLnBhdGhdO1xuXG5cdG9wZW5MaXN0ID0gT2JqZWN0LmtleXMob3BlbkZpbGVzKTtcblxuXHRpZiAob3Blbkxpc3QubGVuZ3RoKSB7XG5cblx0XHRvcGVuKG9wZW5GaWxlc1tvcGVuTGlzdFtvcGVuTGlzdC5sZW5ndGggLSAxXV0pO1xuXG5cdH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG5cblx0b3Blbjogb3Blbixcblx0Y2xvc2U6IGNsb3NlXG5cbn07IiwibGV0IGxvYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsb2FkZXItdGVtcGxhdGUnKS5pbm5lckhUTUw7XG5cbmZ1bmN0aW9uIGZhZGVJbigpIHtcblxuXHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcblx0XHRcblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyJykuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpO1xuXG5cdH0pO1xuXG59XG5cbmZ1bmN0aW9uIHJlcGxhY2UoaHRtbCkge1xuXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXInKS5vdXRlckhUTUwgPSBodG1sO1xuXG59XG5cbmZ1bmN0aW9uIGFmdGVyKGVsKSB7XG5cblx0aWYgKHR5cGVvZiBlbCA9PT0gJ3N0cmluZycpIHtcblxuXHRcdGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbCk7XG5cblx0fVxuXG5cdGVsLm91dGVySFRNTCArPSBsb2FkZXI7XG5cblx0ZmFkZUluKCk7XG5cbn1cblxuXG5mdW5jdGlvbiBoaWRlKCkge1xuXG5cdGxldCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXInKTtcblxuXHRpZiAoZWwpIHtcblxuXHRcdGVsLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKTtcblxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cblx0XHRcdGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xuXG5cdFx0fSwgNjAwKTtcblxuXHR9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuXHRcblx0cmVwbGFjZTogcmVwbGFjZSxcblx0YWZ0ZXI6IGFmdGVyLFxuXHRoaWRlOiBoaWRlXG5cbn07IiwiaW1wb3J0IG5hdiBmcm9tICcuLi9jb21wb25lbnRzL25hdic7XG5pbXBvcnQgYWpheCBmcm9tICcuLi9zcmMvYWpheCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlKCkge1xuXG5cdGxldCBiZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5iYWNrZ3JvdW5kJyksXG5cblx0XHRhY3RpdmVGaWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZpbGUuYWN0aXZlJyksXG5cblx0XHRwYXRoO1xuXG5cdGlmIChhY3RpdmVGaWxlKSB7XG5cblx0XHRiZy5jbGFzc0xpc3QuYWRkKCdibHVyJyk7XG5cblx0XHRwYXRoID0gYWN0aXZlRmlsZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGF0aCcpO1xuXG5cdFx0YWpheC5wb3N0KFxuXG5cdFx0XHQnL3NhdmU/ZmlsZT0nICsgcGF0aCxcblxuXHRcdFx0e1xuXHRcdFx0XHRkYXRhOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGV4dCcpLnZhbHVlXG5cdFx0XHR9LFxuXG5cdFx0XHRyZXN1bHQgPT4ge1xuXG5cdFx0XHRcdGlmIChyZXN1bHQuZXJyb3IpIHtcblxuXHRcdFx0XHRcdGFsZXJ0KHJlc3VsdC5lcnJvcik7XG5cdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IocmVzdWx0LmVycm9yKTtcblx0XHRcdFx0XG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRpZiAoYWN0aXZlRmlsZS5jbGFzc0xpc3QuY29udGFpbnMoJ25ldycpKSB7XG5cblx0XHRcdFx0XHRcdGxldCBzZWxlY3RlZERpciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kaXIuc2VsZWN0ZWQnKTtcblxuXHRcdFx0XHRcdFx0YWN0aXZlRmlsZS5jbGFzc0xpc3QucmVtb3ZlKCduZXcnKTtcblxuXHRcdFx0XHRcdFx0aWYgKHNlbGVjdGVkRGlyKSB7XG5cblx0XHRcdFx0XHRcdFx0c2VsZWN0ZWREaXIubmV4dEVsZW1lbnRTaWJsaW5nLm91dGVySFRNTCA9ICcnO1xuXG5cdFx0XHRcdFx0XHRcdG5hdi5ub3RpZnkoc2VsZWN0ZWREaXIsIHBhdGgpO1xuXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0XHRcdG5hdi5yZWluaXRpYWxpemUoKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGJnLmNsYXNzTGlzdC5yZW1vdmUoJ2JsdXInKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHRcdFxuXHRcdCk7XG5cblx0fVxuXG59OyJdfQ==
