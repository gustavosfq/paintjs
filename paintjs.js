function PaintJS(target, width, height) {
	var _canvas,
	    _ctx,
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
		_canvas = document.querySelectorAll(target)[0];
		_ctx = _canvas.getContext('2d');
		_canvas.width = width || 0;
		_canvas.height = height || 0;
		_canvas.style.cursor = 'crosshair';

		_canvas.addEventListener('mousedown', function (event) {
			_brush.state = true;
			_currentStrokes = {
				color: _brush.color,
				size: _brush.size,
				points: []
			};
			_strokes.push(_currentStrokes);
			_mouseEvent(event);
		});

		_canvas.addEventListener('mousemove', function (event) {
			if (_brush.state) {
				_mouseEvent(event);
			}
		});

		_canvas.addEventListener('mouseup', function (event) {
			_brush.state = false;
			_mouseEvent(event);
		});
	}

	function _mouseEvent(event) {
		_currentStrokes.points.push({
			x: event.offsetX,
			y: event.offsetY
		});
		_draw();
	}

	function _setBG(url, percentage) {
		_bgImage = new Image();
		_bgImage.crossOrigin = 'Anonymous';
		_bgImage.onload = function (element) {
			element = element.path[0];
			if (percentage) {
				percentage = percentage / 100;
				var aspect = (element.width / element.height)
				//https://math.stackexchange.com/questions/180804/how-to-get-the-aspect-ratio-of-an-image
				if (element.width > element.height) {
					_canvas.width = window.innerWidth * percentage;
					_canvas.height = window.innerWidth * percentage / aspect;
				} else {
					_canvas.height = window.innerHeight * percentage;
					_canvas.width = window.innerHeight * percentage * aspect;
				}
			} else {
				_canvas.width = element.width;
				_canvas.height = element.height;
			}
			_canvas.style.background = 'url(' + url + ') no-repeat center center';
			_canvas.style.backgroundSize = _canvas.width + 'px ' + _canvas.height + 'px';
		};
		_bgImage.src = url;
	}

	function _getImage(callback, options) {
		options.size = options.size || '';
		options.type = options.type || '';
		var size;
		if (options.size === 'original') {
			size = _bgImage;
		} else {
			size = _canvas;
		}
		var c = document.createElement('canvas');
		var ctx = c.getContext('2d');
		var image = new Image();
		image.crossOrigin = 'Anonymous';
		c.width = size.width;
		c.height = size.height;
		ctx.drawImage(_bgImage, 0, 0, size.width, size.height);
		image.onload = function () {
			ctx.drawImage(image, 0, 0, size.width, size.height);
			if (typeof callback === 'function') {
				if (options.type.toLowerCase() === 'blob') {
					c.toBlob(function (blob) {
						callback(blob);
					});
				} else {
					callback(c.toDataURL());
				}
			}
		};
		image.src = _canvas.toDataURL();
	}

	function _draw() {
		_ctx.clearRect(0, 0, _canvas.width, _canvas.height);
		_ctx.lineCap = 'round';
		for (var i = 0; i < _strokes.length; i++) {
			var s = _strokes[i];
			_ctx.strokeStyle = s.color;
			_ctx.lineWidth = s.size;
			_ctx.beginPath();
			_ctx.moveTo(s.points[0].x, s.points[0].y);
			for (var j = 0; j < s.points.length; j++) {
				var p = s.points[j];
				_ctx.lineTo(p.x, p.y);
			}
			_ctx.stroke();
		}
	}

	return {
		setTarget: function setTarget(target, width, height) {
			if (!_canvas) {
				_init(target, width, height);
			} else {
				console.error('target is defined!');
			}
		},
		width: function width(width) {
			return arguments[0] ? function () {
				_canvas.width = width;
			}() : _canvas.width;
		},
		height: function height(height) {
			return arguments[0] ? function () {
				_canvas.height = height;
			}() : _canvas.height;
		},
		color: function color(color) {
			return arguments[0] ? function () {
				_brush.color = color;
			}() : _brush.color;
		},
		size: function size(size) {
			return arguments[0] ? function () {
				_brush.size = size;
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
		setBackground: function setBackground(url, percentage) {
			_setBG(url, percentage);
		},
		getImage: function getImage(callback, options) {
			options = options || {};
			return _getImage(callback, options);
		}
	};
}