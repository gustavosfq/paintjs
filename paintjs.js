function PaintJS(target, width, height) {
	var _target,
	    _canvas,
	    _bgImage,
	    _strokes = [],
	    _currentStrokes = {};

	var _brush = {
		draw: false,
		color: '#000000',
		size: 10
	};

	if (target) {
		_init(target, width, height);
	}

	function _init(target, width, height) {
		_target = document.querySelectorAll(target)[0];
		_canvas = _target.getContext('2d');
		_target.width = width || 0;
		_target.height = height || 0;
		_target.style.cursor = 'crosshair';

		_target.addEventListener('mousedown', function (event) {
			_brush.state = true;
			_currentStrokes = {
				color: _brush.color,
				size: _brush.size,
				points: []
			};
			_strokes.push(_currentStrokes);
			_mouseEvent(event);
		});

		_target.addEventListener('mousemove', function (event) {
			if (_brush.state) {
				_mouseEvent(event);
			}
		});

		_target.addEventListener('mouseup', function (event) {
			_brush.state = false;
			_mouseEvent(event);
		});
	}

	function _mouseEvent(event) {
		_currentStrokes.points.push({
			x: event.clientX - 8,
			y: event.clientY - 8
		});
		_draw();
	}

	function _draw() {
		_canvas.clearRect(0, 0, _target.width, _target.height);
		_canvas.lineCap = 'round';
		for (var i = 0; i < _strokes.length; i++) {
			var s = _strokes[i];
			_canvas.strokeStyle = s.color;
			_canvas.lineWidth = s.size;
			_canvas.beginPath();
			_canvas.moveTo(s.points[0].x, s.points[0].y);
			for (var j = 0; j < s.points.length; j++) {
				var p = s.points[j];
				_canvas.lineTo(p.x, p.y);
			}
			_canvas.stroke();
		}
	}

	return {
		setTarget: function setTarget(target, width, height) {
			if (!_target) {
				_init(target, width, height);
			} else {
				console.error('target is defined!');
			}
		},
		width: function width(_width) {
			return arguments[0] ? function () {
				_target.width = _width;
			}() : _target.width;
		},
		height: function height(_height) {
			return arguments[0] ? function () {
				_target.height = _height;
			}() : _target.height;
		},
		color: function color(_color) {
			return arguments[0] ? function () {
				_brush.color = _color;
			}() : _brush.color;
		},
		size: function size(_size) {
			return arguments[0] ? function () {
				_brush.size = _size;
			}() : _brush.size;
		},
		undo: function undo() {
			_strokes.pop();
			_draw();
		},
		clear: function clear() {
			_strokes = [];
			_draw();
		},
		setBackground: function setBackground(_url) {
			_bgImage = new Image();
			_bgImage.onload = function(element) {
				_target.width = element.path[0].width;
				_target.height = element.path[0].height;
				_target.style.background = 'url(' + _url + ') no-repeat center center';
			}
			_bgImage.src = _url;
		}
	};
}