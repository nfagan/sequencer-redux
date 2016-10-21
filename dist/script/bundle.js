/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(8);

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Helpers = function () {

		return {

			setStyle: function setStyle(el, properties) {
				var keys = Object.keys(properties);
				keys.map(function (key) {
					el.style[key] = properties[key];
				});
			},

			toPixels: function toPixels(number) {
				return number.toString() + 'px';
			},

			randInt: function randInt(min, max) {
				return Math.round(Math.random() * (max - min) + min);
			},

			toRGB: function toRGB(r, g, b) {
				return 'rgb(' + r.toString() + ',' + g.toString() + ',' + b.toString() + ')';
			},

			getElementCenterInViewport: function getElementCenterInViewport(width, height) {
				var w = window.innerWidth,
				    h = window.innerHeight;
				return { top: (h - height) / 2, left: (w - width) / 2 };
			},

			getMatrixRepresentation: function getMatrixRepresentation(rows, cols) {
				var matrix = [];
				for (var i = 0; i < rows; i++) {
					for (var k = 0; k < cols; k++) {
						matrix.push({ row: i, col: k });
					}
				}
				return matrix;
			},

			min: function min(arr) {
				if (arr.length === 0) return;
				if (arr.length === 1) return arr[0];

				var min = arr[0];

				for (var i = 1; i < arr.length; i++) {
					min = Math.min(min, arr[i]);
				}
				return min;
			},

			max: function max(arr) {
				if (arr.length === 0) return;
				if (arr.length === 1) return arr[0];

				var max = arr[0];

				for (var i = 1; i < arr.length; i++) {
					max = Math.max(max, arr[i]);
				}
				return max;
			},

			uniques: function uniques(arr) {
				return arr.filter(function (val, i, self) {
					return self.indexOf(val) === i;
				});
			},

			//	generic template generator to create a row of cells

			createRow: function createRow(nChildren, classNames, innerText, ids) {
				var row = document.createElement('div');
				row.className = 'row';

				if (innerText != null) {
					if (innerText.length !== nChildren) {
						throw new Error('Each child cell must have its own innerHTML innerText');
					}
				}

				for (var i = 0; i < nChildren; i++) {
					var cell = document.createElement('div');

					for (var k = 0; k < classNames.length; k++) {
						cell.classList.add(classNames[k]);
					}

					//	add a randomized background color to the cell

					cell.style.backgroundColor = Helpers.toRGB(20, 200, Helpers.randInt(0, 255));

					//	set inner text if applicable

					if (innerText != null) cell.innerHTML = innerText[i];
					if (ids != null) cell.id = ids[i];

					row.appendChild(cell);
				}

				return row;
			},

			//	add ids to a given row

			addIds: function addIds(row, rowN) {
				var nodes = row.childNodes;
				for (var i = 0; i < nodes.length; i++) {
					nodes[i].id = rowN.toString() + ',' + i.toString();
				}
			},

			createDiv: function createDiv(options) {

				var element = document.createElement('div');

				if (options == null) return element;

				for (var prop in options) {
					element[prop] = options[prop];
				}

				return element;
			}
		};
	}();

	exports.default = Helpers;

/***/ },
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _helpers = __webpack_require__(2);

	var _helpers2 = _interopRequireDefault(_helpers);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function ViewTemplate(wrapper, sections) {

		this.wrapper = wrapper;
		this.container = this.createDiv({ className: 'container' });
		this.sections = sections;
		this.cells = [];

		this.defaults = {
			stickyHeaderClassName: 'sticky-header',
			contentClassName: 'content',
			cellClassName: 'cell',
			rowClassName: 'row'
		};

		this.wrapper.appendChild(this.container);
	}

	ViewTemplate.prototype = {

		constructor: ViewTemplate,

		create: function create() {
			var ctx = this;
			this.sections.map(function (section) {
				ctx.createSection(section);
			});
		},

		addToDocument: function addToDocument() {
			document.body.appendChild(this.wrapper);
		},

		createSection: function createSection(section) {
			var container = this.container,
			    className = section.stickyHeader ? this.defaults.stickyHeaderClassName : this.defaults.contentClassName;

			section.element = this.createDiv({ className: className });

			if (section.className != null) section.element.classList.add(section.className);

			for (var i = 0; i < section.rows; i++) {
				section.rowN = i;
				this.createRow(section);
			}

			this.container.appendChild(section.element);
		},

		createRow: function createRow(section) {
			var row = this.createDiv({ className: this.defaults.rowClassName }),
			    nCells = section.cols,
			    cellClassName = this.defaults.cellClassName;

			for (var i = 0; i < nCells; i++) {
				var cell = this.createDiv({ className: cellClassName });

				row.appendChild(cell);

				this.cells.push({
					element: cell,
					section: section.className
				});

				if (section.ids != null) {
					if (section.ids === 'auto') {
						cell.id = section.rowN.toString() + ',' + i.toString();
						continue;
					}

					cell.id = section.ids[i];
				}

				if (section.innerText != null) {
					cell.innerText = section.innerText[i];
				}
			}

			section.element.appendChild(row);
		},

		createDiv: function createDiv(options) {
			var div = document.createElement('div');

			if (options == null) return div;

			if (options.className != null) div.className = options.className;
			if (options.id != null) div.id = options.id;

			return div;
		},

		center: function center() {
			var container = this.container,
			    containerRect = container.getBoundingClientRect(),
			    position = _helpers2.default.getElementCenterInViewport(containerRect.width, containerRect.height);

			position.top = _helpers2.default.toPixels(position.top), position.left = _helpers2.default.toPixels(position.left);

			_helpers2.default.setStyle(container, position);
		},

		getAllCells: function getAllCells() {
			return this.cellReducer(this.cells);
		},

		getCellsInSection: function getCellsInSection(className) {
			var cells = this.cells.filter(function (cell) {
				return cell.section === className;
			});

			if (cells.length === 0) return -1;

			return this.cellReducer(cells);
		},

		cellReducer: function cellReducer(cells) {
			return cells.reduce(function (store, cell) {
				store.push(cell.element);
				return store;
			}, []);
		}

	};

	exports.default = ViewTemplate;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _viewtemplate = __webpack_require__(7);

	var _viewtemplate2 = _interopRequireDefault(_viewtemplate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var container = document.createElement('div'),
	    sections = [{
		stickyHeader: true,
		className: 'controls',
		rows: 1,
		cols: 4,
		innerText: ['play', 'direc', 'fx', '+'],
		ids: ['play', 'direction', 'effects', 'newSound']
	}, {
		className: 'sounds',
		rows: 6,
		cols: 8,
		ids: 'auto'
	}];

	container.style.height = '100vh';
	container.style.width = '100vw';

	var d = new _viewtemplate2.default(container, sections);

	d.create();
	d.addToDocument();
	d.center();
	console.log(d.getCellsInSection('sounds'));

	// import Interface from './interface.js'

	// let d = new Interface()

	// d.init()
	// d.listen()

/***/ }
/******/ ]);