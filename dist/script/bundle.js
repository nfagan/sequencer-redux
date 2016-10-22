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

	var _interface = __webpack_require__(1);

	var _interface2 = _interopRequireDefault(_interface);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var d = new _interface2.default();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _helpers = __webpack_require__(2);

	var _helpers2 = _interopRequireDefault(_helpers);

	var _effects = __webpack_require__(3);

	var _effects2 = _interopRequireDefault(_effects);

	var _grid = __webpack_require__(6);

	var _grid2 = _interopRequireDefault(_grid);

	var _soundbites = __webpack_require__(8);

	var _soundbites2 = _interopRequireDefault(_soundbites);

	var _soundselector = __webpack_require__(7);

	var _soundselector2 = _interopRequireDefault(_soundselector);

	var _audiomanager = __webpack_require__(9);

	var _audiomanager2 = _interopRequireDefault(_audiomanager);

	var _sequencer = __webpack_require__(10);

	var _sequencer2 = _interopRequireDefault(_sequencer);

	var _audiotemplates = __webpack_require__(11);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var interact = __webpack_require__(5);

	/*
		Inteface interfaces between all views -- grid view, 
		effects view, and sound selection view
	*/

	function Interface() {

		//	establish containers in which to insert the views

		var gridContainer = _helpers2.default.createDiv({ className: 'grid__container' }),
		    effectsContainer = _helpers2.default.createDiv({ className: 'effects__container' }),
		    soundSelectorContainer = _helpers2.default.createDiv({ className: 'soundSelector__container' });

		//	get the audio templates

		var filenames = _audiotemplates.templates.map(function (temp) {
			return temp.filename;
		});

		//	create the views
		var audioManager = new _audiomanager2.default(filenames),
		    effects = new _effects2.default(effectsContainer),
		    grid = new _grid2.default(gridContainer),
		    soundBites = new _soundbites2.default(audioManager.getDefaultAudioParams(), _audiotemplates.templates),
		    soundSelector = new _soundselector2.default(soundSelectorContainer, soundBites),
		    sequencer = new _sequencer2.default(soundBites, audioManager, grid);

		this.audioManager = audioManager;
		this.sequencer = sequencer;
		this.soundBites = soundBites;
		this.effects = effects;
		this.grid = grid;
		this.soundSelector = soundSelector;

		//	show the grid only

		this.changeState('GRID');

		//	configure events

		this.listen();

		//	start the looping

		this.audioManager.loadSounds(audioManager.filenames).then(function () {
			sequencer.loop();
		});
	}

	Interface.prototype = {

		constructor: Interface,

		listen: function listen() {
			this.handleEffectsButton();
			this.handleEffectsCloseButton();
			this.handleSoundSelectorButton();
			this.handleSoundSelectorCloseButton();
			this.handleSoundSelectorSoundBites();
			this.handleGridSoundBites();
		},

		changeState: function changeState(state, target) {
			var effects = this.effects,
			    soundSelector = this.soundSelector,
			    grid = this.grid;

			if (state === 'GRID') {
				effects.hide();
				soundSelector.hide();
				grid.show();

				this.state = state;
			}

			if (state === 'SELECT_SOUNDS') {
				effects.hide();
				grid.hide();
				soundSelector.show();

				this.state = state;
			}

			if (state === 'AWAITING_EFFECTS') {
				this.state = state;
			}

			if (state === 'EFFECTS') {
				grid.hide();
				soundSelector.hide();
				effects.show(target);

				this.state = state;
			}

			console.log('current state is', this.state);
		},

		//	effect control handlers

		handleEffectsButton: function handleEffectsButton() {
			var effectsButton = this.grid.controls.effects,
			    ctx = this;

			effectsButton.addEventListener('click', function () {
				ctx.changeState('AWAITING_EFFECTS');
			});
		},

		handleEffectsCloseButton: function handleEffectsCloseButton() {
			var closeButton = this.effects.controls.close,
			    ctx = this;

			closeButton.addEventListener('click', function () {
				ctx.changeState('GRID');
			});
		},

		//	sound selector control handlers

		handleSoundSelectorButton: function handleSoundSelectorButton() {
			var soundSelectorButton = this.grid.controls.newSound,
			    ctx = this;

			newSound.addEventListener('click', function () {
				ctx.changeState('SELECT_SOUNDS');
			});
		},

		handleSoundSelectorCloseButton: function handleSoundSelectorCloseButton() {
			var closeButton = this.soundSelector.controls.close,
			    ctx = this;

			closeButton.addEventListener('click', function () {
				ctx.changeState('GRID');
			});
		},

		//	sound bites handling while in SoundSelection

		handleSoundSelectorSoundBites: function handleSoundSelectorSoundBites() {
			var ctx = this,
			    grid = this.grid,
			    audioManager = this.audioManager,
			    soundBites = this.soundBites,
			    oneBite = soundBites.original[0],
			    biteClass = '.' + oneBite.classNames.dockedInSoundSelector;

			//	create a new bite on double tap

			interact(biteClass).on('down', function (event) {

				//	to make web audio work properly in iOS

				audioManager.playDummySound();

				//	identify which kind of soundbite to create

				var target = soundBites.getBiteById(event.target.id),
				    template = target.template,
				    container = grid.container;

				//	change relevant bits of the template

				template.type = 'inGrid';
				template.container = container;
				template.audioParams = ctx.audioManager.getDefaultAudioParams();
				template.makeCenter = true; //	center the element

				//	show the grid

				ctx.changeState('GRID');

				//	create the soundbite and add it to the document

				soundBites.createBite(template);
			});
		},

		handleGridSoundBites: function handleGridSoundBites() {
			var soundBites = this.soundBites,
			    grid = this.grid,
			    oneBite = soundBites.original[0],
			    biteClass = '.' + oneBite.classNames.inGrid,
			    ctx = this;

			//	handle drag and drop on the grid -- release

			function elementRelease(event) {
				var target = soundBites.getBiteById(event.target.id);
				grid.dock(target);
			}

			//	handle pickup

			function elementPickup(event) {
				var target = soundBites.getBiteById(event.target.id);
				target.beganWithMouseDown = true;
				grid.undock(target, event);
			}

			//	handle effect selection

			function effectSelection(event) {
				var target = soundBites.getBiteById(event.target.id);
				ctx.changeState('EFFECTS', target);
			}

			//	add the interactivity

			interact(biteClass)

			// make draggable

			.draggable({ enabled: true, onmove: _helpers2.default.dragMoveListener })

			//	determine whether to pick up the element or 
			//	show the effects view

			.on('down', function (event) {
				var state = ctx.state;

				if (state === 'GRID') {
					elementPickup(event);
				}

				if (state === 'AWAITING_EFFECTS') {
					effectSelection(event);
				}
			})

			//	release element on mouseup / touchup

			.on('up', elementRelease)

			//	show the effects view if double clicking an element

			.on('doubletap', function (event) {
				effectSelection(event);
			});
		}

	};

	exports.default = Interface;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Helpers = function () {

		return {

			randId: function randId(append) {
				var id = Math.random().toString(36).substring(7);

				if (append == null) return id;

				return append + id;
			},

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
			},

			dragMoveListener: function dragMoveListener(e) {
				var target = e.target,
				    x = (parseFloat(target.getAttribute('data-x')) || 0) + e.dx,
				    y = (parseFloat(target.getAttribute('data-y')) || 0) + e.dy;

				target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

				target.setAttribute('data-x', x);
				target.setAttribute('data-y', y);
			}
		};
	}();

	exports.default = Helpers;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _helpers = __webpack_require__(2);

	var _helpers2 = _interopRequireDefault(_helpers);

	var _viewtemplate = __webpack_require__(4);

	var _viewtemplate2 = _interopRequireDefault(_viewtemplate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var interact = __webpack_require__(5);

	function Effects(container) {

		this.container = container;
		this.view = null;
		this.controls = {};
		this.effects = {
			gain: {},
			filter: {},
			pitch: {},
			attack: {},
			region: {}
		};
		this.soundBite = null;

		this.create();
		this.slider();
	}

	Effects.prototype = {

		constructor: Effects,

		create: function create() {

			//	create the basic grid from the ViewTemplate

			var view = new _viewtemplate2.default(this.container, [{
				stickyHeader: true,
				className: 'effects__header',
				cellClassName: 'effects__cell__header',
				innerText: ['close', 'play'],
				ids: ['effects__close', 'effects__playSound'],
				rows: 1,
				cols: 2
			}, {
				className: 'effects__effects',
				cellClassName: 'effects__cell',
				cellClassPattern: ['', 'effects__cell__effect'],
				rowClassName: 'effects__row',
				rows: 0,
				cols: 2,
				ids: []
			}], { name: 'effects' });

			view.addToDocument();
			view.keepCentered();
			view.hide();

			//	keep a reference to the control elements

			this.controls.close = view.getCellById('effects__close');

			//	add the view module

			this.view = view;

			//	create the effects

			this.createEffects();
		},

		createEffect: function createEffect(id) {
			var view = this.view,
			    section = view.getSectionByClassName('effects__effects')[0],
			    canvas = document.createElement('canvas');

			canvas.className = 'effects__canvas';

			section.ids = ['', id];
			section.innerText = [id, ''];

			view.createRow(section);
			view.getCellById(id).appendChild(canvas);

			this.effects[id].canvas = canvas;
		},

		createEffects: function createEffects() {
			var effects = this.effects,
			    ctx = this;

			Object.keys(effects).map(function (key) {
				ctx.createEffect(key);
			});
		},

		//	get the percentage of the canvas width that the user
		//	clicked / dragged

		getXPercent: function getXPercent(event) {
			var canvas = event.target,
			    canvasLeft = canvas.getBoundingClientRect().left,
			    canvasRight = canvas.getBoundingClientRect().right,
			    clientX = event.clientX,
			    percentage = (clientX - canvasLeft) / (canvasRight - canvasLeft);

			return percentage;
		},

		drawRectangle: function drawRectangle(canvas, percent) {
			var ctx = canvas.getContext('2d'),
			    width = canvas.width * percent;

			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillRect(0, 0, width, canvas.height);
		},

		//	set up canvas drag event listeners

		slider: function slider() {
			var ctx = this;

			function assignValues(event) {
				var type = event.target.parentNode.id,
				    percent = ctx.getXPercent(event),
				    soundBite = ctx.soundBite;

				soundBite.audioParams[type].value = percent;
			}

			function draw(event) {
				ctx.drawRectangle(event.target, ctx.getXPercent(event));
			}

			interact('.effects__canvas').draggable({
				restrict: {
					restriction: 'self'
				},
				max: Infinity
			}).on('dragmove', function (event) {
				assignValues(event);
				draw(event);
			}).on('click', function (event) {
				assignValues(event);
				draw(event);
			});
		},

		show: function show(soundBite) {
			this.view.show();
			this.soundBite = soundBite;
			this.slider();

			var effectNames = Object.keys(this.effects);

			for (var i = 0; i < effectNames.length; i++) {
				var currentValue = soundBite.audioParams[effectNames[i]].value,
				    currentCanvas = this.effects[effectNames[i]].canvas;

				this.drawRectangle(currentCanvas, currentValue);
			}
		},

		hide: function hide() {
			this.view.hide();
		}

	};

	exports.default = Effects;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _helpers = __webpack_require__(2);

	var _helpers2 = _interopRequireDefault(_helpers);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function ViewTemplate(wrapper, sections, options) {

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

		if (options != null) {
			if (options.name != null) this.container.classList.add(options.name);
		}

		this.wrapper.appendChild(this.container);
		this.create();
	}

	ViewTemplate.prototype = {

		constructor: ViewTemplate,

		create: function create() {
			var ctx = this;
			this.sections.map(function (section) {
				ctx.createSection(section);
			});
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

			if (section.rowClassName != null) {
				row.classList.add(section.rowClassName);
			}

			for (var i = 0; i < nCells; i++) {
				var appliedClassName = cellClassName;

				//	if specifying a class for all cells

				if (section.cellClassName != null) {
					appliedClassName = cellClassName + ' ' + section.cellClassName;
				}

				//	if specifying a class for cell[0], cells[1], ... 

				if (section.cellClassPattern != null) {
					appliedClassName = appliedClassName + ' ' + section.cellClassPattern[i];
				}

				var cell = this.createDiv({ className: appliedClassName });

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
					cell.innerHTML = section.innerText[i];
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

		addToDocument: function addToDocument() {
			document.body.appendChild(this.wrapper);
		},

		//	keep the container centered

		center: function center() {
			var container = this.container,
			    containerRect = container.getBoundingClientRect(),
			    position = _helpers2.default.getElementCenterInViewport(containerRect.width, containerRect.height);

			position.top = _helpers2.default.toPixels(position.top), position.left = _helpers2.default.toPixels(position.left);

			_helpers2.default.setStyle(container, position);
		},

		keepCentered: function keepCentered() {
			this.center();
			window.addEventListener('resize', this.center.bind(this));
		},

		//	get elements

		getSectionByClassName: function getSectionByClassName(className) {
			var sections = this.sections;

			return sections.filter(function (section) {
				return section.className === className;
			});
		},

		getCellById: function getCellById(id) {
			var cells = this.getAllCells();

			return cells.filter(function (cell) {
				return cell.id === id;
			})[0];
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
		},

		hide: function hide() {
			this.wrapper.classList.add('hidden');
		},

		show: function show() {
			this.wrapper.classList.remove('hidden');
			this.center();
		}

	};

	exports.default = ViewTemplate;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * interact.js v1.2.6
	 *
	 * Copyright (c) 2012-2015 Taye Adeyemi <dev@taye.me>
	 * Open source under the MIT License.
	 * https://raw.github.com/taye/interact.js/master/LICENSE
	 */
	(function (realWindow) {
	    'use strict';

	    // return early if there's no window to work with (eg. Node.js)
	    if (!realWindow) { return; }

	    var // get wrapped window if using Shadow DOM polyfill
	        window = (function () {
	            // create a TextNode
	            var el = realWindow.document.createTextNode('');

	            // check if it's wrapped by a polyfill
	            if (el.ownerDocument !== realWindow.document
	                && typeof realWindow.wrap === 'function'
	                && realWindow.wrap(el) === el) {
	                // return wrapped window
	                return realWindow.wrap(realWindow);
	            }

	            // no Shadow DOM polyfil or native implementation
	            return realWindow;
	        }()),

	        document           = window.document,
	        DocumentFragment   = window.DocumentFragment   || blank,
	        SVGElement         = window.SVGElement         || blank,
	        SVGSVGElement      = window.SVGSVGElement      || blank,
	        SVGElementInstance = window.SVGElementInstance || blank,
	        HTMLElement        = window.HTMLElement        || window.Element,

	        PointerEvent = (window.PointerEvent || window.MSPointerEvent),
	        pEventTypes,

	        hypot = Math.hypot || function (x, y) { return Math.sqrt(x * x + y * y); },

	        tmpXY = {},     // reduce object creation in getXY()

	        documents       = [],   // all documents being listened to

	        interactables   = [],   // all set interactables
	        interactions    = [],   // all interactions

	        dynamicDrop     = false,

	        // {
	        //      type: {
	        //          selectors: ['selector', ...],
	        //          contexts : [document, ...],
	        //          listeners: [[listener, useCapture], ...]
	        //      }
	        //  }
	        delegatedEvents = {},

	        defaultOptions = {
	            base: {
	                accept        : null,
	                actionChecker : null,
	                styleCursor   : true,
	                preventDefault: 'auto',
	                origin        : { x: 0, y: 0 },
	                deltaSource   : 'page',
	                allowFrom     : null,
	                ignoreFrom    : null,
	                _context      : document,
	                dropChecker   : null
	            },

	            drag: {
	                enabled: false,
	                manualStart: true,
	                max: Infinity,
	                maxPerElement: 1,

	                snap: null,
	                restrict: null,
	                inertia: null,
	                autoScroll: null,

	                axis: 'xy'
	            },

	            drop: {
	                enabled: false,
	                accept: null,
	                overlap: 'pointer'
	            },

	            resize: {
	                enabled: false,
	                manualStart: false,
	                max: Infinity,
	                maxPerElement: 1,

	                snap: null,
	                restrict: null,
	                inertia: null,
	                autoScroll: null,

	                square: false,
	                preserveAspectRatio: false,
	                axis: 'xy',

	                // use default margin
	                margin: NaN,

	                // object with props left, right, top, bottom which are
	                // true/false values to resize when the pointer is over that edge,
	                // CSS selectors to match the handles for each direction
	                // or the Elements for each handle
	                edges: null,

	                // a value of 'none' will limit the resize rect to a minimum of 0x0
	                // 'negate' will alow the rect to have negative width/height
	                // 'reposition' will keep the width/height positive by swapping
	                // the top and bottom edges and/or swapping the left and right edges
	                invert: 'none'
	            },

	            gesture: {
	                manualStart: false,
	                enabled: false,
	                max: Infinity,
	                maxPerElement: 1,

	                restrict: null
	            },

	            perAction: {
	                manualStart: false,
	                max: Infinity,
	                maxPerElement: 1,

	                snap: {
	                    enabled     : false,
	                    endOnly     : false,
	                    range       : Infinity,
	                    targets     : null,
	                    offsets     : null,

	                    relativePoints: null
	                },

	                restrict: {
	                    enabled: false,
	                    endOnly: false
	                },

	                autoScroll: {
	                    enabled     : false,
	                    container   : null,     // the item that is scrolled (Window or HTMLElement)
	                    margin      : 60,
	                    speed       : 300       // the scroll speed in pixels per second
	                },

	                inertia: {
	                    enabled          : false,
	                    resistance       : 10,    // the lambda in exponential decay
	                    minSpeed         : 100,   // target speed must be above this for inertia to start
	                    endSpeed         : 10,    // the speed at which inertia is slow enough to stop
	                    allowResume      : true,  // allow resuming an action in inertia phase
	                    zeroResumeDelta  : true,  // if an action is resumed after launch, set dx/dy to 0
	                    smoothEndDuration: 300    // animate to snap/restrict endOnly if there's no inertia
	                }
	            },

	            _holdDuration: 600
	        },

	        // Things related to autoScroll
	        autoScroll = {
	            interaction: null,
	            i: null,    // the handle returned by window.setInterval
	            x: 0, y: 0, // Direction each pulse is to scroll in

	            // scroll the window by the values in scroll.x/y
	            scroll: function () {
	                var options = autoScroll.interaction.target.options[autoScroll.interaction.prepared.name].autoScroll,
	                    container = options.container || getWindow(autoScroll.interaction.element),
	                    now = new Date().getTime(),
	                    // change in time in seconds
	                    dtx = (now - autoScroll.prevTimeX) / 1000,
	                    dty = (now - autoScroll.prevTimeY) / 1000,
	                    vx, vy, sx, sy;

	                // displacement
	                if (options.velocity) {
	                  vx = options.velocity.x;
	                  vy = options.velocity.y;
	                }
	                else {
	                  vx = vy = options.speed
	                }
	 
	                sx = vx * dtx;
	                sy = vy * dty;

	                if (sx >= 1 || sy >= 1) {
	                    if (isWindow(container)) {
	                        container.scrollBy(autoScroll.x * sx, autoScroll.y * sy);
	                    }
	                    else if (container) {
	                        container.scrollLeft += autoScroll.x * sx;
	                        container.scrollTop  += autoScroll.y * sy;
	                    }

	                    if (sx >=1) autoScroll.prevTimeX = now;
	                    if (sy >= 1) autoScroll.prevTimeY = now;
	                }

	                if (autoScroll.isScrolling) {
	                    cancelFrame(autoScroll.i);
	                    autoScroll.i = reqFrame(autoScroll.scroll);
	                }
	            },

	            isScrolling: false,
	            prevTimeX: 0,
	            prevTimeY: 0,

	            start: function (interaction) {
	                autoScroll.isScrolling = true;
	                cancelFrame(autoScroll.i);

	                autoScroll.interaction = interaction;
	                autoScroll.prevTimeX = new Date().getTime();
	                autoScroll.prevTimeY = new Date().getTime();
	                autoScroll.i = reqFrame(autoScroll.scroll);
	            },

	            stop: function () {
	                autoScroll.isScrolling = false;
	                cancelFrame(autoScroll.i);
	            }
	        },

	        // Does the browser support touch input?
	        supportsTouch = (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch),

	        // Does the browser support PointerEvents
	        supportsPointerEvent = !!PointerEvent,

	        // Less Precision with touch input
	        margin = supportsTouch || supportsPointerEvent? 20: 10,

	        pointerMoveTolerance = 1,

	        // for ignoring browser's simulated mouse events
	        prevTouchTime = 0,

	        // Allow this many interactions to happen simultaneously
	        maxInteractions = Infinity,

	        // Check if is IE9 or older
	        actionCursors = (document.all && !window.atob) ? {
	            drag    : 'move',
	            resizex : 'e-resize',
	            resizey : 's-resize',
	            resizexy: 'se-resize',

	            resizetop        : 'n-resize',
	            resizeleft       : 'w-resize',
	            resizebottom     : 's-resize',
	            resizeright      : 'e-resize',
	            resizetopleft    : 'se-resize',
	            resizebottomright: 'se-resize',
	            resizetopright   : 'ne-resize',
	            resizebottomleft : 'ne-resize',

	            gesture : ''
	        } : {
	            drag    : 'move',
	            resizex : 'ew-resize',
	            resizey : 'ns-resize',
	            resizexy: 'nwse-resize',

	            resizetop        : 'ns-resize',
	            resizeleft       : 'ew-resize',
	            resizebottom     : 'ns-resize',
	            resizeright      : 'ew-resize',
	            resizetopleft    : 'nwse-resize',
	            resizebottomright: 'nwse-resize',
	            resizetopright   : 'nesw-resize',
	            resizebottomleft : 'nesw-resize',

	            gesture : ''
	        },

	        actionIsEnabled = {
	            drag   : true,
	            resize : true,
	            gesture: true
	        },

	        // because Webkit and Opera still use 'mousewheel' event type
	        wheelEvent = 'onmousewheel' in document? 'mousewheel': 'wheel',

	        eventTypes = [
	            'dragstart',
	            'dragmove',
	            'draginertiastart',
	            'dragend',
	            'dragenter',
	            'dragleave',
	            'dropactivate',
	            'dropdeactivate',
	            'dropmove',
	            'drop',
	            'resizestart',
	            'resizemove',
	            'resizeinertiastart',
	            'resizeend',
	            'gesturestart',
	            'gesturemove',
	            'gestureinertiastart',
	            'gestureend',

	            'down',
	            'move',
	            'up',
	            'cancel',
	            'tap',
	            'doubletap',
	            'hold'
	        ],

	        globalEvents = {},

	        // Opera Mobile must be handled differently
	        isOperaMobile = navigator.appName == 'Opera' &&
	            supportsTouch &&
	            navigator.userAgent.match('Presto'),

	        // scrolling doesn't change the result of getClientRects on iOS 7
	        isIOS7 = (/iP(hone|od|ad)/.test(navigator.platform)
	                         && /OS 7[^\d]/.test(navigator.appVersion)),

	        // prefix matchesSelector
	        prefixedMatchesSelector = 'matches' in Element.prototype?
	                'matches': 'webkitMatchesSelector' in Element.prototype?
	                    'webkitMatchesSelector': 'mozMatchesSelector' in Element.prototype?
	                        'mozMatchesSelector': 'oMatchesSelector' in Element.prototype?
	                            'oMatchesSelector': 'msMatchesSelector',

	        // will be polyfill function if browser is IE8
	        ie8MatchesSelector,

	        // native requestAnimationFrame or polyfill
	        reqFrame = realWindow.requestAnimationFrame,
	        cancelFrame = realWindow.cancelAnimationFrame,

	        // Events wrapper
	        events = (function () {
	            var useAttachEvent = ('attachEvent' in window) && !('addEventListener' in window),
	                addEvent       = useAttachEvent?  'attachEvent': 'addEventListener',
	                removeEvent    = useAttachEvent?  'detachEvent': 'removeEventListener',
	                on             = useAttachEvent? 'on': '',

	                elements          = [],
	                targets           = [],
	                attachedListeners = [];

	            function add (element, type, listener, useCapture) {
	                var elementIndex = indexOf(elements, element),
	                    target = targets[elementIndex];

	                if (!target) {
	                    target = {
	                        events: {},
	                        typeCount: 0
	                    };

	                    elementIndex = elements.push(element) - 1;
	                    targets.push(target);

	                    attachedListeners.push((useAttachEvent ? {
	                            supplied: [],
	                            wrapped : [],
	                            useCount: []
	                        } : null));
	                }

	                if (!target.events[type]) {
	                    target.events[type] = [];
	                    target.typeCount++;
	                }

	                if (!contains(target.events[type], listener)) {
	                    var ret;

	                    if (useAttachEvent) {
	                        var listeners = attachedListeners[elementIndex],
	                            listenerIndex = indexOf(listeners.supplied, listener);

	                        var wrapped = listeners.wrapped[listenerIndex] || function (event) {
	                            if (!event.immediatePropagationStopped) {
	                                event.target = event.srcElement;
	                                event.currentTarget = element;

	                                event.preventDefault = event.preventDefault || preventDef;
	                                event.stopPropagation = event.stopPropagation || stopProp;
	                                event.stopImmediatePropagation = event.stopImmediatePropagation || stopImmProp;

	                                if (/mouse|click/.test(event.type)) {
	                                    event.pageX = event.clientX + getWindow(element).document.documentElement.scrollLeft;
	                                    event.pageY = event.clientY + getWindow(element).document.documentElement.scrollTop;
	                                }

	                                listener(event);
	                            }
	                        };

	                        ret = element[addEvent](on + type, wrapped, Boolean(useCapture));

	                        if (listenerIndex === -1) {
	                            listeners.supplied.push(listener);
	                            listeners.wrapped.push(wrapped);
	                            listeners.useCount.push(1);
	                        }
	                        else {
	                            listeners.useCount[listenerIndex]++;
	                        }
	                    }
	                    else {
	                        ret = element[addEvent](type, listener, useCapture || false);
	                    }
	                    target.events[type].push(listener);

	                    return ret;
	                }
	            }

	            function remove (element, type, listener, useCapture) {
	                var i,
	                    elementIndex = indexOf(elements, element),
	                    target = targets[elementIndex],
	                    listeners,
	                    listenerIndex,
	                    wrapped = listener;

	                if (!target || !target.events) {
	                    return;
	                }

	                if (useAttachEvent) {
	                    listeners = attachedListeners[elementIndex];
	                    listenerIndex = indexOf(listeners.supplied, listener);
	                    wrapped = listeners.wrapped[listenerIndex];
	                }

	                if (type === 'all') {
	                    for (type in target.events) {
	                        if (target.events.hasOwnProperty(type)) {
	                            remove(element, type, 'all');
	                        }
	                    }
	                    return;
	                }

	                if (target.events[type]) {
	                    var len = target.events[type].length;

	                    if (listener === 'all') {
	                        for (i = 0; i < len; i++) {
	                            remove(element, type, target.events[type][i], Boolean(useCapture));
	                        }
	                        return;
	                    } else {
	                        for (i = 0; i < len; i++) {
	                            if (target.events[type][i] === listener) {
	                                element[removeEvent](on + type, wrapped, useCapture || false);
	                                target.events[type].splice(i, 1);

	                                if (useAttachEvent && listeners) {
	                                    listeners.useCount[listenerIndex]--;
	                                    if (listeners.useCount[listenerIndex] === 0) {
	                                        listeners.supplied.splice(listenerIndex, 1);
	                                        listeners.wrapped.splice(listenerIndex, 1);
	                                        listeners.useCount.splice(listenerIndex, 1);
	                                    }
	                                }

	                                break;
	                            }
	                        }
	                    }

	                    if (target.events[type] && target.events[type].length === 0) {
	                        target.events[type] = null;
	                        target.typeCount--;
	                    }
	                }

	                if (!target.typeCount) {
	                    targets.splice(elementIndex, 1);
	                    elements.splice(elementIndex, 1);
	                    attachedListeners.splice(elementIndex, 1);
	                }
	            }

	            function preventDef () {
	                this.returnValue = false;
	            }

	            function stopProp () {
	                this.cancelBubble = true;
	            }

	            function stopImmProp () {
	                this.cancelBubble = true;
	                this.immediatePropagationStopped = true;
	            }

	            return {
	                add: add,
	                remove: remove,
	                useAttachEvent: useAttachEvent,

	                _elements: elements,
	                _targets: targets,
	                _attachedListeners: attachedListeners
	            };
	        }());

	    function blank () {}

	    function isElement (o) {
	        if (!o || (typeof o !== 'object')) { return false; }

	        var _window = getWindow(o) || window;

	        return (/object|function/.test(typeof _window.Element)
	            ? o instanceof _window.Element //DOM2
	            : o.nodeType === 1 && typeof o.nodeName === "string");
	    }
	    function isWindow (thing) { return thing === window || !!(thing && thing.Window) && (thing instanceof thing.Window); }
	    function isDocFrag (thing) { return !!thing && thing instanceof DocumentFragment; }
	    function isArray (thing) {
	        return isObject(thing)
	                && (typeof thing.length !== undefined)
	                && isFunction(thing.splice);
	    }
	    function isObject   (thing) { return !!thing && (typeof thing === 'object'); }
	    function isFunction (thing) { return typeof thing === 'function'; }
	    function isNumber   (thing) { return typeof thing === 'number'  ; }
	    function isBool     (thing) { return typeof thing === 'boolean' ; }
	    function isString   (thing) { return typeof thing === 'string'  ; }

	    function trySelector (value) {
	        if (!isString(value)) { return false; }

	        // an exception will be raised if it is invalid
	        document.querySelector(value);
	        return true;
	    }

	    function extend (dest, source) {
	        for (var prop in source) {
	            dest[prop] = source[prop];
	        }
	        return dest;
	    }

	    var prefixedPropREs = {
	      webkit: /(Movement[XY]|Radius[XY]|RotationAngle|Force)$/
	    };

	    function pointerExtend (dest, source) {
	        for (var prop in source) {
	          var deprecated = false;

	          // skip deprecated prefixed properties
	          for (var vendor in prefixedPropREs) {
	            if (prop.indexOf(vendor) === 0 && prefixedPropREs[vendor].test(prop)) {
	              deprecated = true;
	              break;
	            }
	          }

	          if (!deprecated) {
	            dest[prop] = source[prop];
	          }
	        }
	        return dest;
	    }

	    function copyCoords (dest, src) {
	        dest.page = dest.page || {};
	        dest.page.x = src.page.x;
	        dest.page.y = src.page.y;

	        dest.client = dest.client || {};
	        dest.client.x = src.client.x;
	        dest.client.y = src.client.y;

	        dest.timeStamp = src.timeStamp;
	    }

	    function setEventXY (targetObj, pointers, interaction) {
	        var pointer = (pointers.length > 1
	                       ? pointerAverage(pointers)
	                       : pointers[0]);

	        getPageXY(pointer, tmpXY, interaction);
	        targetObj.page.x = tmpXY.x;
	        targetObj.page.y = tmpXY.y;

	        getClientXY(pointer, tmpXY, interaction);
	        targetObj.client.x = tmpXY.x;
	        targetObj.client.y = tmpXY.y;

	        targetObj.timeStamp = new Date().getTime();
	    }

	    function setEventDeltas (targetObj, prev, cur) {
	        targetObj.page.x     = cur.page.x      - prev.page.x;
	        targetObj.page.y     = cur.page.y      - prev.page.y;
	        targetObj.client.x   = cur.client.x    - prev.client.x;
	        targetObj.client.y   = cur.client.y    - prev.client.y;
	        targetObj.timeStamp = new Date().getTime() - prev.timeStamp;

	        // set pointer velocity
	        var dt = Math.max(targetObj.timeStamp / 1000, 0.001);
	        targetObj.page.speed   = hypot(targetObj.page.x, targetObj.page.y) / dt;
	        targetObj.page.vx      = targetObj.page.x / dt;
	        targetObj.page.vy      = targetObj.page.y / dt;

	        targetObj.client.speed = hypot(targetObj.client.x, targetObj.page.y) / dt;
	        targetObj.client.vx    = targetObj.client.x / dt;
	        targetObj.client.vy    = targetObj.client.y / dt;
	    }

	    function isNativePointer (pointer) {
	        return (pointer instanceof window.Event
	            || (supportsTouch && window.Touch && pointer instanceof window.Touch));
	    }

	    // Get specified X/Y coords for mouse or event.touches[0]
	    function getXY (type, pointer, xy) {
	        xy = xy || {};
	        type = type || 'page';

	        xy.x = pointer[type + 'X'];
	        xy.y = pointer[type + 'Y'];

	        return xy;
	    }

	    function getPageXY (pointer, page) {
	        page = page || {};

	        // Opera Mobile handles the viewport and scrolling oddly
	        if (isOperaMobile && isNativePointer(pointer)) {
	            getXY('screen', pointer, page);

	            page.x += window.scrollX;
	            page.y += window.scrollY;
	        }
	        else {
	            getXY('page', pointer, page);
	        }

	        return page;
	    }

	    function getClientXY (pointer, client) {
	        client = client || {};

	        if (isOperaMobile && isNativePointer(pointer)) {
	            // Opera Mobile handles the viewport and scrolling oddly
	            getXY('screen', pointer, client);
	        }
	        else {
	          getXY('client', pointer, client);
	        }

	        return client;
	    }

	    function getScrollXY (win) {
	        win = win || window;
	        return {
	            x: win.scrollX || win.document.documentElement.scrollLeft,
	            y: win.scrollY || win.document.documentElement.scrollTop
	        };
	    }

	    function getPointerId (pointer) {
	        return isNumber(pointer.pointerId)? pointer.pointerId : pointer.identifier;
	    }

	    function getActualElement (element) {
	        return (element instanceof SVGElementInstance
	            ? element.correspondingUseElement
	            : element);
	    }

	    function getWindow (node) {
	        if (isWindow(node)) {
	            return node;
	        }

	        var rootNode = (node.ownerDocument || node);

	        return rootNode.defaultView || rootNode.parentWindow || window;
	    }

	    function getElementClientRect (element) {
	        var clientRect = (element instanceof SVGElement
	                            ? element.getBoundingClientRect()
	                            : element.getClientRects()[0]);

	        return clientRect && {
	            left  : clientRect.left,
	            right : clientRect.right,
	            top   : clientRect.top,
	            bottom: clientRect.bottom,
	            width : clientRect.width || clientRect.right - clientRect.left,
	            height: clientRect.height || clientRect.bottom - clientRect.top
	        };
	    }

	    function getElementRect (element) {
	        var clientRect = getElementClientRect(element);

	        if (!isIOS7 && clientRect) {
	            var scroll = getScrollXY(getWindow(element));

	            clientRect.left   += scroll.x;
	            clientRect.right  += scroll.x;
	            clientRect.top    += scroll.y;
	            clientRect.bottom += scroll.y;
	        }

	        return clientRect;
	    }

	    function getTouchPair (event) {
	        var touches = [];

	        // array of touches is supplied
	        if (isArray(event)) {
	            touches[0] = event[0];
	            touches[1] = event[1];
	        }
	        // an event
	        else {
	            if (event.type === 'touchend') {
	                if (event.touches.length === 1) {
	                    touches[0] = event.touches[0];
	                    touches[1] = event.changedTouches[0];
	                }
	                else if (event.touches.length === 0) {
	                    touches[0] = event.changedTouches[0];
	                    touches[1] = event.changedTouches[1];
	                }
	            }
	            else {
	                touches[0] = event.touches[0];
	                touches[1] = event.touches[1];
	            }
	        }

	        return touches;
	    }

	    function pointerAverage (pointers) {
	        var average = {
	            pageX  : 0,
	            pageY  : 0,
	            clientX: 0,
	            clientY: 0,
	            screenX: 0,
	            screenY: 0
	        };
	        var prop;

	        for (var i = 0; i < pointers.length; i++) {
	            for (prop in average) {
	                average[prop] += pointers[i][prop];
	            }
	        }
	        for (prop in average) {
	            average[prop] /= pointers.length;
	        }

	        return average;
	    }

	    function touchBBox (event) {
	        if (!event.length && !(event.touches && event.touches.length > 1)) {
	            return;
	        }

	        var touches = getTouchPair(event),
	            minX = Math.min(touches[0].pageX, touches[1].pageX),
	            minY = Math.min(touches[0].pageY, touches[1].pageY),
	            maxX = Math.max(touches[0].pageX, touches[1].pageX),
	            maxY = Math.max(touches[0].pageY, touches[1].pageY);

	        return {
	            x: minX,
	            y: minY,
	            left: minX,
	            top: minY,
	            width: maxX - minX,
	            height: maxY - minY
	        };
	    }

	    function touchDistance (event, deltaSource) {
	        deltaSource = deltaSource || defaultOptions.deltaSource;

	        var sourceX = deltaSource + 'X',
	            sourceY = deltaSource + 'Y',
	            touches = getTouchPair(event);


	        var dx = touches[0][sourceX] - touches[1][sourceX],
	            dy = touches[0][sourceY] - touches[1][sourceY];

	        return hypot(dx, dy);
	    }

	    function touchAngle (event, prevAngle, deltaSource) {
	        deltaSource = deltaSource || defaultOptions.deltaSource;

	        var sourceX = deltaSource + 'X',
	            sourceY = deltaSource + 'Y',
	            touches = getTouchPair(event),
	            dx = touches[0][sourceX] - touches[1][sourceX],
	            dy = touches[0][sourceY] - touches[1][sourceY],
	            angle = 180 * Math.atan(dy / dx) / Math.PI;

	        if (isNumber(prevAngle)) {
	            var dr = angle - prevAngle,
	                drClamped = dr % 360;

	            if (drClamped > 315) {
	                angle -= 360 + (angle / 360)|0 * 360;
	            }
	            else if (drClamped > 135) {
	                angle -= 180 + (angle / 360)|0 * 360;
	            }
	            else if (drClamped < -315) {
	                angle += 360 + (angle / 360)|0 * 360;
	            }
	            else if (drClamped < -135) {
	                angle += 180 + (angle / 360)|0 * 360;
	            }
	        }

	        return  angle;
	    }

	    function getOriginXY (interactable, element) {
	        var origin = interactable
	                ? interactable.options.origin
	                : defaultOptions.origin;

	        if (origin === 'parent') {
	            origin = parentElement(element);
	        }
	        else if (origin === 'self') {
	            origin = interactable.getRect(element);
	        }
	        else if (trySelector(origin)) {
	            origin = closest(element, origin) || { x: 0, y: 0 };
	        }

	        if (isFunction(origin)) {
	            origin = origin(interactable && element);
	        }

	        if (isElement(origin))  {
	            origin = getElementRect(origin);
	        }

	        origin.x = ('x' in origin)? origin.x : origin.left;
	        origin.y = ('y' in origin)? origin.y : origin.top;

	        return origin;
	    }

	    // http://stackoverflow.com/a/5634528/2280888
	    function _getQBezierValue(t, p1, p2, p3) {
	        var iT = 1 - t;
	        return iT * iT * p1 + 2 * iT * t * p2 + t * t * p3;
	    }

	    function getQuadraticCurvePoint(startX, startY, cpX, cpY, endX, endY, position) {
	        return {
	            x:  _getQBezierValue(position, startX, cpX, endX),
	            y:  _getQBezierValue(position, startY, cpY, endY)
	        };
	    }

	    // http://gizma.com/easing/
	    function easeOutQuad (t, b, c, d) {
	        t /= d;
	        return -c * t*(t-2) + b;
	    }

	    function nodeContains (parent, child) {
	        while (child) {
	            if (child === parent) {
	                return true;
	            }

	            child = child.parentNode;
	        }

	        return false;
	    }

	    function closest (child, selector) {
	        var parent = parentElement(child);

	        while (isElement(parent)) {
	            if (matchesSelector(parent, selector)) { return parent; }

	            parent = parentElement(parent);
	        }

	        return null;
	    }

	    function parentElement (node) {
	        var parent = node.parentNode;

	        if (isDocFrag(parent)) {
	            // skip past #shado-root fragments
	            while ((parent = parent.host) && isDocFrag(parent)) {}

	            return parent;
	        }

	        return parent;
	    }

	    function inContext (interactable, element) {
	        return interactable._context === element.ownerDocument
	                || nodeContains(interactable._context, element);
	    }

	    function testIgnore (interactable, interactableElement, element) {
	        var ignoreFrom = interactable.options.ignoreFrom;

	        if (!ignoreFrom || !isElement(element)) { return false; }

	        if (isString(ignoreFrom)) {
	            return matchesUpTo(element, ignoreFrom, interactableElement);
	        }
	        else if (isElement(ignoreFrom)) {
	            return nodeContains(ignoreFrom, element);
	        }

	        return false;
	    }

	    function testAllow (interactable, interactableElement, element) {
	        var allowFrom = interactable.options.allowFrom;

	        if (!allowFrom) { return true; }

	        if (!isElement(element)) { return false; }

	        if (isString(allowFrom)) {
	            return matchesUpTo(element, allowFrom, interactableElement);
	        }
	        else if (isElement(allowFrom)) {
	            return nodeContains(allowFrom, element);
	        }

	        return false;
	    }

	    function checkAxis (axis, interactable) {
	        if (!interactable) { return false; }

	        var thisAxis = interactable.options.drag.axis;

	        return (axis === 'xy' || thisAxis === 'xy' || thisAxis === axis);
	    }

	    function checkSnap (interactable, action) {
	        var options = interactable.options;

	        if (/^resize/.test(action)) {
	            action = 'resize';
	        }

	        return options[action].snap && options[action].snap.enabled;
	    }

	    function checkRestrict (interactable, action) {
	        var options = interactable.options;

	        if (/^resize/.test(action)) {
	            action = 'resize';
	        }

	        return  options[action].restrict && options[action].restrict.enabled;
	    }

	    function checkAutoScroll (interactable, action) {
	        var options = interactable.options;

	        if (/^resize/.test(action)) {
	            action = 'resize';
	        }

	        return  options[action].autoScroll && options[action].autoScroll.enabled;
	    }

	    function withinInteractionLimit (interactable, element, action) {
	        var options = interactable.options,
	            maxActions = options[action.name].max,
	            maxPerElement = options[action.name].maxPerElement,
	            activeInteractions = 0,
	            targetCount = 0,
	            targetElementCount = 0;

	        for (var i = 0, len = interactions.length; i < len; i++) {
	            var interaction = interactions[i],
	                otherAction = interaction.prepared.name,
	                active = interaction.interacting();

	            if (!active) { continue; }

	            activeInteractions++;

	            if (activeInteractions >= maxInteractions) {
	                return false;
	            }

	            if (interaction.target !== interactable) { continue; }

	            targetCount += (otherAction === action.name)|0;

	            if (targetCount >= maxActions) {
	                return false;
	            }

	            if (interaction.element === element) {
	                targetElementCount++;

	                if (otherAction !== action.name || targetElementCount >= maxPerElement) {
	                    return false;
	                }
	            }
	        }

	        return maxInteractions > 0;
	    }

	    // Test for the element that's "above" all other qualifiers
	    function indexOfDeepestElement (elements) {
	        var dropzone,
	            deepestZone = elements[0],
	            index = deepestZone? 0: -1,
	            parent,
	            deepestZoneParents = [],
	            dropzoneParents = [],
	            child,
	            i,
	            n;

	        for (i = 1; i < elements.length; i++) {
	            dropzone = elements[i];

	            // an element might belong to multiple selector dropzones
	            if (!dropzone || dropzone === deepestZone) {
	                continue;
	            }

	            if (!deepestZone) {
	                deepestZone = dropzone;
	                index = i;
	                continue;
	            }

	            // check if the deepest or current are document.documentElement or document.rootElement
	            // - if the current dropzone is, do nothing and continue
	            if (dropzone.parentNode === dropzone.ownerDocument) {
	                continue;
	            }
	            // - if deepest is, update with the current dropzone and continue to next
	            else if (deepestZone.parentNode === dropzone.ownerDocument) {
	                deepestZone = dropzone;
	                index = i;
	                continue;
	            }

	            if (!deepestZoneParents.length) {
	                parent = deepestZone;
	                while (parent.parentNode && parent.parentNode !== parent.ownerDocument) {
	                    deepestZoneParents.unshift(parent);
	                    parent = parent.parentNode;
	                }
	            }

	            // if this element is an svg element and the current deepest is
	            // an HTMLElement
	            if (deepestZone instanceof HTMLElement
	                && dropzone instanceof SVGElement
	                && !(dropzone instanceof SVGSVGElement)) {

	                if (dropzone === deepestZone.parentNode) {
	                    continue;
	                }

	                parent = dropzone.ownerSVGElement;
	            }
	            else {
	                parent = dropzone;
	            }

	            dropzoneParents = [];

	            while (parent.parentNode !== parent.ownerDocument) {
	                dropzoneParents.unshift(parent);
	                parent = parent.parentNode;
	            }

	            n = 0;

	            // get (position of last common ancestor) + 1
	            while (dropzoneParents[n] && dropzoneParents[n] === deepestZoneParents[n]) {
	                n++;
	            }

	            var parents = [
	                dropzoneParents[n - 1],
	                dropzoneParents[n],
	                deepestZoneParents[n]
	            ];

	            child = parents[0].lastChild;

	            while (child) {
	                if (child === parents[1]) {
	                    deepestZone = dropzone;
	                    index = i;
	                    deepestZoneParents = [];

	                    break;
	                }
	                else if (child === parents[2]) {
	                    break;
	                }

	                child = child.previousSibling;
	            }
	        }

	        return index;
	    }

	    function Interaction () {
	        this.target          = null; // current interactable being interacted with
	        this.element         = null; // the target element of the interactable
	        this.dropTarget      = null; // the dropzone a drag target might be dropped into
	        this.dropElement     = null; // the element at the time of checking
	        this.prevDropTarget  = null; // the dropzone that was recently dragged away from
	        this.prevDropElement = null; // the element at the time of checking

	        this.prepared        = {     // action that's ready to be fired on next move event
	            name : null,
	            axis : null,
	            edges: null
	        };

	        this.matches         = [];   // all selectors that are matched by target element
	        this.matchElements   = [];   // corresponding elements

	        this.inertiaStatus = {
	            active       : false,
	            smoothEnd    : false,
	            ending       : false,

	            startEvent: null,
	            upCoords: {},

	            xe: 0, ye: 0,
	            sx: 0, sy: 0,

	            t0: 0,
	            vx0: 0, vys: 0,
	            duration: 0,

	            resumeDx: 0,
	            resumeDy: 0,

	            lambda_v0: 0,
	            one_ve_v0: 0,
	            i  : null
	        };

	        if (isFunction(Function.prototype.bind)) {
	            this.boundInertiaFrame = this.inertiaFrame.bind(this);
	            this.boundSmoothEndFrame = this.smoothEndFrame.bind(this);
	        }
	        else {
	            var that = this;

	            this.boundInertiaFrame = function () { return that.inertiaFrame(); };
	            this.boundSmoothEndFrame = function () { return that.smoothEndFrame(); };
	        }

	        this.activeDrops = {
	            dropzones: [],      // the dropzones that are mentioned below
	            elements : [],      // elements of dropzones that accept the target draggable
	            rects    : []       // the rects of the elements mentioned above
	        };

	        // keep track of added pointers
	        this.pointers    = [];
	        this.pointerIds  = [];
	        this.downTargets = [];
	        this.downTimes   = [];
	        this.holdTimers  = [];

	        // Previous native pointer move event coordinates
	        this.prevCoords = {
	            page     : { x: 0, y: 0 },
	            client   : { x: 0, y: 0 },
	            timeStamp: 0
	        };
	        // current native pointer move event coordinates
	        this.curCoords = {
	            page     : { x: 0, y: 0 },
	            client   : { x: 0, y: 0 },
	            timeStamp: 0
	        };

	        // Starting InteractEvent pointer coordinates
	        this.startCoords = {
	            page     : { x: 0, y: 0 },
	            client   : { x: 0, y: 0 },
	            timeStamp: 0
	        };

	        // Change in coordinates and time of the pointer
	        this.pointerDelta = {
	            page     : { x: 0, y: 0, vx: 0, vy: 0, speed: 0 },
	            client   : { x: 0, y: 0, vx: 0, vy: 0, speed: 0 },
	            timeStamp: 0
	        };

	        this.downEvent   = null;    // pointerdown/mousedown/touchstart event
	        this.downPointer = {};

	        this._eventTarget    = null;
	        this._curEventTarget = null;

	        this.prevEvent = null;      // previous action event
	        this.tapTime   = 0;         // time of the most recent tap event
	        this.prevTap   = null;

	        this.startOffset    = { left: 0, right: 0, top: 0, bottom: 0 };
	        this.restrictOffset = { left: 0, right: 0, top: 0, bottom: 0 };
	        this.snapOffsets    = [];

	        this.gesture = {
	            start: { x: 0, y: 0 },

	            startDistance: 0,   // distance between two touches of touchStart
	            prevDistance : 0,
	            distance     : 0,

	            scale: 1,           // gesture.distance / gesture.startDistance

	            startAngle: 0,      // angle of line joining two touches
	            prevAngle : 0       // angle of the previous gesture event
	        };

	        this.snapStatus = {
	            x       : 0, y       : 0,
	            dx      : 0, dy      : 0,
	            realX   : 0, realY   : 0,
	            snappedX: 0, snappedY: 0,
	            targets : [],
	            locked  : false,
	            changed : false
	        };

	        this.restrictStatus = {
	            dx         : 0, dy         : 0,
	            restrictedX: 0, restrictedY: 0,
	            snap       : null,
	            restricted : false,
	            changed    : false
	        };

	        this.restrictStatus.snap = this.snapStatus;

	        this.pointerIsDown   = false;
	        this.pointerWasMoved = false;
	        this.gesturing       = false;
	        this.dragging        = false;
	        this.resizing        = false;
	        this.resizeAxes      = 'xy';

	        this.mouse = false;

	        interactions.push(this);
	    }

	    Interaction.prototype = {
	        getPageXY  : function (pointer, xy) { return   getPageXY(pointer, xy, this); },
	        getClientXY: function (pointer, xy) { return getClientXY(pointer, xy, this); },
	        setEventXY : function (target, ptr) { return  setEventXY(target, ptr, this); },

	        pointerOver: function (pointer, event, eventTarget) {
	            if (this.prepared.name || !this.mouse) { return; }

	            var curMatches = [],
	                curMatchElements = [],
	                prevTargetElement = this.element;

	            this.addPointer(pointer);

	            if (this.target
	                && (testIgnore(this.target, this.element, eventTarget)
	                    || !testAllow(this.target, this.element, eventTarget))) {
	                // if the eventTarget should be ignored or shouldn't be allowed
	                // clear the previous target
	                this.target = null;
	                this.element = null;
	                this.matches = [];
	                this.matchElements = [];
	            }

	            var elementInteractable = interactables.get(eventTarget),
	                elementAction = (elementInteractable
	                                 && !testIgnore(elementInteractable, eventTarget, eventTarget)
	                                 && testAllow(elementInteractable, eventTarget, eventTarget)
	                                 && validateAction(
	                                     elementInteractable.getAction(pointer, event, this, eventTarget),
	                                     elementInteractable));

	            if (elementAction && !withinInteractionLimit(elementInteractable, eventTarget, elementAction)) {
	                 elementAction = null;
	            }

	            function pushCurMatches (interactable, selector) {
	                if (interactable
	                    && inContext(interactable, eventTarget)
	                    && !testIgnore(interactable, eventTarget, eventTarget)
	                    && testAllow(interactable, eventTarget, eventTarget)
	                    && matchesSelector(eventTarget, selector)) {

	                    curMatches.push(interactable);
	                    curMatchElements.push(eventTarget);
	                }
	            }

	            if (elementAction) {
	                this.target = elementInteractable;
	                this.element = eventTarget;
	                this.matches = [];
	                this.matchElements = [];
	            }
	            else {
	                interactables.forEachSelector(pushCurMatches);

	                if (this.validateSelector(pointer, event, curMatches, curMatchElements)) {
	                    this.matches = curMatches;
	                    this.matchElements = curMatchElements;

	                    this.pointerHover(pointer, event, this.matches, this.matchElements);
	                    events.add(eventTarget,
	                                        PointerEvent? pEventTypes.move : 'mousemove',
	                                        listeners.pointerHover);
	                }
	                else if (this.target) {
	                    if (nodeContains(prevTargetElement, eventTarget)) {
	                        this.pointerHover(pointer, event, this.matches, this.matchElements);
	                        events.add(this.element,
	                                            PointerEvent? pEventTypes.move : 'mousemove',
	                                            listeners.pointerHover);
	                    }
	                    else {
	                        this.target = null;
	                        this.element = null;
	                        this.matches = [];
	                        this.matchElements = [];
	                    }
	                }
	            }
	        },

	        // Check what action would be performed on pointerMove target if a mouse
	        // button were pressed and change the cursor accordingly
	        pointerHover: function (pointer, event, eventTarget, curEventTarget, matches, matchElements) {
	            var target = this.target;

	            if (!this.prepared.name && this.mouse) {

	                var action;

	                // update pointer coords for defaultActionChecker to use
	                this.setEventXY(this.curCoords, [pointer]);

	                if (matches) {
	                    action = this.validateSelector(pointer, event, matches, matchElements);
	                }
	                else if (target) {
	                    action = validateAction(target.getAction(this.pointers[0], event, this, this.element), this.target);
	                }

	                if (target && target.options.styleCursor) {
	                    if (action) {
	                        target._doc.documentElement.style.cursor = getActionCursor(action);
	                    }
	                    else {
	                        target._doc.documentElement.style.cursor = '';
	                    }
	                }
	            }
	            else if (this.prepared.name) {
	                this.checkAndPreventDefault(event, target, this.element);
	            }
	        },

	        pointerOut: function (pointer, event, eventTarget) {
	            if (this.prepared.name) { return; }

	            // Remove temporary event listeners for selector Interactables
	            if (!interactables.get(eventTarget)) {
	                events.remove(eventTarget,
	                                       PointerEvent? pEventTypes.move : 'mousemove',
	                                       listeners.pointerHover);
	            }

	            if (this.target && this.target.options.styleCursor && !this.interacting()) {
	                this.target._doc.documentElement.style.cursor = '';
	            }
	        },

	        selectorDown: function (pointer, event, eventTarget, curEventTarget) {
	            var that = this,
	                // copy event to be used in timeout for IE8
	                eventCopy = events.useAttachEvent? extend({}, event) : event,
	                element = eventTarget,
	                pointerIndex = this.addPointer(pointer),
	                action;

	            this.holdTimers[pointerIndex] = setTimeout(function () {
	                that.pointerHold(events.useAttachEvent? eventCopy : pointer, eventCopy, eventTarget, curEventTarget);
	            }, defaultOptions._holdDuration);

	            this.pointerIsDown = true;

	            // Check if the down event hits the current inertia target
	            if (this.inertiaStatus.active && this.target.selector) {
	                // climb up the DOM tree from the event target
	                while (isElement(element)) {

	                    // if this element is the current inertia target element
	                    if (element === this.element
	                        // and the prospective action is the same as the ongoing one
	                        && validateAction(this.target.getAction(pointer, event, this, this.element), this.target).name === this.prepared.name) {

	                        // stop inertia so that the next move will be a normal one
	                        cancelFrame(this.inertiaStatus.i);
	                        this.inertiaStatus.active = false;

	                        this.collectEventTargets(pointer, event, eventTarget, 'down');
	                        return;
	                    }
	                    element = parentElement(element);
	                }
	            }

	            // do nothing if interacting
	            if (this.interacting()) {
	                this.collectEventTargets(pointer, event, eventTarget, 'down');
	                return;
	            }

	            function pushMatches (interactable, selector, context) {
	                var elements = ie8MatchesSelector
	                    ? context.querySelectorAll(selector)
	                    : undefined;

	                if (inContext(interactable, element)
	                    && !testIgnore(interactable, element, eventTarget)
	                    && testAllow(interactable, element, eventTarget)
	                    && matchesSelector(element, selector, elements)) {

	                    that.matches.push(interactable);
	                    that.matchElements.push(element);
	                }
	            }

	            // update pointer coords for defaultActionChecker to use
	            this.setEventXY(this.curCoords, [pointer]);
	            this.downEvent = event;

	            while (isElement(element) && !action) {
	                this.matches = [];
	                this.matchElements = [];

	                interactables.forEachSelector(pushMatches);

	                action = this.validateSelector(pointer, event, this.matches, this.matchElements);
	                element = parentElement(element);
	            }

	            if (action) {
	                this.prepared.name  = action.name;
	                this.prepared.axis  = action.axis;
	                this.prepared.edges = action.edges;

	                this.collectEventTargets(pointer, event, eventTarget, 'down');

	                return this.pointerDown(pointer, event, eventTarget, curEventTarget, action);
	            }
	            else {
	                // do these now since pointerDown isn't being called from here
	                this.downTimes[pointerIndex] = new Date().getTime();
	                this.downTargets[pointerIndex] = eventTarget;
	                pointerExtend(this.downPointer, pointer);

	                copyCoords(this.prevCoords, this.curCoords);
	                this.pointerWasMoved = false;
	            }

	            this.collectEventTargets(pointer, event, eventTarget, 'down');
	        },

	        // Determine action to be performed on next pointerMove and add appropriate
	        // style and event Listeners
	        pointerDown: function (pointer, event, eventTarget, curEventTarget, forceAction) {
	            if (!forceAction && !this.inertiaStatus.active && this.pointerWasMoved && this.prepared.name) {
	                this.checkAndPreventDefault(event, this.target, this.element);

	                return;
	            }

	            this.pointerIsDown = true;
	            this.downEvent = event;

	            var pointerIndex = this.addPointer(pointer),
	                action;

	            // If it is the second touch of a multi-touch gesture, keep the
	            // target the same and get a new action if a target was set by the
	            // first touch
	            if (this.pointerIds.length > 1 && this.target._element === this.element) {
	                var newAction = validateAction(forceAction || this.target.getAction(pointer, event, this, this.element), this.target);

	                if (withinInteractionLimit(this.target, this.element, newAction)) {
	                    action = newAction;
	                }

	                this.prepared.name = null;
	            }
	            // Otherwise, set the target if there is no action prepared
	            else if (!this.prepared.name) {
	                var interactable = interactables.get(curEventTarget);

	                if (interactable
	                    && !testIgnore(interactable, curEventTarget, eventTarget)
	                    && testAllow(interactable, curEventTarget, eventTarget)
	                    && (action = validateAction(forceAction || interactable.getAction(pointer, event, this, curEventTarget), interactable, eventTarget))
	                    && withinInteractionLimit(interactable, curEventTarget, action)) {
	                    this.target = interactable;
	                    this.element = curEventTarget;
	                }
	            }

	            var target = this.target,
	                options = target && target.options;

	            if (target && (forceAction || !this.prepared.name)) {
	                action = action || validateAction(forceAction || target.getAction(pointer, event, this, curEventTarget), target, this.element);

	                this.setEventXY(this.startCoords, this.pointers);

	                if (!action) { return; }

	                if (options.styleCursor) {
	                    target._doc.documentElement.style.cursor = getActionCursor(action);
	                }

	                this.resizeAxes = action.name === 'resize'? action.axis : null;

	                if (action === 'gesture' && this.pointerIds.length < 2) {
	                    action = null;
	                }

	                this.prepared.name  = action.name;
	                this.prepared.axis  = action.axis;
	                this.prepared.edges = action.edges;

	                this.snapStatus.snappedX = this.snapStatus.snappedY =
	                    this.restrictStatus.restrictedX = this.restrictStatus.restrictedY = NaN;

	                this.downTimes[pointerIndex] = new Date().getTime();
	                this.downTargets[pointerIndex] = eventTarget;
	                pointerExtend(this.downPointer, pointer);

	                copyCoords(this.prevCoords, this.startCoords);
	                this.pointerWasMoved = false;

	                this.checkAndPreventDefault(event, target, this.element);
	            }
	            // if inertia is active try to resume action
	            else if (this.inertiaStatus.active
	                && curEventTarget === this.element
	                && validateAction(target.getAction(pointer, event, this, this.element), target).name === this.prepared.name) {

	                cancelFrame(this.inertiaStatus.i);
	                this.inertiaStatus.active = false;

	                this.checkAndPreventDefault(event, target, this.element);
	            }
	        },

	        setModifications: function (coords, preEnd) {
	            var target         = this.target,
	                shouldMove     = true,
	                shouldSnap     = checkSnap(target, this.prepared.name)     && (!target.options[this.prepared.name].snap.endOnly     || preEnd),
	                shouldRestrict = checkRestrict(target, this.prepared.name) && (!target.options[this.prepared.name].restrict.endOnly || preEnd);

	            if (shouldSnap    ) { this.setSnapping   (coords); } else { this.snapStatus    .locked     = false; }
	            if (shouldRestrict) { this.setRestriction(coords); } else { this.restrictStatus.restricted = false; }

	            if (shouldSnap && this.snapStatus.locked && !this.snapStatus.changed) {
	                shouldMove = shouldRestrict && this.restrictStatus.restricted && this.restrictStatus.changed;
	            }
	            else if (shouldRestrict && this.restrictStatus.restricted && !this.restrictStatus.changed) {
	                shouldMove = false;
	            }

	            return shouldMove;
	        },

	        setStartOffsets: function (action, interactable, element) {
	            var rect = interactable.getRect(element),
	                origin = getOriginXY(interactable, element),
	                snap = interactable.options[this.prepared.name].snap,
	                restrict = interactable.options[this.prepared.name].restrict,
	                width, height;

	            if (rect) {
	                this.startOffset.left = this.startCoords.page.x - rect.left;
	                this.startOffset.top  = this.startCoords.page.y - rect.top;

	                this.startOffset.right  = rect.right  - this.startCoords.page.x;
	                this.startOffset.bottom = rect.bottom - this.startCoords.page.y;

	                if ('width' in rect) { width = rect.width; }
	                else { width = rect.right - rect.left; }
	                if ('height' in rect) { height = rect.height; }
	                else { height = rect.bottom - rect.top; }
	            }
	            else {
	                this.startOffset.left = this.startOffset.top = this.startOffset.right = this.startOffset.bottom = 0;
	            }

	            this.snapOffsets.splice(0);

	            var snapOffset = snap && snap.offset === 'startCoords'
	                                ? {
	                                    x: this.startCoords.page.x - origin.x,
	                                    y: this.startCoords.page.y - origin.y
	                                }
	                                : snap && snap.offset || { x: 0, y: 0 };

	            if (rect && snap && snap.relativePoints && snap.relativePoints.length) {
	                for (var i = 0; i < snap.relativePoints.length; i++) {
	                    this.snapOffsets.push({
	                        x: this.startOffset.left - (width  * snap.relativePoints[i].x) + snapOffset.x,
	                        y: this.startOffset.top  - (height * snap.relativePoints[i].y) + snapOffset.y
	                    });
	                }
	            }
	            else {
	                this.snapOffsets.push(snapOffset);
	            }

	            if (rect && restrict.elementRect) {
	                this.restrictOffset.left = this.startOffset.left - (width  * restrict.elementRect.left);
	                this.restrictOffset.top  = this.startOffset.top  - (height * restrict.elementRect.top);

	                this.restrictOffset.right  = this.startOffset.right  - (width  * (1 - restrict.elementRect.right));
	                this.restrictOffset.bottom = this.startOffset.bottom - (height * (1 - restrict.elementRect.bottom));
	            }
	            else {
	                this.restrictOffset.left = this.restrictOffset.top = this.restrictOffset.right = this.restrictOffset.bottom = 0;
	            }
	        },

	        /*\
	         * Interaction.start
	         [ method ]
	         *
	         * Start an action with the given Interactable and Element as tartgets. The
	         * action must be enabled for the target Interactable and an appropriate number
	         * of pointers must be held down – 1 for drag/resize, 2 for gesture.
	         *
	         * Use it with `interactable.<action>able({ manualStart: false })` to always
	         * [start actions manually](https://github.com/taye/interact.js/issues/114)
	         *
	         - action       (object)  The action to be performed - drag, resize, etc.
	         - interactable (Interactable) The Interactable to target
	         - element      (Element) The DOM Element to target
	         = (object) interact
	         **
	         | interact(target)
	         |   .draggable({
	         |     // disable the default drag start by down->move
	         |     manualStart: true
	         |   })
	         |   // start dragging after the user holds the pointer down
	         |   .on('hold', function (event) {
	         |     var interaction = event.interaction;
	         |
	         |     if (!interaction.interacting()) {
	         |       interaction.start({ name: 'drag' },
	         |                         event.interactable,
	         |                         event.currentTarget);
	         |     }
	         | });
	        \*/
	        start: function (action, interactable, element) {
	            if (this.interacting()
	                || !this.pointerIsDown
	                || this.pointerIds.length < (action.name === 'gesture'? 2 : 1)) {
	                return;
	            }

	            // if this interaction had been removed after stopping
	            // add it back
	            if (indexOf(interactions, this) === -1) {
	                interactions.push(this);
	            }

	            // set the startCoords if there was no prepared action
	            if (!this.prepared.name) {
	                this.setEventXY(this.startCoords);
	            }

	            this.prepared.name  = action.name;
	            this.prepared.axis  = action.axis;
	            this.prepared.edges = action.edges;
	            this.target         = interactable;
	            this.element        = element;

	            this.setStartOffsets(action.name, interactable, element);
	            this.setModifications(this.startCoords.page);

	            this.prevEvent = this[this.prepared.name + 'Start'](this.downEvent);
	        },

	        pointerMove: function (pointer, event, eventTarget, curEventTarget, preEnd) {
	            if (this.inertiaStatus.active) {
	                var pageUp   = this.inertiaStatus.upCoords.page;
	                var clientUp = this.inertiaStatus.upCoords.client;

	                var inertiaPosition = {
	                    pageX  : pageUp.x   + this.inertiaStatus.sx,
	                    pageY  : pageUp.y   + this.inertiaStatus.sy,
	                    clientX: clientUp.x + this.inertiaStatus.sx,
	                    clientY: clientUp.y + this.inertiaStatus.sy
	                };

	                this.setEventXY(this.curCoords, [inertiaPosition]);
	            }
	            else {
	                this.recordPointer(pointer);
	                this.setEventXY(this.curCoords, this.pointers);
	            }

	            var duplicateMove = (this.curCoords.page.x === this.prevCoords.page.x
	                                 && this.curCoords.page.y === this.prevCoords.page.y
	                                 && this.curCoords.client.x === this.prevCoords.client.x
	                                 && this.curCoords.client.y === this.prevCoords.client.y);

	            var dx, dy,
	                pointerIndex = this.mouse? 0 : indexOf(this.pointerIds, getPointerId(pointer));

	            // register movement greater than pointerMoveTolerance
	            if (this.pointerIsDown && !this.pointerWasMoved) {
	                dx = this.curCoords.client.x - this.startCoords.client.x;
	                dy = this.curCoords.client.y - this.startCoords.client.y;

	                this.pointerWasMoved = hypot(dx, dy) > pointerMoveTolerance;
	            }

	            if (!duplicateMove && (!this.pointerIsDown || this.pointerWasMoved)) {
	                if (this.pointerIsDown) {
	                    clearTimeout(this.holdTimers[pointerIndex]);
	                }

	                this.collectEventTargets(pointer, event, eventTarget, 'move');
	            }

	            if (!this.pointerIsDown) { return; }

	            if (duplicateMove && this.pointerWasMoved && !preEnd) {
	                this.checkAndPreventDefault(event, this.target, this.element);
	                return;
	            }

	            // set pointer coordinate, time changes and speeds
	            setEventDeltas(this.pointerDelta, this.prevCoords, this.curCoords);

	            if (!this.prepared.name) { return; }

	            if (this.pointerWasMoved
	                // ignore movement while inertia is active
	                && (!this.inertiaStatus.active || (pointer instanceof InteractEvent && /inertiastart/.test(pointer.type)))) {

	                // if just starting an action, calculate the pointer speed now
	                if (!this.interacting()) {
	                    setEventDeltas(this.pointerDelta, this.prevCoords, this.curCoords);

	                    // check if a drag is in the correct axis
	                    if (this.prepared.name === 'drag') {
	                        var absX = Math.abs(dx),
	                            absY = Math.abs(dy),
	                            targetAxis = this.target.options.drag.axis,
	                            axis = (absX > absY ? 'x' : absX < absY ? 'y' : 'xy');

	                        // if the movement isn't in the axis of the interactable
	                        if (axis !== 'xy' && targetAxis !== 'xy' && targetAxis !== axis) {
	                            // cancel the prepared action
	                            this.prepared.name = null;

	                            // then try to get a drag from another ineractable

	                            var element = eventTarget;

	                            // check element interactables
	                            while (isElement(element)) {
	                                var elementInteractable = interactables.get(element);

	                                if (elementInteractable
	                                    && elementInteractable !== this.target
	                                    && !elementInteractable.options.drag.manualStart
	                                    && elementInteractable.getAction(this.downPointer, this.downEvent, this, element).name === 'drag'
	                                    && checkAxis(axis, elementInteractable)) {

	                                    this.prepared.name = 'drag';
	                                    this.target = elementInteractable;
	                                    this.element = element;
	                                    break;
	                                }

	                                element = parentElement(element);
	                            }

	                            // if there's no drag from element interactables,
	                            // check the selector interactables
	                            if (!this.prepared.name) {
	                                var thisInteraction = this;

	                                var getDraggable = function (interactable, selector, context) {
	                                    var elements = ie8MatchesSelector
	                                        ? context.querySelectorAll(selector)
	                                        : undefined;

	                                    if (interactable === thisInteraction.target) { return; }

	                                    if (inContext(interactable, eventTarget)
	                                        && !interactable.options.drag.manualStart
	                                        && !testIgnore(interactable, element, eventTarget)
	                                        && testAllow(interactable, element, eventTarget)
	                                        && matchesSelector(element, selector, elements)
	                                        && interactable.getAction(thisInteraction.downPointer, thisInteraction.downEvent, thisInteraction, element).name === 'drag'
	                                        && checkAxis(axis, interactable)
	                                        && withinInteractionLimit(interactable, element, 'drag')) {

	                                        return interactable;
	                                    }
	                                };

	                                element = eventTarget;

	                                while (isElement(element)) {
	                                    var selectorInteractable = interactables.forEachSelector(getDraggable);

	                                    if (selectorInteractable) {
	                                        this.prepared.name = 'drag';
	                                        this.target = selectorInteractable;
	                                        this.element = element;
	                                        break;
	                                    }

	                                    element = parentElement(element);
	                                }
	                            }
	                        }
	                    }
	                }

	                var starting = !!this.prepared.name && !this.interacting();

	                if (starting
	                    && (this.target.options[this.prepared.name].manualStart
	                        || !withinInteractionLimit(this.target, this.element, this.prepared))) {
	                    this.stop(event);
	                    return;
	                }

	                if (this.prepared.name && this.target) {
	                    if (starting) {
	                        this.start(this.prepared, this.target, this.element);
	                    }

	                    var shouldMove = this.setModifications(this.curCoords.page, preEnd);

	                    // move if snapping or restriction doesn't prevent it
	                    if (shouldMove || starting) {
	                        this.prevEvent = this[this.prepared.name + 'Move'](event);
	                    }

	                    this.checkAndPreventDefault(event, this.target, this.element);
	                }
	            }

	            copyCoords(this.prevCoords, this.curCoords);

	            if (this.dragging || this.resizing) {
	                this.autoScrollMove(pointer);
	            }
	        },

	        dragStart: function (event) {
	            var dragEvent = new InteractEvent(this, event, 'drag', 'start', this.element);

	            this.dragging = true;
	            this.target.fire(dragEvent);

	            // reset active dropzones
	            this.activeDrops.dropzones = [];
	            this.activeDrops.elements  = [];
	            this.activeDrops.rects     = [];

	            if (!this.dynamicDrop) {
	                this.setActiveDrops(this.element);
	            }

	            var dropEvents = this.getDropEvents(event, dragEvent);

	            if (dropEvents.activate) {
	                this.fireActiveDrops(dropEvents.activate);
	            }

	            return dragEvent;
	        },

	        dragMove: function (event) {
	            var target = this.target,
	                dragEvent  = new InteractEvent(this, event, 'drag', 'move', this.element),
	                draggableElement = this.element,
	                drop = this.getDrop(dragEvent, event, draggableElement);

	            this.dropTarget = drop.dropzone;
	            this.dropElement = drop.element;

	            var dropEvents = this.getDropEvents(event, dragEvent);

	            target.fire(dragEvent);

	            if (dropEvents.leave) { this.prevDropTarget.fire(dropEvents.leave); }
	            if (dropEvents.enter) {     this.dropTarget.fire(dropEvents.enter); }
	            if (dropEvents.move ) {     this.dropTarget.fire(dropEvents.move ); }

	            this.prevDropTarget  = this.dropTarget;
	            this.prevDropElement = this.dropElement;

	            return dragEvent;
	        },

	        resizeStart: function (event) {
	            var resizeEvent = new InteractEvent(this, event, 'resize', 'start', this.element);

	            if (this.prepared.edges) {
	                var startRect = this.target.getRect(this.element);

	                /*
	                 * When using the `resizable.square` or `resizable.preserveAspectRatio` options, resizing from one edge
	                 * will affect another. E.g. with `resizable.square`, resizing to make the right edge larger will make
	                 * the bottom edge larger by the same amount. We call these 'linked' edges. Any linked edges will depend
	                 * on the active edges and the edge being interacted with.
	                 */
	                if (this.target.options.resize.square || this.target.options.resize.preserveAspectRatio) {
	                    var linkedEdges = extend({}, this.prepared.edges);

	                    linkedEdges.top    = linkedEdges.top    || (linkedEdges.left   && !linkedEdges.bottom);
	                    linkedEdges.left   = linkedEdges.left   || (linkedEdges.top    && !linkedEdges.right );
	                    linkedEdges.bottom = linkedEdges.bottom || (linkedEdges.right  && !linkedEdges.top   );
	                    linkedEdges.right  = linkedEdges.right  || (linkedEdges.bottom && !linkedEdges.left  );

	                    this.prepared._linkedEdges = linkedEdges;
	                }
	                else {
	                    this.prepared._linkedEdges = null;
	                }

	                // if using `resizable.preserveAspectRatio` option, record aspect ratio at the start of the resize
	                if (this.target.options.resize.preserveAspectRatio) {
	                    this.resizeStartAspectRatio = startRect.width / startRect.height;
	                }

	                this.resizeRects = {
	                    start     : startRect,
	                    current   : extend({}, startRect),
	                    restricted: extend({}, startRect),
	                    previous  : extend({}, startRect),
	                    delta     : {
	                        left: 0, right : 0, width : 0,
	                        top : 0, bottom: 0, height: 0
	                    }
	                };

	                resizeEvent.rect = this.resizeRects.restricted;
	                resizeEvent.deltaRect = this.resizeRects.delta;
	            }

	            this.target.fire(resizeEvent);

	            this.resizing = true;

	            return resizeEvent;
	        },

	        resizeMove: function (event) {
	            var resizeEvent = new InteractEvent(this, event, 'resize', 'move', this.element);

	            var edges = this.prepared.edges,
	                invert = this.target.options.resize.invert,
	                invertible = invert === 'reposition' || invert === 'negate';

	            if (edges) {
	                var dx = resizeEvent.dx,
	                    dy = resizeEvent.dy,

	                    start      = this.resizeRects.start,
	                    current    = this.resizeRects.current,
	                    restricted = this.resizeRects.restricted,
	                    delta      = this.resizeRects.delta,
	                    previous   = extend(this.resizeRects.previous, restricted),

	                    originalEdges = edges;

	                // `resize.preserveAspectRatio` takes precedence over `resize.square`
	                if (this.target.options.resize.preserveAspectRatio) {
	                    var resizeStartAspectRatio = this.resizeStartAspectRatio;

	                    edges = this.prepared._linkedEdges;

	                    if ((originalEdges.left && originalEdges.bottom)
	                        || (originalEdges.right && originalEdges.top)) {
	                        dy = -dx / resizeStartAspectRatio;
	                    }
	                    else if (originalEdges.left || originalEdges.right) { dy = dx / resizeStartAspectRatio; }
	                    else if (originalEdges.top || originalEdges.bottom) { dx = dy * resizeStartAspectRatio; }
	                }
	                else if (this.target.options.resize.square) {
	                    edges = this.prepared._linkedEdges;

	                    if ((originalEdges.left && originalEdges.bottom)
	                        || (originalEdges.right && originalEdges.top)) {
	                        dy = -dx;
	                    }
	                    else if (originalEdges.left || originalEdges.right) { dy = dx; }
	                    else if (originalEdges.top || originalEdges.bottom) { dx = dy; }
	                }

	                // update the 'current' rect without modifications
	                if (edges.top   ) { current.top    += dy; }
	                if (edges.bottom) { current.bottom += dy; }
	                if (edges.left  ) { current.left   += dx; }
	                if (edges.right ) { current.right  += dx; }

	                if (invertible) {
	                    // if invertible, copy the current rect
	                    extend(restricted, current);

	                    if (invert === 'reposition') {
	                        // swap edge values if necessary to keep width/height positive
	                        var swap;

	                        if (restricted.top > restricted.bottom) {
	                            swap = restricted.top;

	                            restricted.top = restricted.bottom;
	                            restricted.bottom = swap;
	                        }
	                        if (restricted.left > restricted.right) {
	                            swap = restricted.left;

	                            restricted.left = restricted.right;
	                            restricted.right = swap;
	                        }
	                    }
	                }
	                else {
	                    // if not invertible, restrict to minimum of 0x0 rect
	                    restricted.top    = Math.min(current.top, start.bottom);
	                    restricted.bottom = Math.max(current.bottom, start.top);
	                    restricted.left   = Math.min(current.left, start.right);
	                    restricted.right  = Math.max(current.right, start.left);
	                }

	                restricted.width  = restricted.right  - restricted.left;
	                restricted.height = restricted.bottom - restricted.top ;

	                for (var edge in restricted) {
	                    delta[edge] = restricted[edge] - previous[edge];
	                }

	                resizeEvent.edges = this.prepared.edges;
	                resizeEvent.rect = restricted;
	                resizeEvent.deltaRect = delta;
	            }

	            this.target.fire(resizeEvent);

	            return resizeEvent;
	        },

	        gestureStart: function (event) {
	            var gestureEvent = new InteractEvent(this, event, 'gesture', 'start', this.element);

	            gestureEvent.ds = 0;

	            this.gesture.startDistance = this.gesture.prevDistance = gestureEvent.distance;
	            this.gesture.startAngle = this.gesture.prevAngle = gestureEvent.angle;
	            this.gesture.scale = 1;

	            this.gesturing = true;

	            this.target.fire(gestureEvent);

	            return gestureEvent;
	        },

	        gestureMove: function (event) {
	            if (!this.pointerIds.length) {
	                return this.prevEvent;
	            }

	            var gestureEvent;

	            gestureEvent = new InteractEvent(this, event, 'gesture', 'move', this.element);
	            gestureEvent.ds = gestureEvent.scale - this.gesture.scale;

	            this.target.fire(gestureEvent);

	            this.gesture.prevAngle = gestureEvent.angle;
	            this.gesture.prevDistance = gestureEvent.distance;

	            if (gestureEvent.scale !== Infinity &&
	                gestureEvent.scale !== null &&
	                gestureEvent.scale !== undefined  &&
	                !isNaN(gestureEvent.scale)) {

	                this.gesture.scale = gestureEvent.scale;
	            }

	            return gestureEvent;
	        },

	        pointerHold: function (pointer, event, eventTarget) {
	            this.collectEventTargets(pointer, event, eventTarget, 'hold');
	        },

	        pointerUp: function (pointer, event, eventTarget, curEventTarget) {
	            var pointerIndex = this.mouse? 0 : indexOf(this.pointerIds, getPointerId(pointer));

	            clearTimeout(this.holdTimers[pointerIndex]);

	            this.collectEventTargets(pointer, event, eventTarget, 'up' );
	            this.collectEventTargets(pointer, event, eventTarget, 'tap');

	            this.pointerEnd(pointer, event, eventTarget, curEventTarget);

	            this.removePointer(pointer);
	        },

	        pointerCancel: function (pointer, event, eventTarget, curEventTarget) {
	            var pointerIndex = this.mouse? 0 : indexOf(this.pointerIds, getPointerId(pointer));

	            clearTimeout(this.holdTimers[pointerIndex]);

	            this.collectEventTargets(pointer, event, eventTarget, 'cancel');
	            this.pointerEnd(pointer, event, eventTarget, curEventTarget);

	            this.removePointer(pointer);
	        },

	        // http://www.quirksmode.org/dom/events/click.html
	        // >Events leading to dblclick
	        //
	        // IE8 doesn't fire down event before dblclick.
	        // This workaround tries to fire a tap and doubletap after dblclick
	        ie8Dblclick: function (pointer, event, eventTarget) {
	            if (this.prevTap
	                && event.clientX === this.prevTap.clientX
	                && event.clientY === this.prevTap.clientY
	                && eventTarget   === this.prevTap.target) {

	                this.downTargets[0] = eventTarget;
	                this.downTimes[0] = new Date().getTime();
	                this.collectEventTargets(pointer, event, eventTarget, 'tap');
	            }
	        },

	        // End interact move events and stop auto-scroll unless inertia is enabled
	        pointerEnd: function (pointer, event, eventTarget, curEventTarget) {
	            var endEvent,
	                target = this.target,
	                options = target && target.options,
	                inertiaOptions = options && this.prepared.name && options[this.prepared.name].inertia,
	                inertiaStatus = this.inertiaStatus;

	            if (this.interacting()) {

	                if (inertiaStatus.active && !inertiaStatus.ending) { return; }

	                var pointerSpeed,
	                    now = new Date().getTime(),
	                    inertiaPossible = false,
	                    inertia = false,
	                    smoothEnd = false,
	                    endSnap = checkSnap(target, this.prepared.name) && options[this.prepared.name].snap.endOnly,
	                    endRestrict = checkRestrict(target, this.prepared.name) && options[this.prepared.name].restrict.endOnly,
	                    dx = 0,
	                    dy = 0,
	                    startEvent;

	                if (this.dragging) {
	                    if      (options.drag.axis === 'x' ) { pointerSpeed = Math.abs(this.pointerDelta.client.vx); }
	                    else if (options.drag.axis === 'y' ) { pointerSpeed = Math.abs(this.pointerDelta.client.vy); }
	                    else   /*options.drag.axis === 'xy'*/{ pointerSpeed = this.pointerDelta.client.speed; }
	                }
	                else {
	                    pointerSpeed = this.pointerDelta.client.speed;
	                }

	                // check if inertia should be started
	                inertiaPossible = (inertiaOptions && inertiaOptions.enabled
	                                   && this.prepared.name !== 'gesture'
	                                   && event !== inertiaStatus.startEvent);

	                inertia = (inertiaPossible
	                           && (now - this.curCoords.timeStamp) < 50
	                           && pointerSpeed > inertiaOptions.minSpeed
	                           && pointerSpeed > inertiaOptions.endSpeed);

	                if (inertiaPossible && !inertia && (endSnap || endRestrict)) {

	                    var snapRestrict = {};

	                    snapRestrict.snap = snapRestrict.restrict = snapRestrict;

	                    if (endSnap) {
	                        this.setSnapping(this.curCoords.page, snapRestrict);
	                        if (snapRestrict.locked) {
	                            dx += snapRestrict.dx;
	                            dy += snapRestrict.dy;
	                        }
	                    }

	                    if (endRestrict) {
	                        this.setRestriction(this.curCoords.page, snapRestrict);
	                        if (snapRestrict.restricted) {
	                            dx += snapRestrict.dx;
	                            dy += snapRestrict.dy;
	                        }
	                    }

	                    if (dx || dy) {
	                        smoothEnd = true;
	                    }
	                }

	                if (inertia || smoothEnd) {
	                    copyCoords(inertiaStatus.upCoords, this.curCoords);

	                    this.pointers[0] = inertiaStatus.startEvent = startEvent =
	                        new InteractEvent(this, event, this.prepared.name, 'inertiastart', this.element);

	                    inertiaStatus.t0 = now;

	                    target.fire(inertiaStatus.startEvent);

	                    if (inertia) {
	                        inertiaStatus.vx0 = this.pointerDelta.client.vx;
	                        inertiaStatus.vy0 = this.pointerDelta.client.vy;
	                        inertiaStatus.v0 = pointerSpeed;

	                        this.calcInertia(inertiaStatus);

	                        var page = extend({}, this.curCoords.page),
	                            origin = getOriginXY(target, this.element),
	                            statusObject;

	                        page.x = page.x + inertiaStatus.xe - origin.x;
	                        page.y = page.y + inertiaStatus.ye - origin.y;

	                        statusObject = {
	                            useStatusXY: true,
	                            x: page.x,
	                            y: page.y,
	                            dx: 0,
	                            dy: 0,
	                            snap: null
	                        };

	                        statusObject.snap = statusObject;

	                        dx = dy = 0;

	                        if (endSnap) {
	                            var snap = this.setSnapping(this.curCoords.page, statusObject);

	                            if (snap.locked) {
	                                dx += snap.dx;
	                                dy += snap.dy;
	                            }
	                        }

	                        if (endRestrict) {
	                            var restrict = this.setRestriction(this.curCoords.page, statusObject);

	                            if (restrict.restricted) {
	                                dx += restrict.dx;
	                                dy += restrict.dy;
	                            }
	                        }

	                        inertiaStatus.modifiedXe += dx;
	                        inertiaStatus.modifiedYe += dy;

	                        inertiaStatus.i = reqFrame(this.boundInertiaFrame);
	                    }
	                    else {
	                        inertiaStatus.smoothEnd = true;
	                        inertiaStatus.xe = dx;
	                        inertiaStatus.ye = dy;

	                        inertiaStatus.sx = inertiaStatus.sy = 0;

	                        inertiaStatus.i = reqFrame(this.boundSmoothEndFrame);
	                    }

	                    inertiaStatus.active = true;
	                    return;
	                }

	                if (endSnap || endRestrict) {
	                    // fire a move event at the snapped coordinates
	                    this.pointerMove(pointer, event, eventTarget, curEventTarget, true);
	                }
	            }

	            if (this.dragging) {
	                endEvent = new InteractEvent(this, event, 'drag', 'end', this.element);

	                var draggableElement = this.element,
	                    drop = this.getDrop(endEvent, event, draggableElement);

	                this.dropTarget = drop.dropzone;
	                this.dropElement = drop.element;

	                var dropEvents = this.getDropEvents(event, endEvent);

	                if (dropEvents.leave) { this.prevDropTarget.fire(dropEvents.leave); }
	                if (dropEvents.enter) {     this.dropTarget.fire(dropEvents.enter); }
	                if (dropEvents.drop ) {     this.dropTarget.fire(dropEvents.drop ); }
	                if (dropEvents.deactivate) {
	                    this.fireActiveDrops(dropEvents.deactivate);
	                }

	                target.fire(endEvent);
	            }
	            else if (this.resizing) {
	                endEvent = new InteractEvent(this, event, 'resize', 'end', this.element);
	                target.fire(endEvent);
	            }
	            else if (this.gesturing) {
	                endEvent = new InteractEvent(this, event, 'gesture', 'end', this.element);
	                target.fire(endEvent);
	            }

	            this.stop(event);
	        },

	        collectDrops: function (element) {
	            var drops = [],
	                elements = [],
	                i;

	            element = element || this.element;

	            // collect all dropzones and their elements which qualify for a drop
	            for (i = 0; i < interactables.length; i++) {
	                if (!interactables[i].options.drop.enabled) { continue; }

	                var current = interactables[i],
	                    accept = current.options.drop.accept;

	                // test the draggable element against the dropzone's accept setting
	                if ((isElement(accept) && accept !== element)
	                    || (isString(accept)
	                        && !matchesSelector(element, accept))) {

	                    continue;
	                }

	                // query for new elements if necessary
	                var dropElements = current.selector? current._context.querySelectorAll(current.selector) : [current._element];

	                for (var j = 0, len = dropElements.length; j < len; j++) {
	                    var currentElement = dropElements[j];

	                    if (currentElement === element) {
	                        continue;
	                    }

	                    drops.push(current);
	                    elements.push(currentElement);
	                }
	            }

	            return {
	                dropzones: drops,
	                elements: elements
	            };
	        },

	        fireActiveDrops: function (event) {
	            var i,
	                current,
	                currentElement,
	                prevElement;

	            // loop through all active dropzones and trigger event
	            for (i = 0; i < this.activeDrops.dropzones.length; i++) {
	                current = this.activeDrops.dropzones[i];
	                currentElement = this.activeDrops.elements [i];

	                // prevent trigger of duplicate events on same element
	                if (currentElement !== prevElement) {
	                    // set current element as event target
	                    event.target = currentElement;
	                    current.fire(event);
	                }
	                prevElement = currentElement;
	            }
	        },

	        // Collect a new set of possible drops and save them in activeDrops.
	        // setActiveDrops should always be called when a drag has just started or a
	        // drag event happens while dynamicDrop is true
	        setActiveDrops: function (dragElement) {
	            // get dropzones and their elements that could receive the draggable
	            var possibleDrops = this.collectDrops(dragElement, true);

	            this.activeDrops.dropzones = possibleDrops.dropzones;
	            this.activeDrops.elements  = possibleDrops.elements;
	            this.activeDrops.rects     = [];

	            for (var i = 0; i < this.activeDrops.dropzones.length; i++) {
	                this.activeDrops.rects[i] = this.activeDrops.dropzones[i].getRect(this.activeDrops.elements[i]);
	            }
	        },

	        getDrop: function (dragEvent, event, dragElement) {
	            var validDrops = [];

	            if (dynamicDrop) {
	                this.setActiveDrops(dragElement);
	            }

	            // collect all dropzones and their elements which qualify for a drop
	            for (var j = 0; j < this.activeDrops.dropzones.length; j++) {
	                var current        = this.activeDrops.dropzones[j],
	                    currentElement = this.activeDrops.elements [j],
	                    rect           = this.activeDrops.rects    [j];

	                validDrops.push(current.dropCheck(dragEvent, event, this.target, dragElement, currentElement, rect)
	                                ? currentElement
	                                : null);
	            }

	            // get the most appropriate dropzone based on DOM depth and order
	            var dropIndex = indexOfDeepestElement(validDrops),
	                dropzone  = this.activeDrops.dropzones[dropIndex] || null,
	                element   = this.activeDrops.elements [dropIndex] || null;

	            return {
	                dropzone: dropzone,
	                element: element
	            };
	        },

	        getDropEvents: function (pointerEvent, dragEvent) {
	            var dropEvents = {
	                enter     : null,
	                leave     : null,
	                activate  : null,
	                deactivate: null,
	                move      : null,
	                drop      : null
	            };

	            if (this.dropElement !== this.prevDropElement) {
	                // if there was a prevDropTarget, create a dragleave event
	                if (this.prevDropTarget) {
	                    dropEvents.leave = {
	                        target       : this.prevDropElement,
	                        dropzone     : this.prevDropTarget,
	                        relatedTarget: dragEvent.target,
	                        draggable    : dragEvent.interactable,
	                        dragEvent    : dragEvent,
	                        interaction  : this,
	                        timeStamp    : dragEvent.timeStamp,
	                        type         : 'dragleave'
	                    };

	                    dragEvent.dragLeave = this.prevDropElement;
	                    dragEvent.prevDropzone = this.prevDropTarget;
	                }
	                // if the dropTarget is not null, create a dragenter event
	                if (this.dropTarget) {
	                    dropEvents.enter = {
	                        target       : this.dropElement,
	                        dropzone     : this.dropTarget,
	                        relatedTarget: dragEvent.target,
	                        draggable    : dragEvent.interactable,
	                        dragEvent    : dragEvent,
	                        interaction  : this,
	                        timeStamp    : dragEvent.timeStamp,
	                        type         : 'dragenter'
	                    };

	                    dragEvent.dragEnter = this.dropElement;
	                    dragEvent.dropzone = this.dropTarget;
	                }
	            }

	            if (dragEvent.type === 'dragend' && this.dropTarget) {
	                dropEvents.drop = {
	                    target       : this.dropElement,
	                    dropzone     : this.dropTarget,
	                    relatedTarget: dragEvent.target,
	                    draggable    : dragEvent.interactable,
	                    dragEvent    : dragEvent,
	                    interaction  : this,
	                    timeStamp    : dragEvent.timeStamp,
	                    type         : 'drop'
	                };

	                dragEvent.dropzone = this.dropTarget;
	            }
	            if (dragEvent.type === 'dragstart') {
	                dropEvents.activate = {
	                    target       : null,
	                    dropzone     : null,
	                    relatedTarget: dragEvent.target,
	                    draggable    : dragEvent.interactable,
	                    dragEvent    : dragEvent,
	                    interaction  : this,
	                    timeStamp    : dragEvent.timeStamp,
	                    type         : 'dropactivate'
	                };
	            }
	            if (dragEvent.type === 'dragend') {
	                dropEvents.deactivate = {
	                    target       : null,
	                    dropzone     : null,
	                    relatedTarget: dragEvent.target,
	                    draggable    : dragEvent.interactable,
	                    dragEvent    : dragEvent,
	                    interaction  : this,
	                    timeStamp    : dragEvent.timeStamp,
	                    type         : 'dropdeactivate'
	                };
	            }
	            if (dragEvent.type === 'dragmove' && this.dropTarget) {
	                dropEvents.move = {
	                    target       : this.dropElement,
	                    dropzone     : this.dropTarget,
	                    relatedTarget: dragEvent.target,
	                    draggable    : dragEvent.interactable,
	                    dragEvent    : dragEvent,
	                    interaction  : this,
	                    dragmove     : dragEvent,
	                    timeStamp    : dragEvent.timeStamp,
	                    type         : 'dropmove'
	                };
	                dragEvent.dropzone = this.dropTarget;
	            }

	            return dropEvents;
	        },

	        currentAction: function () {
	            return (this.dragging && 'drag') || (this.resizing && 'resize') || (this.gesturing && 'gesture') || null;
	        },

	        interacting: function () {
	            return this.dragging || this.resizing || this.gesturing;
	        },

	        clearTargets: function () {
	            this.target = this.element = null;

	            this.dropTarget = this.dropElement = this.prevDropTarget = this.prevDropElement = null;
	        },

	        stop: function (event) {
	            if (this.interacting()) {
	                autoScroll.stop();
	                this.matches = [];
	                this.matchElements = [];

	                var target = this.target;

	                if (target.options.styleCursor) {
	                    target._doc.documentElement.style.cursor = '';
	                }

	                // prevent Default only if were previously interacting
	                if (event && isFunction(event.preventDefault)) {
	                    this.checkAndPreventDefault(event, target, this.element);
	                }

	                if (this.dragging) {
	                    this.activeDrops.dropzones = this.activeDrops.elements = this.activeDrops.rects = null;
	                }
	            }

	            this.clearTargets();

	            this.pointerIsDown = this.snapStatus.locked = this.dragging = this.resizing = this.gesturing = false;
	            this.prepared.name = this.prevEvent = null;
	            this.inertiaStatus.resumeDx = this.inertiaStatus.resumeDy = 0;

	            // remove pointers if their ID isn't in this.pointerIds
	            for (var i = 0; i < this.pointers.length; i++) {
	                if (indexOf(this.pointerIds, getPointerId(this.pointers[i])) === -1) {
	                    this.pointers.splice(i, 1);
	                }
	            }
	        },

	        inertiaFrame: function () {
	            var inertiaStatus = this.inertiaStatus,
	                options = this.target.options[this.prepared.name].inertia,
	                lambda = options.resistance,
	                t = new Date().getTime() / 1000 - inertiaStatus.t0;

	            if (t < inertiaStatus.te) {

	                var progress =  1 - (Math.exp(-lambda * t) - inertiaStatus.lambda_v0) / inertiaStatus.one_ve_v0;

	                if (inertiaStatus.modifiedXe === inertiaStatus.xe && inertiaStatus.modifiedYe === inertiaStatus.ye) {
	                    inertiaStatus.sx = inertiaStatus.xe * progress;
	                    inertiaStatus.sy = inertiaStatus.ye * progress;
	                }
	                else {
	                    var quadPoint = getQuadraticCurvePoint(
	                            0, 0,
	                            inertiaStatus.xe, inertiaStatus.ye,
	                            inertiaStatus.modifiedXe, inertiaStatus.modifiedYe,
	                            progress);

	                    inertiaStatus.sx = quadPoint.x;
	                    inertiaStatus.sy = quadPoint.y;
	                }

	                this.pointerMove(inertiaStatus.startEvent, inertiaStatus.startEvent);

	                inertiaStatus.i = reqFrame(this.boundInertiaFrame);
	            }
	            else {
	                inertiaStatus.ending = true;

	                inertiaStatus.sx = inertiaStatus.modifiedXe;
	                inertiaStatus.sy = inertiaStatus.modifiedYe;

	                this.pointerMove(inertiaStatus.startEvent, inertiaStatus.startEvent);
	                this.pointerEnd(inertiaStatus.startEvent, inertiaStatus.startEvent);

	                inertiaStatus.active = inertiaStatus.ending = false;
	            }
	        },

	        smoothEndFrame: function () {
	            var inertiaStatus = this.inertiaStatus,
	                t = new Date().getTime() - inertiaStatus.t0,
	                duration = this.target.options[this.prepared.name].inertia.smoothEndDuration;

	            if (t < duration) {
	                inertiaStatus.sx = easeOutQuad(t, 0, inertiaStatus.xe, duration);
	                inertiaStatus.sy = easeOutQuad(t, 0, inertiaStatus.ye, duration);

	                this.pointerMove(inertiaStatus.startEvent, inertiaStatus.startEvent);

	                inertiaStatus.i = reqFrame(this.boundSmoothEndFrame);
	            }
	            else {
	                inertiaStatus.ending = true;

	                inertiaStatus.sx = inertiaStatus.xe;
	                inertiaStatus.sy = inertiaStatus.ye;

	                this.pointerMove(inertiaStatus.startEvent, inertiaStatus.startEvent);
	                this.pointerEnd(inertiaStatus.startEvent, inertiaStatus.startEvent);

	                inertiaStatus.smoothEnd =
	                  inertiaStatus.active = inertiaStatus.ending = false;
	            }
	        },

	        addPointer: function (pointer) {
	            var id = getPointerId(pointer),
	                index = this.mouse? 0 : indexOf(this.pointerIds, id);

	            if (index === -1) {
	                index = this.pointerIds.length;
	            }

	            this.pointerIds[index] = id;
	            this.pointers[index] = pointer;

	            return index;
	        },

	        removePointer: function (pointer) {
	            var id = getPointerId(pointer),
	                index = this.mouse? 0 : indexOf(this.pointerIds, id);

	            if (index === -1) { return; }

	            this.pointers   .splice(index, 1);
	            this.pointerIds .splice(index, 1);
	            this.downTargets.splice(index, 1);
	            this.downTimes  .splice(index, 1);
	            this.holdTimers .splice(index, 1);
	        },

	        recordPointer: function (pointer) {
	            var index = this.mouse? 0: indexOf(this.pointerIds, getPointerId(pointer));

	            if (index === -1) { return; }

	            this.pointers[index] = pointer;
	        },

	        collectEventTargets: function (pointer, event, eventTarget, eventType) {
	            var pointerIndex = this.mouse? 0 : indexOf(this.pointerIds, getPointerId(pointer));

	            // do not fire a tap event if the pointer was moved before being lifted
	            if (eventType === 'tap' && (this.pointerWasMoved
	                // or if the pointerup target is different to the pointerdown target
	                || !(this.downTargets[pointerIndex] && this.downTargets[pointerIndex] === eventTarget))) {
	                return;
	            }

	            var targets = [],
	                elements = [],
	                element = eventTarget;

	            function collectSelectors (interactable, selector, context) {
	                var els = ie8MatchesSelector
	                        ? context.querySelectorAll(selector)
	                        : undefined;

	                if (interactable._iEvents[eventType]
	                    && isElement(element)
	                    && inContext(interactable, element)
	                    && !testIgnore(interactable, element, eventTarget)
	                    && testAllow(interactable, element, eventTarget)
	                    && matchesSelector(element, selector, els)) {

	                    targets.push(interactable);
	                    elements.push(element);
	                }
	            }

	            while (element) {
	                if (interact.isSet(element) && interact(element)._iEvents[eventType]) {
	                    targets.push(interact(element));
	                    elements.push(element);
	                }

	                interactables.forEachSelector(collectSelectors);

	                element = parentElement(element);
	            }

	            // create the tap event even if there are no listeners so that
	            // doubletap can still be created and fired
	            if (targets.length || eventType === 'tap') {
	                this.firePointers(pointer, event, eventTarget, targets, elements, eventType);
	            }
	        },

	        firePointers: function (pointer, event, eventTarget, targets, elements, eventType) {
	            var pointerIndex = this.mouse? 0 : indexOf(this.pointerIds, getPointerId(pointer)),
	                pointerEvent = {},
	                i,
	                // for tap events
	                interval, createNewDoubleTap;

	            // if it's a doubletap then the event properties would have been
	            // copied from the tap event and provided as the pointer argument
	            if (eventType === 'doubletap') {
	                pointerEvent = pointer;
	            }
	            else {
	                pointerExtend(pointerEvent, event);
	                if (event !== pointer) {
	                    pointerExtend(pointerEvent, pointer);
	                }

	                pointerEvent.preventDefault           = preventOriginalDefault;
	                pointerEvent.stopPropagation          = InteractEvent.prototype.stopPropagation;
	                pointerEvent.stopImmediatePropagation = InteractEvent.prototype.stopImmediatePropagation;
	                pointerEvent.interaction              = this;

	                pointerEvent.timeStamp       = new Date().getTime();
	                pointerEvent.originalEvent   = event;
	                pointerEvent.originalPointer = pointer;
	                pointerEvent.type            = eventType;
	                pointerEvent.pointerId       = getPointerId(pointer);
	                pointerEvent.pointerType     = this.mouse? 'mouse' : !supportsPointerEvent? 'touch'
	                                                    : isString(pointer.pointerType)
	                                                        ? pointer.pointerType
	                                                        : [,,'touch', 'pen', 'mouse'][pointer.pointerType];
	            }

	            if (eventType === 'tap') {
	                pointerEvent.dt = pointerEvent.timeStamp - this.downTimes[pointerIndex];

	                interval = pointerEvent.timeStamp - this.tapTime;
	                createNewDoubleTap = !!(this.prevTap && this.prevTap.type !== 'doubletap'
	                       && this.prevTap.target === pointerEvent.target
	                       && interval < 500);

	                pointerEvent.double = createNewDoubleTap;

	                this.tapTime = pointerEvent.timeStamp;
	            }

	            for (i = 0; i < targets.length; i++) {
	                pointerEvent.currentTarget = elements[i];
	                pointerEvent.interactable = targets[i];
	                targets[i].fire(pointerEvent);

	                if (pointerEvent.immediatePropagationStopped
	                    ||(pointerEvent.propagationStopped && elements[i + 1] !== pointerEvent.currentTarget)) {
	                    break;
	                }
	            }

	            if (createNewDoubleTap) {
	                var doubleTap = {};

	                extend(doubleTap, pointerEvent);

	                doubleTap.dt   = interval;
	                doubleTap.type = 'doubletap';

	                this.collectEventTargets(doubleTap, event, eventTarget, 'doubletap');

	                this.prevTap = doubleTap;
	            }
	            else if (eventType === 'tap') {
	                this.prevTap = pointerEvent;
	            }
	        },

	        validateSelector: function (pointer, event, matches, matchElements) {
	            for (var i = 0, len = matches.length; i < len; i++) {
	                var match = matches[i],
	                    matchElement = matchElements[i],
	                    action = validateAction(match.getAction(pointer, event, this, matchElement), match);

	                if (action && withinInteractionLimit(match, matchElement, action)) {
	                    this.target = match;
	                    this.element = matchElement;

	                    return action;
	                }
	            }
	        },

	        setSnapping: function (pageCoords, status) {
	            var snap = this.target.options[this.prepared.name].snap,
	                targets = [],
	                target,
	                page,
	                i;

	            status = status || this.snapStatus;

	            if (status.useStatusXY) {
	                page = { x: status.x, y: status.y };
	            }
	            else {
	                var origin = getOriginXY(this.target, this.element);

	                page = extend({}, pageCoords);

	                page.x -= origin.x;
	                page.y -= origin.y;
	            }

	            status.realX = page.x;
	            status.realY = page.y;

	            page.x = page.x - this.inertiaStatus.resumeDx;
	            page.y = page.y - this.inertiaStatus.resumeDy;

	            var len = snap.targets? snap.targets.length : 0;

	            for (var relIndex = 0; relIndex < this.snapOffsets.length; relIndex++) {
	                var relative = {
	                    x: page.x - this.snapOffsets[relIndex].x,
	                    y: page.y - this.snapOffsets[relIndex].y
	                };

	                for (i = 0; i < len; i++) {
	                    if (isFunction(snap.targets[i])) {
	                        target = snap.targets[i](relative.x, relative.y, this);
	                    }
	                    else {
	                        target = snap.targets[i];
	                    }

	                    if (!target) { continue; }

	                    targets.push({
	                        x: isNumber(target.x) ? (target.x + this.snapOffsets[relIndex].x) : relative.x,
	                        y: isNumber(target.y) ? (target.y + this.snapOffsets[relIndex].y) : relative.y,

	                        range: isNumber(target.range)? target.range: snap.range
	                    });
	                }
	            }

	            var closest = {
	                    target: null,
	                    inRange: false,
	                    distance: 0,
	                    range: 0,
	                    dx: 0,
	                    dy: 0
	                };

	            for (i = 0, len = targets.length; i < len; i++) {
	                target = targets[i];

	                var range = target.range,
	                    dx = target.x - page.x,
	                    dy = target.y - page.y,
	                    distance = hypot(dx, dy),
	                    inRange = distance <= range;

	                // Infinite targets count as being out of range
	                // compared to non infinite ones that are in range
	                if (range === Infinity && closest.inRange && closest.range !== Infinity) {
	                    inRange = false;
	                }

	                if (!closest.target || (inRange
	                    // is the closest target in range?
	                    ? (closest.inRange && range !== Infinity
	                        // the pointer is relatively deeper in this target
	                        ? distance / range < closest.distance / closest.range
	                        // this target has Infinite range and the closest doesn't
	                        : (range === Infinity && closest.range !== Infinity)
	                            // OR this target is closer that the previous closest
	                            || distance < closest.distance)
	                    // The other is not in range and the pointer is closer to this target
	                    : (!closest.inRange && distance < closest.distance))) {

	                    if (range === Infinity) {
	                        inRange = true;
	                    }

	                    closest.target = target;
	                    closest.distance = distance;
	                    closest.range = range;
	                    closest.inRange = inRange;
	                    closest.dx = dx;
	                    closest.dy = dy;

	                    status.range = range;
	                }
	            }

	            var snapChanged;

	            if (closest.target) {
	                snapChanged = (status.snappedX !== closest.target.x || status.snappedY !== closest.target.y);

	                status.snappedX = closest.target.x;
	                status.snappedY = closest.target.y;
	            }
	            else {
	                snapChanged = true;

	                status.snappedX = NaN;
	                status.snappedY = NaN;
	            }

	            status.dx = closest.dx;
	            status.dy = closest.dy;

	            status.changed = (snapChanged || (closest.inRange && !status.locked));
	            status.locked = closest.inRange;

	            return status;
	        },

	        setRestriction: function (pageCoords, status) {
	            var target = this.target,
	                restrict = target && target.options[this.prepared.name].restrict,
	                restriction = restrict && restrict.restriction,
	                page;

	            if (!restriction) {
	                return status;
	            }

	            status = status || this.restrictStatus;

	            page = status.useStatusXY
	                    ? page = { x: status.x, y: status.y }
	                    : page = extend({}, pageCoords);

	            if (status.snap && status.snap.locked) {
	                page.x += status.snap.dx || 0;
	                page.y += status.snap.dy || 0;
	            }

	            page.x -= this.inertiaStatus.resumeDx;
	            page.y -= this.inertiaStatus.resumeDy;

	            status.dx = 0;
	            status.dy = 0;
	            status.restricted = false;

	            var rect, restrictedX, restrictedY;

	            if (isString(restriction)) {
	                if (restriction === 'parent') {
	                    restriction = parentElement(this.element);
	                }
	                else if (restriction === 'self') {
	                    restriction = target.getRect(this.element);
	                }
	                else {
	                    restriction = closest(this.element, restriction);
	                }

	                if (!restriction) { return status; }
	            }

	            if (isFunction(restriction)) {
	                restriction = restriction(page.x, page.y, this.element);
	            }

	            if (isElement(restriction)) {
	                restriction = getElementRect(restriction);
	            }

	            rect = restriction;

	            if (!restriction) {
	                restrictedX = page.x;
	                restrictedY = page.y;
	            }
	            // object is assumed to have
	            // x, y, width, height or
	            // left, top, right, bottom
	            else if ('x' in restriction && 'y' in restriction) {
	                restrictedX = Math.max(Math.min(rect.x + rect.width  - this.restrictOffset.right , page.x), rect.x + this.restrictOffset.left);
	                restrictedY = Math.max(Math.min(rect.y + rect.height - this.restrictOffset.bottom, page.y), rect.y + this.restrictOffset.top );
	            }
	            else {
	                restrictedX = Math.max(Math.min(rect.right  - this.restrictOffset.right , page.x), rect.left + this.restrictOffset.left);
	                restrictedY = Math.max(Math.min(rect.bottom - this.restrictOffset.bottom, page.y), rect.top  + this.restrictOffset.top );
	            }

	            status.dx = restrictedX - page.x;
	            status.dy = restrictedY - page.y;

	            status.changed = status.restrictedX !== restrictedX || status.restrictedY !== restrictedY;
	            status.restricted = !!(status.dx || status.dy);

	            status.restrictedX = restrictedX;
	            status.restrictedY = restrictedY;

	            return status;
	        },

	        checkAndPreventDefault: function (event, interactable, element) {
	            if (!(interactable = interactable || this.target)) { return; }

	            var options = interactable.options,
	                prevent = options.preventDefault;

	            if (prevent === 'auto' && element && !/^(input|select|textarea)$/i.test(event.target.nodeName)) {
	                // do not preventDefault on pointerdown if the prepared action is a drag
	                // and dragging can only start from a certain direction - this allows
	                // a touch to pan the viewport if a drag isn't in the right direction
	                if (/down|start/i.test(event.type)
	                    && this.prepared.name === 'drag' && options.drag.axis !== 'xy') {

	                    return;
	                }

	                // with manualStart, only preventDefault while interacting
	                if (options[this.prepared.name] && options[this.prepared.name].manualStart
	                    && !this.interacting()) {
	                    return;
	                }

	                event.preventDefault();
	                return;
	            }

	            if (prevent === 'always') {
	                event.preventDefault();
	                return;
	            }
	        },

	        calcInertia: function (status) {
	            var inertiaOptions = this.target.options[this.prepared.name].inertia,
	                lambda = inertiaOptions.resistance,
	                inertiaDur = -Math.log(inertiaOptions.endSpeed / status.v0) / lambda;

	            status.x0 = this.prevEvent.pageX;
	            status.y0 = this.prevEvent.pageY;
	            status.t0 = status.startEvent.timeStamp / 1000;
	            status.sx = status.sy = 0;

	            status.modifiedXe = status.xe = (status.vx0 - inertiaDur) / lambda;
	            status.modifiedYe = status.ye = (status.vy0 - inertiaDur) / lambda;
	            status.te = inertiaDur;

	            status.lambda_v0 = lambda / status.v0;
	            status.one_ve_v0 = 1 - inertiaOptions.endSpeed / status.v0;
	        },

	        autoScrollMove: function (pointer) {
	            if (!(this.interacting()
	                && checkAutoScroll(this.target, this.prepared.name))) {
	                return;
	            }

	            if (this.inertiaStatus.active) {
	                autoScroll.x = autoScroll.y = 0;
	                return;
	            }

	            var top,
	                right,
	                bottom,
	                left,
	                options = this.target.options[this.prepared.name].autoScroll,
	                container = options.container || getWindow(this.element);

	            if (isWindow(container)) {
	                left   = pointer.clientX < autoScroll.margin;
	                top    = pointer.clientY < autoScroll.margin;
	                right  = pointer.clientX > container.innerWidth  - autoScroll.margin;
	                bottom = pointer.clientY > container.innerHeight - autoScroll.margin;
	            }
	            else {
	                var rect = getElementClientRect(container);

	                left   = pointer.clientX < rect.left   + autoScroll.margin;
	                top    = pointer.clientY < rect.top    + autoScroll.margin;
	                right  = pointer.clientX > rect.right  - autoScroll.margin;
	                bottom = pointer.clientY > rect.bottom - autoScroll.margin;
	            }

	            autoScroll.x = (right ? 1: left? -1: 0);
	            autoScroll.y = (bottom? 1:  top? -1: 0);

	            if (!autoScroll.isScrolling) {
	                // set the autoScroll properties to those of the target
	                autoScroll.margin = options.margin;
	                autoScroll.speed  = options.speed;

	                autoScroll.start(this);
	            }
	        },

	        _updateEventTargets: function (target, currentTarget) {
	            this._eventTarget    = target;
	            this._curEventTarget = currentTarget;
	        }

	    };

	    function getInteractionFromPointer (pointer, eventType, eventTarget) {
	        var i = 0, len = interactions.length,
	            mouseEvent = (/mouse/i.test(pointer.pointerType || eventType)
	                          // MSPointerEvent.MSPOINTER_TYPE_MOUSE
	                          || pointer.pointerType === 4),
	            interaction;

	        var id = getPointerId(pointer);

	        // try to resume inertia with a new pointer
	        if (/down|start/i.test(eventType)) {
	            for (i = 0; i < len; i++) {
	                interaction = interactions[i];

	                var element = eventTarget;

	                if (interaction.inertiaStatus.active && interaction.target.options[interaction.prepared.name].inertia.allowResume
	                    && (interaction.mouse === mouseEvent)) {
	                    while (element) {
	                        // if the element is the interaction element
	                        if (element === interaction.element) {
	                            return interaction;
	                        }
	                        element = parentElement(element);
	                    }
	                }
	            }
	        }

	        // if it's a mouse interaction
	        if (mouseEvent || !(supportsTouch || supportsPointerEvent)) {

	            // find a mouse interaction that's not in inertia phase
	            for (i = 0; i < len; i++) {
	                if (interactions[i].mouse && !interactions[i].inertiaStatus.active) {
	                    return interactions[i];
	                }
	            }

	            // find any interaction specifically for mouse.
	            // if the eventType is a mousedown, and inertia is active
	            // ignore the interaction
	            for (i = 0; i < len; i++) {
	                if (interactions[i].mouse && !(/down/.test(eventType) && interactions[i].inertiaStatus.active)) {
	                    return interaction;
	                }
	            }

	            // create a new interaction for mouse
	            interaction = new Interaction();
	            interaction.mouse = true;

	            return interaction;
	        }

	        // get interaction that has this pointer
	        for (i = 0; i < len; i++) {
	            if (contains(interactions[i].pointerIds, id)) {
	                return interactions[i];
	            }
	        }

	        // at this stage, a pointerUp should not return an interaction
	        if (/up|end|out/i.test(eventType)) {
	            return null;
	        }

	        // get first idle interaction
	        for (i = 0; i < len; i++) {
	            interaction = interactions[i];

	            if ((!interaction.prepared.name || (interaction.target.options.gesture.enabled))
	                && !interaction.interacting()
	                && !(!mouseEvent && interaction.mouse)) {

	                return interaction;
	            }
	        }

	        return new Interaction();
	    }

	    function doOnInteractions (method) {
	        return (function (event) {
	            var interaction,
	                eventTarget = getActualElement(event.path
	                                               ? event.path[0]
	                                               : event.target),
	                curEventTarget = getActualElement(event.currentTarget),
	                i;

	            if (supportsTouch && /touch/.test(event.type)) {
	                prevTouchTime = new Date().getTime();

	                for (i = 0; i < event.changedTouches.length; i++) {
	                    var pointer = event.changedTouches[i];

	                    interaction = getInteractionFromPointer(pointer, event.type, eventTarget);

	                    if (!interaction) { continue; }

	                    interaction._updateEventTargets(eventTarget, curEventTarget);

	                    interaction[method](pointer, event, eventTarget, curEventTarget);
	                }
	            }
	            else {
	                if (!supportsPointerEvent && /mouse/.test(event.type)) {
	                    // ignore mouse events while touch interactions are active
	                    for (i = 0; i < interactions.length; i++) {
	                        if (!interactions[i].mouse && interactions[i].pointerIsDown) {
	                            return;
	                        }
	                    }

	                    // try to ignore mouse events that are simulated by the browser
	                    // after a touch event
	                    if (new Date().getTime() - prevTouchTime < 500) {
	                        return;
	                    }
	                }

	                interaction = getInteractionFromPointer(event, event.type, eventTarget);

	                if (!interaction) { return; }

	                interaction._updateEventTargets(eventTarget, curEventTarget);

	                interaction[method](event, event, eventTarget, curEventTarget);
	            }
	        });
	    }

	    function InteractEvent (interaction, event, action, phase, element, related) {
	        var client,
	            page,
	            target      = interaction.target,
	            snapStatus  = interaction.snapStatus,
	            restrictStatus  = interaction.restrictStatus,
	            pointers    = interaction.pointers,
	            deltaSource = (target && target.options || defaultOptions).deltaSource,
	            sourceX     = deltaSource + 'X',
	            sourceY     = deltaSource + 'Y',
	            options     = target? target.options: defaultOptions,
	            origin      = getOriginXY(target, element),
	            starting    = phase === 'start',
	            ending      = phase === 'end',
	            coords      = starting? interaction.startCoords : interaction.curCoords;

	        element = element || interaction.element;

	        page   = extend({}, coords.page);
	        client = extend({}, coords.client);

	        page.x -= origin.x;
	        page.y -= origin.y;

	        client.x -= origin.x;
	        client.y -= origin.y;

	        var relativePoints = options[action].snap && options[action].snap.relativePoints ;

	        if (checkSnap(target, action) && !(starting && relativePoints && relativePoints.length)) {
	            this.snap = {
	                range  : snapStatus.range,
	                locked : snapStatus.locked,
	                x      : snapStatus.snappedX,
	                y      : snapStatus.snappedY,
	                realX  : snapStatus.realX,
	                realY  : snapStatus.realY,
	                dx     : snapStatus.dx,
	                dy     : snapStatus.dy
	            };

	            if (snapStatus.locked) {
	                page.x += snapStatus.dx;
	                page.y += snapStatus.dy;
	                client.x += snapStatus.dx;
	                client.y += snapStatus.dy;
	            }
	        }

	        if (checkRestrict(target, action) && !(starting && options[action].restrict.elementRect) && restrictStatus.restricted) {
	            page.x += restrictStatus.dx;
	            page.y += restrictStatus.dy;
	            client.x += restrictStatus.dx;
	            client.y += restrictStatus.dy;

	            this.restrict = {
	                dx: restrictStatus.dx,
	                dy: restrictStatus.dy
	            };
	        }

	        this.pageX     = page.x;
	        this.pageY     = page.y;
	        this.clientX   = client.x;
	        this.clientY   = client.y;

	        this.x0        = interaction.startCoords.page.x - origin.x;
	        this.y0        = interaction.startCoords.page.y - origin.y;
	        this.clientX0  = interaction.startCoords.client.x - origin.x;
	        this.clientY0  = interaction.startCoords.client.y - origin.y;
	        this.ctrlKey   = event.ctrlKey;
	        this.altKey    = event.altKey;
	        this.shiftKey  = event.shiftKey;
	        this.metaKey   = event.metaKey;
	        this.button    = event.button;
	        this.buttons   = event.buttons;
	        this.target    = element;
	        this.t0        = interaction.downTimes[0];
	        this.type      = action + (phase || '');

	        this.interaction = interaction;
	        this.interactable = target;

	        var inertiaStatus = interaction.inertiaStatus;

	        if (inertiaStatus.active) {
	            this.detail = 'inertia';
	        }

	        if (related) {
	            this.relatedTarget = related;
	        }

	        // end event dx, dy is difference between start and end points
	        if (ending) {
	            if (deltaSource === 'client') {
	                this.dx = client.x - interaction.startCoords.client.x;
	                this.dy = client.y - interaction.startCoords.client.y;
	            }
	            else {
	                this.dx = page.x - interaction.startCoords.page.x;
	                this.dy = page.y - interaction.startCoords.page.y;
	            }
	        }
	        else if (starting) {
	            this.dx = 0;
	            this.dy = 0;
	        }
	        // copy properties from previousmove if starting inertia
	        else if (phase === 'inertiastart') {
	            this.dx = interaction.prevEvent.dx;
	            this.dy = interaction.prevEvent.dy;
	        }
	        else {
	            if (deltaSource === 'client') {
	                this.dx = client.x - interaction.prevEvent.clientX;
	                this.dy = client.y - interaction.prevEvent.clientY;
	            }
	            else {
	                this.dx = page.x - interaction.prevEvent.pageX;
	                this.dy = page.y - interaction.prevEvent.pageY;
	            }
	        }
	        if (interaction.prevEvent && interaction.prevEvent.detail === 'inertia'
	            && !inertiaStatus.active
	            && options[action].inertia && options[action].inertia.zeroResumeDelta) {

	            inertiaStatus.resumeDx += this.dx;
	            inertiaStatus.resumeDy += this.dy;

	            this.dx = this.dy = 0;
	        }

	        if (action === 'resize' && interaction.resizeAxes) {
	            if (options.resize.square) {
	                if (interaction.resizeAxes === 'y') {
	                    this.dx = this.dy;
	                }
	                else {
	                    this.dy = this.dx;
	                }
	                this.axes = 'xy';
	            }
	            else {
	                this.axes = interaction.resizeAxes;

	                if (interaction.resizeAxes === 'x') {
	                    this.dy = 0;
	                }
	                else if (interaction.resizeAxes === 'y') {
	                    this.dx = 0;
	                }
	            }
	        }
	        else if (action === 'gesture') {
	            this.touches = [pointers[0], pointers[1]];

	            if (starting) {
	                this.distance = touchDistance(pointers, deltaSource);
	                this.box      = touchBBox(pointers);
	                this.scale    = 1;
	                this.ds       = 0;
	                this.angle    = touchAngle(pointers, undefined, deltaSource);
	                this.da       = 0;
	            }
	            else if (ending || event instanceof InteractEvent) {
	                this.distance = interaction.prevEvent.distance;
	                this.box      = interaction.prevEvent.box;
	                this.scale    = interaction.prevEvent.scale;
	                this.ds       = this.scale - 1;
	                this.angle    = interaction.prevEvent.angle;
	                this.da       = this.angle - interaction.gesture.startAngle;
	            }
	            else {
	                this.distance = touchDistance(pointers, deltaSource);
	                this.box      = touchBBox(pointers);
	                this.scale    = this.distance / interaction.gesture.startDistance;
	                this.angle    = touchAngle(pointers, interaction.gesture.prevAngle, deltaSource);

	                this.ds = this.scale - interaction.gesture.prevScale;
	                this.da = this.angle - interaction.gesture.prevAngle;
	            }
	        }

	        if (starting) {
	            this.timeStamp = interaction.downTimes[0];
	            this.dt        = 0;
	            this.duration  = 0;
	            this.speed     = 0;
	            this.velocityX = 0;
	            this.velocityY = 0;
	        }
	        else if (phase === 'inertiastart') {
	            this.timeStamp = interaction.prevEvent.timeStamp;
	            this.dt        = interaction.prevEvent.dt;
	            this.duration  = interaction.prevEvent.duration;
	            this.speed     = interaction.prevEvent.speed;
	            this.velocityX = interaction.prevEvent.velocityX;
	            this.velocityY = interaction.prevEvent.velocityY;
	        }
	        else {
	            this.timeStamp = new Date().getTime();
	            this.dt        = this.timeStamp - interaction.prevEvent.timeStamp;
	            this.duration  = this.timeStamp - interaction.downTimes[0];

	            if (event instanceof InteractEvent) {
	                var dx = this[sourceX] - interaction.prevEvent[sourceX],
	                    dy = this[sourceY] - interaction.prevEvent[sourceY],
	                    dt = this.dt / 1000;

	                this.speed = hypot(dx, dy) / dt;
	                this.velocityX = dx / dt;
	                this.velocityY = dy / dt;
	            }
	            // if normal move or end event, use previous user event coords
	            else {
	                // speed and velocity in pixels per second
	                this.speed = interaction.pointerDelta[deltaSource].speed;
	                this.velocityX = interaction.pointerDelta[deltaSource].vx;
	                this.velocityY = interaction.pointerDelta[deltaSource].vy;
	            }
	        }

	        if ((ending || phase === 'inertiastart')
	            && interaction.prevEvent.speed > 600 && this.timeStamp - interaction.prevEvent.timeStamp < 150) {

	            var angle = 180 * Math.atan2(interaction.prevEvent.velocityY, interaction.prevEvent.velocityX) / Math.PI,
	                overlap = 22.5;

	            if (angle < 0) {
	                angle += 360;
	            }

	            var left = 135 - overlap <= angle && angle < 225 + overlap,
	                up   = 225 - overlap <= angle && angle < 315 + overlap,

	                right = !left && (315 - overlap <= angle || angle <  45 + overlap),
	                down  = !up   &&   45 - overlap <= angle && angle < 135 + overlap;

	            this.swipe = {
	                up   : up,
	                down : down,
	                left : left,
	                right: right,
	                angle: angle,
	                speed: interaction.prevEvent.speed,
	                velocity: {
	                    x: interaction.prevEvent.velocityX,
	                    y: interaction.prevEvent.velocityY
	                }
	            };
	        }
	    }

	    InteractEvent.prototype = {
	        preventDefault: blank,
	        stopImmediatePropagation: function () {
	            this.immediatePropagationStopped = this.propagationStopped = true;
	        },
	        stopPropagation: function () {
	            this.propagationStopped = true;
	        }
	    };

	    function preventOriginalDefault () {
	        this.originalEvent.preventDefault();
	    }

	    function getActionCursor (action) {
	        var cursor = '';

	        if (action.name === 'drag') {
	            cursor =  actionCursors.drag;
	        }
	        if (action.name === 'resize') {
	            if (action.axis) {
	                cursor =  actionCursors[action.name + action.axis];
	            }
	            else if (action.edges) {
	                var cursorKey = 'resize',
	                    edgeNames = ['top', 'bottom', 'left', 'right'];

	                for (var i = 0; i < 4; i++) {
	                    if (action.edges[edgeNames[i]]) {
	                        cursorKey += edgeNames[i];
	                    }
	                }

	                cursor = actionCursors[cursorKey];
	            }
	        }

	        return cursor;
	    }

	    function checkResizeEdge (name, value, page, element, interactableElement, rect, margin) {
	        // false, '', undefined, null
	        if (!value) { return false; }

	        // true value, use pointer coords and element rect
	        if (value === true) {
	            // if dimensions are negative, "switch" edges
	            var width = isNumber(rect.width)? rect.width : rect.right - rect.left,
	                height = isNumber(rect.height)? rect.height : rect.bottom - rect.top;

	            if (width < 0) {
	                if      (name === 'left' ) { name = 'right'; }
	                else if (name === 'right') { name = 'left' ; }
	            }
	            if (height < 0) {
	                if      (name === 'top'   ) { name = 'bottom'; }
	                else if (name === 'bottom') { name = 'top'   ; }
	            }

	            if (name === 'left'  ) { return page.x < ((width  >= 0? rect.left: rect.right ) + margin); }
	            if (name === 'top'   ) { return page.y < ((height >= 0? rect.top : rect.bottom) + margin); }

	            if (name === 'right' ) { return page.x > ((width  >= 0? rect.right : rect.left) - margin); }
	            if (name === 'bottom') { return page.y > ((height >= 0? rect.bottom: rect.top ) - margin); }
	        }

	        // the remaining checks require an element
	        if (!isElement(element)) { return false; }

	        return isElement(value)
	                    // the value is an element to use as a resize handle
	                    ? value === element
	                    // otherwise check if element matches value as selector
	                    : matchesUpTo(element, value, interactableElement);
	    }

	    function defaultActionChecker (pointer, interaction, element) {
	        var rect = this.getRect(element),
	            shouldResize = false,
	            action = null,
	            resizeAxes = null,
	            resizeEdges,
	            page = extend({}, interaction.curCoords.page),
	            options = this.options;

	        if (!rect) { return null; }

	        if (actionIsEnabled.resize && options.resize.enabled) {
	            var resizeOptions = options.resize;

	            resizeEdges = {
	                left: false, right: false, top: false, bottom: false
	            };

	            // if using resize.edges
	            if (isObject(resizeOptions.edges)) {
	                for (var edge in resizeEdges) {
	                    resizeEdges[edge] = checkResizeEdge(edge,
	                                                        resizeOptions.edges[edge],
	                                                        page,
	                                                        interaction._eventTarget,
	                                                        element,
	                                                        rect,
	                                                        resizeOptions.margin || margin);
	                }

	                resizeEdges.left = resizeEdges.left && !resizeEdges.right;
	                resizeEdges.top  = resizeEdges.top  && !resizeEdges.bottom;

	                shouldResize = resizeEdges.left || resizeEdges.right || resizeEdges.top || resizeEdges.bottom;
	            }
	            else {
	                var right  = options.resize.axis !== 'y' && page.x > (rect.right  - margin),
	                    bottom = options.resize.axis !== 'x' && page.y > (rect.bottom - margin);

	                shouldResize = right || bottom;
	                resizeAxes = (right? 'x' : '') + (bottom? 'y' : '');
	            }
	        }

	        action = shouldResize
	            ? 'resize'
	            : actionIsEnabled.drag && options.drag.enabled
	                ? 'drag'
	                : null;

	        if (actionIsEnabled.gesture
	            && interaction.pointerIds.length >=2
	            && !(interaction.dragging || interaction.resizing)) {
	            action = 'gesture';
	        }

	        if (action) {
	            return {
	                name: action,
	                axis: resizeAxes,
	                edges: resizeEdges
	            };
	        }

	        return null;
	    }

	    // Check if action is enabled globally and the current target supports it
	    // If so, return the validated action. Otherwise, return null
	    function validateAction (action, interactable) {
	        if (!isObject(action)) { return null; }

	        var actionName = action.name,
	            options = interactable.options;

	        if ((  (actionName  === 'resize'   && options.resize.enabled )
	            || (actionName      === 'drag'     && options.drag.enabled  )
	            || (actionName      === 'gesture'  && options.gesture.enabled))
	            && actionIsEnabled[actionName]) {

	            if (actionName === 'resize' || actionName === 'resizeyx') {
	                actionName = 'resizexy';
	            }

	            return action;
	        }
	        return null;
	    }

	    var listeners = {},
	        interactionListeners = [
	            'dragStart', 'dragMove', 'resizeStart', 'resizeMove', 'gestureStart', 'gestureMove',
	            'pointerOver', 'pointerOut', 'pointerHover', 'selectorDown',
	            'pointerDown', 'pointerMove', 'pointerUp', 'pointerCancel', 'pointerEnd',
	            'addPointer', 'removePointer', 'recordPointer', 'autoScrollMove'
	        ];

	    for (var i = 0, len = interactionListeners.length; i < len; i++) {
	        var name = interactionListeners[i];

	        listeners[name] = doOnInteractions(name);
	    }

	    // bound to the interactable context when a DOM event
	    // listener is added to a selector interactable
	    function delegateListener (event, useCapture) {
	        var fakeEvent = {},
	            delegated = delegatedEvents[event.type],
	            eventTarget = getActualElement(event.path
	                                           ? event.path[0]
	                                           : event.target),
	            element = eventTarget;

	        useCapture = useCapture? true: false;

	        // duplicate the event so that currentTarget can be changed
	        for (var prop in event) {
	            fakeEvent[prop] = event[prop];
	        }

	        fakeEvent.originalEvent = event;
	        fakeEvent.preventDefault = preventOriginalDefault;

	        // climb up document tree looking for selector matches
	        while (isElement(element)) {
	            for (var i = 0; i < delegated.selectors.length; i++) {
	                var selector = delegated.selectors[i],
	                    context = delegated.contexts[i];

	                if (matchesSelector(element, selector)
	                    && nodeContains(context, eventTarget)
	                    && nodeContains(context, element)) {

	                    var listeners = delegated.listeners[i];

	                    fakeEvent.currentTarget = element;

	                    for (var j = 0; j < listeners.length; j++) {
	                        if (listeners[j][1] === useCapture) {
	                            listeners[j][0](fakeEvent);
	                        }
	                    }
	                }
	            }

	            element = parentElement(element);
	        }
	    }

	    function delegateUseCapture (event) {
	        return delegateListener.call(this, event, true);
	    }

	    interactables.indexOfElement = function indexOfElement (element, context) {
	        context = context || document;

	        for (var i = 0; i < this.length; i++) {
	            var interactable = this[i];

	            if ((interactable.selector === element
	                && (interactable._context === context))
	                || (!interactable.selector && interactable._element === element)) {

	                return i;
	            }
	        }
	        return -1;
	    };

	    interactables.get = function interactableGet (element, options) {
	        return this[this.indexOfElement(element, options && options.context)];
	    };

	    interactables.forEachSelector = function (callback) {
	        for (var i = 0; i < this.length; i++) {
	            var interactable = this[i];

	            if (!interactable.selector) {
	                continue;
	            }

	            var ret = callback(interactable, interactable.selector, interactable._context, i, this);

	            if (ret !== undefined) {
	                return ret;
	            }
	        }
	    };

	    /*\
	     * interact
	     [ method ]
	     *
	     * The methods of this variable can be used to set elements as
	     * interactables and also to change various default settings.
	     *
	     * Calling it as a function and passing an element or a valid CSS selector
	     * string returns an Interactable object which has various methods to
	     * configure it.
	     *
	     - element (Element | string) The HTML or SVG Element to interact with or CSS selector
	     = (object) An @Interactable
	     *
	     > Usage
	     | interact(document.getElementById('draggable')).draggable(true);
	     |
	     | var rectables = interact('rect');
	     | rectables
	     |     .gesturable(true)
	     |     .on('gesturemove', function (event) {
	     |         // something cool...
	     |     })
	     |     .autoScroll(true);
	    \*/
	    function interact (element, options) {
	        return interactables.get(element, options) || new Interactable(element, options);
	    }

	    /*\
	     * Interactable
	     [ property ]
	     **
	     * Object type returned by @interact
	    \*/
	    function Interactable (element, options) {
	        this._element = element;
	        this._iEvents = this._iEvents || {};

	        var _window;

	        if (trySelector(element)) {
	            this.selector = element;

	            var context = options && options.context;

	            _window = context? getWindow(context) : window;

	            if (context && (_window.Node
	                    ? context instanceof _window.Node
	                    : (isElement(context) || context === _window.document))) {

	                this._context = context;
	            }
	        }
	        else {
	            _window = getWindow(element);

	            if (isElement(element, _window)) {

	                if (PointerEvent) {
	                    events.add(this._element, pEventTypes.down, listeners.pointerDown );
	                    events.add(this._element, pEventTypes.move, listeners.pointerHover);
	                }
	                else {
	                    events.add(this._element, 'mousedown' , listeners.pointerDown );
	                    events.add(this._element, 'mousemove' , listeners.pointerHover);
	                    events.add(this._element, 'touchstart', listeners.pointerDown );
	                    events.add(this._element, 'touchmove' , listeners.pointerHover);
	                }
	            }
	        }

	        this._doc = _window.document;

	        if (!contains(documents, this._doc)) {
	            listenToDocument(this._doc);
	        }

	        interactables.push(this);

	        this.set(options);
	    }

	    Interactable.prototype = {
	        setOnEvents: function (action, phases) {
	            if (action === 'drop') {
	                if (isFunction(phases.ondrop)          ) { this.ondrop           = phases.ondrop          ; }
	                if (isFunction(phases.ondropactivate)  ) { this.ondropactivate   = phases.ondropactivate  ; }
	                if (isFunction(phases.ondropdeactivate)) { this.ondropdeactivate = phases.ondropdeactivate; }
	                if (isFunction(phases.ondragenter)     ) { this.ondragenter      = phases.ondragenter     ; }
	                if (isFunction(phases.ondragleave)     ) { this.ondragleave      = phases.ondragleave     ; }
	                if (isFunction(phases.ondropmove)      ) { this.ondropmove       = phases.ondropmove      ; }
	            }
	            else {
	                action = 'on' + action;

	                if (isFunction(phases.onstart)       ) { this[action + 'start'         ] = phases.onstart         ; }
	                if (isFunction(phases.onmove)        ) { this[action + 'move'          ] = phases.onmove          ; }
	                if (isFunction(phases.onend)         ) { this[action + 'end'           ] = phases.onend           ; }
	                if (isFunction(phases.oninertiastart)) { this[action + 'inertiastart'  ] = phases.oninertiastart  ; }
	            }

	            return this;
	        },

	        /*\
	         * Interactable.draggable
	         [ method ]
	         *
	         * Gets or sets whether drag actions can be performed on the
	         * Interactable
	         *
	         = (boolean) Indicates if this can be the target of drag events
	         | var isDraggable = interact('ul li').draggable();
	         * or
	         - options (boolean | object) #optional true/false or An object with event listeners to be fired on drag events (object makes the Interactable draggable)
	         = (object) This Interactable
	         | interact(element).draggable({
	         |     onstart: function (event) {},
	         |     onmove : function (event) {},
	         |     onend  : function (event) {},
	         |
	         |     // the axis in which the first movement must be
	         |     // for the drag sequence to start
	         |     // 'xy' by default - any direction
	         |     axis: 'x' || 'y' || 'xy',
	         |
	         |     // max number of drags that can happen concurrently
	         |     // with elements of this Interactable. Infinity by default
	         |     max: Infinity,
	         |
	         |     // max number of drags that can target the same element+Interactable
	         |     // 1 by default
	         |     maxPerElement: 2
	         | });
	        \*/
	        draggable: function (options) {
	            if (isObject(options)) {
	                this.options.drag.enabled = options.enabled === false? false: true;
	                this.setPerAction('drag', options);
	                this.setOnEvents('drag', options);

	                if (/^x$|^y$|^xy$/.test(options.axis)) {
	                    this.options.drag.axis = options.axis;
	                }
	                else if (options.axis === null) {
	                    delete this.options.drag.axis;
	                }

	                return this;
	            }

	            if (isBool(options)) {
	                this.options.drag.enabled = options;

	                return this;
	            }

	            return this.options.drag;
	        },

	        setPerAction: function (action, options) {
	            // for all the default per-action options
	            for (var option in options) {
	                // if this option exists for this action
	                if (option in defaultOptions[action]) {
	                    // if the option in the options arg is an object value
	                    if (isObject(options[option])) {
	                        // duplicate the object
	                        this.options[action][option] = extend(this.options[action][option] || {}, options[option]);

	                        if (isObject(defaultOptions.perAction[option]) && 'enabled' in defaultOptions.perAction[option]) {
	                            this.options[action][option].enabled = options[option].enabled === false? false : true;
	                        }
	                    }
	                    else if (isBool(options[option]) && isObject(defaultOptions.perAction[option])) {
	                        this.options[action][option].enabled = options[option];
	                    }
	                    else if (options[option] !== undefined) {
	                        // or if it's not undefined, do a plain assignment
	                        this.options[action][option] = options[option];
	                    }
	                }
	            }
	        },

	        /*\
	         * Interactable.dropzone
	         [ method ]
	         *
	         * Returns or sets whether elements can be dropped onto this
	         * Interactable to trigger drop events
	         *
	         * Dropzones can receive the following events:
	         *  - `dropactivate` and `dropdeactivate` when an acceptable drag starts and ends
	         *  - `dragenter` and `dragleave` when a draggable enters and leaves the dropzone
	         *  - `dragmove` when a draggable that has entered the dropzone is moved
	         *  - `drop` when a draggable is dropped into this dropzone
	         *
	         *  Use the `accept` option to allow only elements that match the given CSS selector or element.
	         *
	         *  Use the `overlap` option to set how drops are checked for. The allowed values are:
	         *   - `'pointer'`, the pointer must be over the dropzone (default)
	         *   - `'center'`, the draggable element's center must be over the dropzone
	         *   - a number from 0-1 which is the `(intersection area) / (draggable area)`.
	         *       e.g. `0.5` for drop to happen when half of the area of the
	         *       draggable is over the dropzone
	         *
	         - options (boolean | object | null) #optional The new value to be set.
	         | interact('.drop').dropzone({
	         |   accept: '.can-drop' || document.getElementById('single-drop'),
	         |   overlap: 'pointer' || 'center' || zeroToOne
	         | }
	         = (boolean | object) The current setting or this Interactable
	        \*/
	        dropzone: function (options) {
	            if (isObject(options)) {
	                this.options.drop.enabled = options.enabled === false? false: true;
	                this.setOnEvents('drop', options);

	                if (/^(pointer|center)$/.test(options.overlap)) {
	                    this.options.drop.overlap = options.overlap;
	                }
	                else if (isNumber(options.overlap)) {
	                    this.options.drop.overlap = Math.max(Math.min(1, options.overlap), 0);
	                }
	                if ('accept' in options) {
	                  this.options.drop.accept = options.accept;
	                }
	                if ('checker' in options) {
	                  this.options.drop.checker = options.checker;
	                }

	                return this;
	            }

	            if (isBool(options)) {
	                this.options.drop.enabled = options;

	                return this;
	            }

	            return this.options.drop;
	        },

	        dropCheck: function (dragEvent, event, draggable, draggableElement, dropElement, rect) {
	            var dropped = false;

	            // if the dropzone has no rect (eg. display: none)
	            // call the custom dropChecker or just return false
	            if (!(rect = rect || this.getRect(dropElement))) {
	                return (this.options.drop.checker
	                    ? this.options.drop.checker(dragEvent, event, dropped, this, dropElement, draggable, draggableElement)
	                    : false);
	            }

	            var dropOverlap = this.options.drop.overlap;

	            if (dropOverlap === 'pointer') {
	                var page = getPageXY(dragEvent),
	                    origin = getOriginXY(draggable, draggableElement),
	                    horizontal,
	                    vertical;

	                page.x += origin.x;
	                page.y += origin.y;

	                horizontal = (page.x > rect.left) && (page.x < rect.right);
	                vertical   = (page.y > rect.top ) && (page.y < rect.bottom);

	                dropped = horizontal && vertical;
	            }

	            var dragRect = draggable.getRect(draggableElement);

	            if (dropOverlap === 'center') {
	                var cx = dragRect.left + dragRect.width  / 2,
	                    cy = dragRect.top  + dragRect.height / 2;

	                dropped = cx >= rect.left && cx <= rect.right && cy >= rect.top && cy <= rect.bottom;
	            }

	            if (isNumber(dropOverlap)) {
	                var overlapArea  = (Math.max(0, Math.min(rect.right , dragRect.right ) - Math.max(rect.left, dragRect.left))
	                                  * Math.max(0, Math.min(rect.bottom, dragRect.bottom) - Math.max(rect.top , dragRect.top ))),
	                    overlapRatio = overlapArea / (dragRect.width * dragRect.height);

	                dropped = overlapRatio >= dropOverlap;
	            }

	            if (this.options.drop.checker) {
	                dropped = this.options.drop.checker(dragEvent, event, dropped, this, dropElement, draggable, draggableElement);
	            }

	            return dropped;
	        },

	        /*\
	         * Interactable.dropChecker
	         [ method ]
	         *
	         * DEPRECATED. Use interactable.dropzone({ checker: function... }) instead.
	         *
	         * Gets or sets the function used to check if a dragged element is
	         * over this Interactable.
	         *
	         - checker (function) #optional The function that will be called when checking for a drop
	         = (Function | Interactable) The checker function or this Interactable
	         *
	         * The checker function takes the following arguments:
	         *
	         - dragEvent (InteractEvent) The related dragmove or dragend event
	         - event (TouchEvent | PointerEvent | MouseEvent) The user move/up/end Event related to the dragEvent
	         - dropped (boolean) The value from the default drop checker
	         - dropzone (Interactable) The dropzone interactable
	         - dropElement (Element) The dropzone element
	         - draggable (Interactable) The Interactable being dragged
	         - draggableElement (Element) The actual element that's being dragged
	         *
	         > Usage:
	         | interact(target)
	         | .dropChecker(function(dragEvent,         // related dragmove or dragend event
	         |                       event,             // TouchEvent/PointerEvent/MouseEvent
	         |                       dropped,           // bool result of the default checker
	         |                       dropzone,          // dropzone Interactable
	         |                       dropElement,       // dropzone elemnt
	         |                       draggable,         // draggable Interactable
	         |                       draggableElement) {// draggable element
	         |
	         |   return dropped && event.target.hasAttribute('allow-drop');
	         | }
	        \*/
	        dropChecker: function (checker) {
	            if (isFunction(checker)) {
	                this.options.drop.checker = checker;

	                return this;
	            }
	            if (checker === null) {
	                delete this.options.getRect;

	                return this;
	            }

	            return this.options.drop.checker;
	        },

	        /*\
	         * Interactable.accept
	         [ method ]
	         *
	         * Deprecated. add an `accept` property to the options object passed to
	         * @Interactable.dropzone instead.
	         *
	         * Gets or sets the Element or CSS selector match that this
	         * Interactable accepts if it is a dropzone.
	         *
	         - newValue (Element | string | null) #optional
	         * If it is an Element, then only that element can be dropped into this dropzone.
	         * If it is a string, the element being dragged must match it as a selector.
	         * If it is null, the accept options is cleared - it accepts any element.
	         *
	         = (string | Element | null | Interactable) The current accept option if given `undefined` or this Interactable
	        \*/
	        accept: function (newValue) {
	            if (isElement(newValue)) {
	                this.options.drop.accept = newValue;

	                return this;
	            }

	            // test if it is a valid CSS selector
	            if (trySelector(newValue)) {
	                this.options.drop.accept = newValue;

	                return this;
	            }

	            if (newValue === null) {
	                delete this.options.drop.accept;

	                return this;
	            }

	            return this.options.drop.accept;
	        },

	        /*\
	         * Interactable.resizable
	         [ method ]
	         *
	         * Gets or sets whether resize actions can be performed on the
	         * Interactable
	         *
	         = (boolean) Indicates if this can be the target of resize elements
	         | var isResizeable = interact('input[type=text]').resizable();
	         * or
	         - options (boolean | object) #optional true/false or An object with event listeners to be fired on resize events (object makes the Interactable resizable)
	         = (object) This Interactable
	         | interact(element).resizable({
	         |     onstart: function (event) {},
	         |     onmove : function (event) {},
	         |     onend  : function (event) {},
	         |
	         |     edges: {
	         |       top   : true,       // Use pointer coords to check for resize.
	         |       left  : false,      // Disable resizing from left edge.
	         |       bottom: '.resize-s',// Resize if pointer target matches selector
	         |       right : handleEl    // Resize if pointer target is the given Element
	         |     },
	         |
	         |     // Width and height can be adjusted independently. When `true`, width and
	         |     // height are adjusted at a 1:1 ratio.
	         |     square: false,
	         |
	         |     // Width and height can be adjusted independently. When `true`, width and
	         |     // height maintain the aspect ratio they had when resizing started.
	         |     preserveAspectRatio: false,
	         |
	         |     // a value of 'none' will limit the resize rect to a minimum of 0x0
	         |     // 'negate' will allow the rect to have negative width/height
	         |     // 'reposition' will keep the width/height positive by swapping
	         |     // the top and bottom edges and/or swapping the left and right edges
	         |     invert: 'none' || 'negate' || 'reposition'
	         |
	         |     // limit multiple resizes.
	         |     // See the explanation in the @Interactable.draggable example
	         |     max: Infinity,
	         |     maxPerElement: 1,
	         | });
	        \*/
	        resizable: function (options) {
	            if (isObject(options)) {
	                this.options.resize.enabled = options.enabled === false? false: true;
	                this.setPerAction('resize', options);
	                this.setOnEvents('resize', options);

	                if (/^x$|^y$|^xy$/.test(options.axis)) {
	                    this.options.resize.axis = options.axis;
	                }
	                else if (options.axis === null) {
	                    this.options.resize.axis = defaultOptions.resize.axis;
	                }

	                if (isBool(options.preserveAspectRatio)) {
	                    this.options.resize.preserveAspectRatio = options.preserveAspectRatio;
	                }
	                else if (isBool(options.square)) {
	                    this.options.resize.square = options.square;
	                }

	                return this;
	            }
	            if (isBool(options)) {
	                this.options.resize.enabled = options;

	                return this;
	            }
	            return this.options.resize;
	        },

	        /*\
	         * Interactable.squareResize
	         [ method ]
	         *
	         * Deprecated. Add a `square: true || false` property to @Interactable.resizable instead
	         *
	         * Gets or sets whether resizing is forced 1:1 aspect
	         *
	         = (boolean) Current setting
	         *
	         * or
	         *
	         - newValue (boolean) #optional
	         = (object) this Interactable
	        \*/
	        squareResize: function (newValue) {
	            if (isBool(newValue)) {
	                this.options.resize.square = newValue;

	                return this;
	            }

	            if (newValue === null) {
	                delete this.options.resize.square;

	                return this;
	            }

	            return this.options.resize.square;
	        },

	        /*\
	         * Interactable.gesturable
	         [ method ]
	         *
	         * Gets or sets whether multitouch gestures can be performed on the
	         * Interactable's element
	         *
	         = (boolean) Indicates if this can be the target of gesture events
	         | var isGestureable = interact(element).gesturable();
	         * or
	         - options (boolean | object) #optional true/false or An object with event listeners to be fired on gesture events (makes the Interactable gesturable)
	         = (object) this Interactable
	         | interact(element).gesturable({
	         |     onstart: function (event) {},
	         |     onmove : function (event) {},
	         |     onend  : function (event) {},
	         |
	         |     // limit multiple gestures.
	         |     // See the explanation in @Interactable.draggable example
	         |     max: Infinity,
	         |     maxPerElement: 1,
	         | });
	        \*/
	        gesturable: function (options) {
	            if (isObject(options)) {
	                this.options.gesture.enabled = options.enabled === false? false: true;
	                this.setPerAction('gesture', options);
	                this.setOnEvents('gesture', options);

	                return this;
	            }

	            if (isBool(options)) {
	                this.options.gesture.enabled = options;

	                return this;
	            }

	            return this.options.gesture;
	        },

	        /*\
	         * Interactable.autoScroll
	         [ method ]
	         **
	         * Deprecated. Add an `autoscroll` property to the options object
	         * passed to @Interactable.draggable or @Interactable.resizable instead.
	         *
	         * Returns or sets whether dragging and resizing near the edges of the
	         * window/container trigger autoScroll for this Interactable
	         *
	         = (object) Object with autoScroll properties
	         *
	         * or
	         *
	         - options (object | boolean) #optional
	         * options can be:
	         * - an object with margin, distance and interval properties,
	         * - true or false to enable or disable autoScroll or
	         = (Interactable) this Interactable
	        \*/
	        autoScroll: function (options) {
	            if (isObject(options)) {
	                options = extend({ actions: ['drag', 'resize']}, options);
	            }
	            else if (isBool(options)) {
	                options = { actions: ['drag', 'resize'], enabled: options };
	            }

	            return this.setOptions('autoScroll', options);
	        },

	        /*\
	         * Interactable.snap
	         [ method ]
	         **
	         * Deprecated. Add a `snap` property to the options object passed
	         * to @Interactable.draggable or @Interactable.resizable instead.
	         *
	         * Returns or sets if and how action coordinates are snapped. By
	         * default, snapping is relative to the pointer coordinates. You can
	         * change this by setting the
	         * [`elementOrigin`](https://github.com/taye/interact.js/pull/72).
	         **
	         = (boolean | object) `false` if snap is disabled; object with snap properties if snap is enabled
	         **
	         * or
	         **
	         - options (object | boolean | null) #optional
	         = (Interactable) this Interactable
	         > Usage
	         | interact(document.querySelector('#thing')).snap({
	         |     targets: [
	         |         // snap to this specific point
	         |         {
	         |             x: 100,
	         |             y: 100,
	         |             range: 25
	         |         },
	         |         // give this function the x and y page coords and snap to the object returned
	         |         function (x, y) {
	         |             return {
	         |                 x: x,
	         |                 y: (75 + 50 * Math.sin(x * 0.04)),
	         |                 range: 40
	         |             };
	         |         },
	         |         // create a function that snaps to a grid
	         |         interact.createSnapGrid({
	         |             x: 50,
	         |             y: 50,
	         |             range: 10,              // optional
	         |             offset: { x: 5, y: 10 } // optional
	         |         })
	         |     ],
	         |     // do not snap during normal movement.
	         |     // Instead, trigger only one snapped move event
	         |     // immediately before the end event.
	         |     endOnly: true,
	         |
	         |     relativePoints: [
	         |         { x: 0, y: 0 },  // snap relative to the top left of the element
	         |         { x: 1, y: 1 },  // and also to the bottom right
	         |     ],  
	         |
	         |     // offset the snap target coordinates
	         |     // can be an object with x/y or 'startCoords'
	         |     offset: { x: 50, y: 50 }
	         |   }
	         | });
	        \*/
	        snap: function (options) {
	            var ret = this.setOptions('snap', options);

	            if (ret === this) { return this; }

	            return ret.drag;
	        },

	        setOptions: function (option, options) {
	            var actions = options && isArray(options.actions)
	                    ? options.actions
	                    : ['drag'];

	            var i;

	            if (isObject(options) || isBool(options)) {
	                for (i = 0; i < actions.length; i++) {
	                    var action = /resize/.test(actions[i])? 'resize' : actions[i];

	                    if (!isObject(this.options[action])) { continue; }

	                    var thisOption = this.options[action][option];

	                    if (isObject(options)) {
	                        extend(thisOption, options);
	                        thisOption.enabled = options.enabled === false? false: true;

	                        if (option === 'snap') {
	                            if (thisOption.mode === 'grid') {
	                                thisOption.targets = [
	                                    interact.createSnapGrid(extend({
	                                        offset: thisOption.gridOffset || { x: 0, y: 0 }
	                                    }, thisOption.grid || {}))
	                                ];
	                            }
	                            else if (thisOption.mode === 'anchor') {
	                                thisOption.targets = thisOption.anchors;
	                            }
	                            else if (thisOption.mode === 'path') {
	                                thisOption.targets = thisOption.paths;
	                            }

	                            if ('elementOrigin' in options) {
	                                thisOption.relativePoints = [options.elementOrigin];
	                            }
	                        }
	                    }
	                    else if (isBool(options)) {
	                        thisOption.enabled = options;
	                    }
	                }

	                return this;
	            }

	            var ret = {},
	                allActions = ['drag', 'resize', 'gesture'];

	            for (i = 0; i < allActions.length; i++) {
	                if (option in defaultOptions[allActions[i]]) {
	                    ret[allActions[i]] = this.options[allActions[i]][option];
	                }
	            }

	            return ret;
	        },


	        /*\
	         * Interactable.inertia
	         [ method ]
	         **
	         * Deprecated. Add an `inertia` property to the options object passed
	         * to @Interactable.draggable or @Interactable.resizable instead.
	         *
	         * Returns or sets if and how events continue to run after the pointer is released
	         **
	         = (boolean | object) `false` if inertia is disabled; `object` with inertia properties if inertia is enabled
	         **
	         * or
	         **
	         - options (object | boolean | null) #optional
	         = (Interactable) this Interactable
	         > Usage
	         | // enable and use default settings
	         | interact(element).inertia(true);
	         |
	         | // enable and use custom settings
	         | interact(element).inertia({
	         |     // value greater than 0
	         |     // high values slow the object down more quickly
	         |     resistance     : 16,
	         |
	         |     // the minimum launch speed (pixels per second) that results in inertia start
	         |     minSpeed       : 200,
	         |
	         |     // inertia will stop when the object slows down to this speed
	         |     endSpeed       : 20,
	         |
	         |     // boolean; should actions be resumed when the pointer goes down during inertia
	         |     allowResume    : true,
	         |
	         |     // boolean; should the jump when resuming from inertia be ignored in event.dx/dy
	         |     zeroResumeDelta: false,
	         |
	         |     // if snap/restrict are set to be endOnly and inertia is enabled, releasing
	         |     // the pointer without triggering inertia will animate from the release
	         |     // point to the snaped/restricted point in the given amount of time (ms)
	         |     smoothEndDuration: 300,
	         |
	         |     // an array of action types that can have inertia (no gesture)
	         |     actions        : ['drag', 'resize']
	         | });
	         |
	         | // reset custom settings and use all defaults
	         | interact(element).inertia(null);
	        \*/
	        inertia: function (options) {
	            var ret = this.setOptions('inertia', options);

	            if (ret === this) { return this; }

	            return ret.drag;
	        },

	        getAction: function (pointer, event, interaction, element) {
	            var action = this.defaultActionChecker(pointer, interaction, element);

	            if (this.options.actionChecker) {
	                return this.options.actionChecker(pointer, event, action, this, element, interaction);
	            }

	            return action;
	        },

	        defaultActionChecker: defaultActionChecker,

	        /*\
	         * Interactable.actionChecker
	         [ method ]
	         *
	         * Gets or sets the function used to check action to be performed on
	         * pointerDown
	         *
	         - checker (function | null) #optional A function which takes a pointer event, defaultAction string, interactable, element and interaction as parameters and returns an object with name property 'drag' 'resize' or 'gesture' and optionally an `edges` object with boolean 'top', 'left', 'bottom' and right props.
	         = (Function | Interactable) The checker function or this Interactable
	         *
	         | interact('.resize-drag')
	         |   .resizable(true)
	         |   .draggable(true)
	         |   .actionChecker(function (pointer, event, action, interactable, element, interaction) {
	         |
	         |   if (interact.matchesSelector(event.target, '.drag-handle') {
	         |     // force drag with handle target
	         |     action.name = drag;
	         |   }
	         |   else {
	         |     // resize from the top and right edges
	         |     action.name  = 'resize';
	         |     action.edges = { top: true, right: true };
	         |   }
	         |
	         |   return action;
	         | });
	        \*/
	        actionChecker: function (checker) {
	            if (isFunction(checker)) {
	                this.options.actionChecker = checker;

	                return this;
	            }

	            if (checker === null) {
	                delete this.options.actionChecker;

	                return this;
	            }

	            return this.options.actionChecker;
	        },

	        /*\
	         * Interactable.getRect
	         [ method ]
	         *
	         * The default function to get an Interactables bounding rect. Can be
	         * overridden using @Interactable.rectChecker.
	         *
	         - element (Element) #optional The element to measure.
	         = (object) The object's bounding rectangle.
	         o {
	         o     top   : 0,
	         o     left  : 0,
	         o     bottom: 0,
	         o     right : 0,
	         o     width : 0,
	         o     height: 0
	         o }
	        \*/
	        getRect: function rectCheck (element) {
	            element = element || this._element;

	            if (this.selector && !(isElement(element))) {
	                element = this._context.querySelector(this.selector);
	            }

	            return getElementRect(element);
	        },

	        /*\
	         * Interactable.rectChecker
	         [ method ]
	         *
	         * Returns or sets the function used to calculate the interactable's
	         * element's rectangle
	         *
	         - checker (function) #optional A function which returns this Interactable's bounding rectangle. See @Interactable.getRect
	         = (function | object) The checker function or this Interactable
	        \*/
	        rectChecker: function (checker) {
	            if (isFunction(checker)) {
	                this.getRect = checker;

	                return this;
	            }

	            if (checker === null) {
	                delete this.options.getRect;

	                return this;
	            }

	            return this.getRect;
	        },

	        /*\
	         * Interactable.styleCursor
	         [ method ]
	         *
	         * Returns or sets whether the action that would be performed when the
	         * mouse on the element are checked on `mousemove` so that the cursor
	         * may be styled appropriately
	         *
	         - newValue (boolean) #optional
	         = (boolean | Interactable) The current setting or this Interactable
	        \*/
	        styleCursor: function (newValue) {
	            if (isBool(newValue)) {
	                this.options.styleCursor = newValue;

	                return this;
	            }

	            if (newValue === null) {
	                delete this.options.styleCursor;

	                return this;
	            }

	            return this.options.styleCursor;
	        },

	        /*\
	         * Interactable.preventDefault
	         [ method ]
	         *
	         * Returns or sets whether to prevent the browser's default behaviour
	         * in response to pointer events. Can be set to:
	         *  - `'always'` to always prevent
	         *  - `'never'` to never prevent
	         *  - `'auto'` to let interact.js try to determine what would be best
	         *
	         - newValue (string) #optional `true`, `false` or `'auto'`
	         = (string | Interactable) The current setting or this Interactable
	        \*/
	        preventDefault: function (newValue) {
	            if (/^(always|never|auto)$/.test(newValue)) {
	                this.options.preventDefault = newValue;
	                return this;
	            }

	            if (isBool(newValue)) {
	                this.options.preventDefault = newValue? 'always' : 'never';
	                return this;
	            }

	            return this.options.preventDefault;
	        },

	        /*\
	         * Interactable.origin
	         [ method ]
	         *
	         * Gets or sets the origin of the Interactable's element.  The x and y
	         * of the origin will be subtracted from action event coordinates.
	         *
	         - origin (object | string) #optional An object eg. { x: 0, y: 0 } or string 'parent', 'self' or any CSS selector
	         * OR
	         - origin (Element) #optional An HTML or SVG Element whose rect will be used
	         **
	         = (object) The current origin or this Interactable
	        \*/
	        origin: function (newValue) {
	            if (trySelector(newValue)) {
	                this.options.origin = newValue;
	                return this;
	            }
	            else if (isObject(newValue)) {
	                this.options.origin = newValue;
	                return this;
	            }

	            return this.options.origin;
	        },

	        /*\
	         * Interactable.deltaSource
	         [ method ]
	         *
	         * Returns or sets the mouse coordinate types used to calculate the
	         * movement of the pointer.
	         *
	         - newValue (string) #optional Use 'client' if you will be scrolling while interacting; Use 'page' if you want autoScroll to work
	         = (string | object) The current deltaSource or this Interactable
	        \*/
	        deltaSource: function (newValue) {
	            if (newValue === 'page' || newValue === 'client') {
	                this.options.deltaSource = newValue;

	                return this;
	            }

	            return this.options.deltaSource;
	        },

	        /*\
	         * Interactable.restrict
	         [ method ]
	         **
	         * Deprecated. Add a `restrict` property to the options object passed to
	         * @Interactable.draggable, @Interactable.resizable or @Interactable.gesturable instead.
	         *
	         * Returns or sets the rectangles within which actions on this
	         * interactable (after snap calculations) are restricted. By default,
	         * restricting is relative to the pointer coordinates. You can change
	         * this by setting the
	         * [`elementRect`](https://github.com/taye/interact.js/pull/72).
	         **
	         - options (object) #optional an object with keys drag, resize, and/or gesture whose values are rects, Elements, CSS selectors, or 'parent' or 'self'
	         = (object) The current restrictions object or this Interactable
	         **
	         | interact(element).restrict({
	         |     // the rect will be `interact.getElementRect(element.parentNode)`
	         |     drag: element.parentNode,
	         |
	         |     // x and y are relative to the the interactable's origin
	         |     resize: { x: 100, y: 100, width: 200, height: 200 }
	         | })
	         |
	         | interact('.draggable').restrict({
	         |     // the rect will be the selected element's parent
	         |     drag: 'parent',
	         |
	         |     // do not restrict during normal movement.
	         |     // Instead, trigger only one restricted move event
	         |     // immediately before the end event.
	         |     endOnly: true,
	         |
	         |     // https://github.com/taye/interact.js/pull/72#issue-41813493
	         |     elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
	         | });
	        \*/
	        restrict: function (options) {
	            if (!isObject(options)) {
	                return this.setOptions('restrict', options);
	            }

	            var actions = ['drag', 'resize', 'gesture'],
	                ret;

	            for (var i = 0; i < actions.length; i++) {
	                var action = actions[i];

	                if (action in options) {
	                    var perAction = extend({
	                            actions: [action],
	                            restriction: options[action]
	                        }, options);

	                    ret = this.setOptions('restrict', perAction);
	                }
	            }

	            return ret;
	        },

	        /*\
	         * Interactable.context
	         [ method ]
	         *
	         * Gets the selector context Node of the Interactable. The default is `window.document`.
	         *
	         = (Node) The context Node of this Interactable
	         **
	        \*/
	        context: function () {
	            return this._context;
	        },

	        _context: document,

	        /*\
	         * Interactable.ignoreFrom
	         [ method ]
	         *
	         * If the target of the `mousedown`, `pointerdown` or `touchstart`
	         * event or any of it's parents match the given CSS selector or
	         * Element, no drag/resize/gesture is started.
	         *
	         - newValue (string | Element | null) #optional a CSS selector string, an Element or `null` to not ignore any elements
	         = (string | Element | object) The current ignoreFrom value or this Interactable
	         **
	         | interact(element, { ignoreFrom: document.getElementById('no-action') });
	         | // or
	         | interact(element).ignoreFrom('input, textarea, a');
	        \*/
	        ignoreFrom: function (newValue) {
	            if (trySelector(newValue)) {            // CSS selector to match event.target
	                this.options.ignoreFrom = newValue;
	                return this;
	            }

	            if (isElement(newValue)) {              // specific element
	                this.options.ignoreFrom = newValue;
	                return this;
	            }

	            return this.options.ignoreFrom;
	        },

	        /*\
	         * Interactable.allowFrom
	         [ method ]
	         *
	         * A drag/resize/gesture is started only If the target of the
	         * `mousedown`, `pointerdown` or `touchstart` event or any of it's
	         * parents match the given CSS selector or Element.
	         *
	         - newValue (string | Element | null) #optional a CSS selector string, an Element or `null` to allow from any element
	         = (string | Element | object) The current allowFrom value or this Interactable
	         **
	         | interact(element, { allowFrom: document.getElementById('drag-handle') });
	         | // or
	         | interact(element).allowFrom('.handle');
	        \*/
	        allowFrom: function (newValue) {
	            if (trySelector(newValue)) {            // CSS selector to match event.target
	                this.options.allowFrom = newValue;
	                return this;
	            }

	            if (isElement(newValue)) {              // specific element
	                this.options.allowFrom = newValue;
	                return this;
	            }

	            return this.options.allowFrom;
	        },

	        /*\
	         * Interactable.element
	         [ method ]
	         *
	         * If this is not a selector Interactable, it returns the element this
	         * interactable represents
	         *
	         = (Element) HTML / SVG Element
	        \*/
	        element: function () {
	            return this._element;
	        },

	        /*\
	         * Interactable.fire
	         [ method ]
	         *
	         * Calls listeners for the given InteractEvent type bound globally
	         * and directly to this Interactable
	         *
	         - iEvent (InteractEvent) The InteractEvent object to be fired on this Interactable
	         = (Interactable) this Interactable
	        \*/
	        fire: function (iEvent) {
	            if (!(iEvent && iEvent.type) || !contains(eventTypes, iEvent.type)) {
	                return this;
	            }

	            var listeners,
	                i,
	                len,
	                onEvent = 'on' + iEvent.type,
	                funcName = '';

	            // Interactable#on() listeners
	            if (iEvent.type in this._iEvents) {
	                listeners = this._iEvents[iEvent.type];

	                for (i = 0, len = listeners.length; i < len && !iEvent.immediatePropagationStopped; i++) {
	                    funcName = listeners[i].name;
	                    listeners[i](iEvent);
	                }
	            }

	            // interactable.onevent listener
	            if (isFunction(this[onEvent])) {
	                funcName = this[onEvent].name;
	                this[onEvent](iEvent);
	            }

	            // interact.on() listeners
	            if (iEvent.type in globalEvents && (listeners = globalEvents[iEvent.type]))  {

	                for (i = 0, len = listeners.length; i < len && !iEvent.immediatePropagationStopped; i++) {
	                    funcName = listeners[i].name;
	                    listeners[i](iEvent);
	                }
	            }

	            return this;
	        },

	        /*\
	         * Interactable.on
	         [ method ]
	         *
	         * Binds a listener for an InteractEvent or DOM event.
	         *
	         - eventType  (string | array | object) The types of events to listen for
	         - listener   (function) The function to be called on the given event(s)
	         - useCapture (boolean) #optional useCapture flag for addEventListener
	         = (object) This Interactable
	        \*/
	        on: function (eventType, listener, useCapture) {
	            var i;

	            if (isString(eventType) && eventType.search(' ') !== -1) {
	                eventType = eventType.trim().split(/ +/);
	            }

	            if (isArray(eventType)) {
	                for (i = 0; i < eventType.length; i++) {
	                    this.on(eventType[i], listener, useCapture);
	                }

	                return this;
	            }

	            if (isObject(eventType)) {
	                for (var prop in eventType) {
	                    this.on(prop, eventType[prop], listener);
	                }

	                return this;
	            }

	            if (eventType === 'wheel') {
	                eventType = wheelEvent;
	            }

	            // convert to boolean
	            useCapture = useCapture? true: false;

	            if (contains(eventTypes, eventType)) {
	                // if this type of event was never bound to this Interactable
	                if (!(eventType in this._iEvents)) {
	                    this._iEvents[eventType] = [listener];
	                }
	                else {
	                    this._iEvents[eventType].push(listener);
	                }
	            }
	            // delegated event for selector
	            else if (this.selector) {
	                if (!delegatedEvents[eventType]) {
	                    delegatedEvents[eventType] = {
	                        selectors: [],
	                        contexts : [],
	                        listeners: []
	                    };

	                    // add delegate listener functions
	                    for (i = 0; i < documents.length; i++) {
	                        events.add(documents[i], eventType, delegateListener);
	                        events.add(documents[i], eventType, delegateUseCapture, true);
	                    }
	                }

	                var delegated = delegatedEvents[eventType],
	                    index;

	                for (index = delegated.selectors.length - 1; index >= 0; index--) {
	                    if (delegated.selectors[index] === this.selector
	                        && delegated.contexts[index] === this._context) {
	                        break;
	                    }
	                }

	                if (index === -1) {
	                    index = delegated.selectors.length;

	                    delegated.selectors.push(this.selector);
	                    delegated.contexts .push(this._context);
	                    delegated.listeners.push([]);
	                }

	                // keep listener and useCapture flag
	                delegated.listeners[index].push([listener, useCapture]);
	            }
	            else {
	                events.add(this._element, eventType, listener, useCapture);
	            }

	            return this;
	        },

	        /*\
	         * Interactable.off
	         [ method ]
	         *
	         * Removes an InteractEvent or DOM event listener
	         *
	         - eventType  (string | array | object) The types of events that were listened for
	         - listener   (function) The listener function to be removed
	         - useCapture (boolean) #optional useCapture flag for removeEventListener
	         = (object) This Interactable
	        \*/
	        off: function (eventType, listener, useCapture) {
	            var i;

	            if (isString(eventType) && eventType.search(' ') !== -1) {
	                eventType = eventType.trim().split(/ +/);
	            }

	            if (isArray(eventType)) {
	                for (i = 0; i < eventType.length; i++) {
	                    this.off(eventType[i], listener, useCapture);
	                }

	                return this;
	            }

	            if (isObject(eventType)) {
	                for (var prop in eventType) {
	                    this.off(prop, eventType[prop], listener);
	                }

	                return this;
	            }

	            var eventList,
	                index = -1;

	            // convert to boolean
	            useCapture = useCapture? true: false;

	            if (eventType === 'wheel') {
	                eventType = wheelEvent;
	            }

	            // if it is an action event type
	            if (contains(eventTypes, eventType)) {
	                eventList = this._iEvents[eventType];

	                if (eventList && (index = indexOf(eventList, listener)) !== -1) {
	                    this._iEvents[eventType].splice(index, 1);
	                }
	            }
	            // delegated event
	            else if (this.selector) {
	                var delegated = delegatedEvents[eventType],
	                    matchFound = false;

	                if (!delegated) { return this; }

	                // count from last index of delegated to 0
	                for (index = delegated.selectors.length - 1; index >= 0; index--) {
	                    // look for matching selector and context Node
	                    if (delegated.selectors[index] === this.selector
	                        && delegated.contexts[index] === this._context) {

	                        var listeners = delegated.listeners[index];

	                        // each item of the listeners array is an array: [function, useCaptureFlag]
	                        for (i = listeners.length - 1; i >= 0; i--) {
	                            var fn = listeners[i][0],
	                                useCap = listeners[i][1];

	                            // check if the listener functions and useCapture flags match
	                            if (fn === listener && useCap === useCapture) {
	                                // remove the listener from the array of listeners
	                                listeners.splice(i, 1);

	                                // if all listeners for this interactable have been removed
	                                // remove the interactable from the delegated arrays
	                                if (!listeners.length) {
	                                    delegated.selectors.splice(index, 1);
	                                    delegated.contexts .splice(index, 1);
	                                    delegated.listeners.splice(index, 1);

	                                    // remove delegate function from context
	                                    events.remove(this._context, eventType, delegateListener);
	                                    events.remove(this._context, eventType, delegateUseCapture, true);

	                                    // remove the arrays if they are empty
	                                    if (!delegated.selectors.length) {
	                                        delegatedEvents[eventType] = null;
	                                    }
	                                }

	                                // only remove one listener
	                                matchFound = true;
	                                break;
	                            }
	                        }

	                        if (matchFound) { break; }
	                    }
	                }
	            }
	            // remove listener from this Interatable's element
	            else {
	                events.remove(this._element, eventType, listener, useCapture);
	            }

	            return this;
	        },

	        /*\
	         * Interactable.set
	         [ method ]
	         *
	         * Reset the options of this Interactable
	         - options (object) The new settings to apply
	         = (object) This Interactable
	        \*/
	        set: function (options) {
	            if (!isObject(options)) {
	                options = {};
	            }

	            this.options = extend({}, defaultOptions.base);

	            var i,
	                actions = ['drag', 'drop', 'resize', 'gesture'],
	                methods = ['draggable', 'dropzone', 'resizable', 'gesturable'],
	                perActions = extend(extend({}, defaultOptions.perAction), options[action] || {});

	            for (i = 0; i < actions.length; i++) {
	                var action = actions[i];

	                this.options[action] = extend({}, defaultOptions[action]);

	                this.setPerAction(action, perActions);

	                this[methods[i]](options[action]);
	            }

	            var settings = [
	                    'accept', 'actionChecker', 'allowFrom', 'deltaSource',
	                    'dropChecker', 'ignoreFrom', 'origin', 'preventDefault',
	                    'rectChecker', 'styleCursor'
	                ];

	            for (i = 0, len = settings.length; i < len; i++) {
	                var setting = settings[i];

	                this.options[setting] = defaultOptions.base[setting];

	                if (setting in options) {
	                    this[setting](options[setting]);
	                }
	            }

	            return this;
	        },

	        /*\
	         * Interactable.unset
	         [ method ]
	         *
	         * Remove this interactable from the list of interactables and remove
	         * it's drag, drop, resize and gesture capabilities
	         *
	         = (object) @interact
	        \*/
	        unset: function () {
	            events.remove(this._element, 'all');

	            if (!isString(this.selector)) {
	                events.remove(this, 'all');
	                if (this.options.styleCursor) {
	                    this._element.style.cursor = '';
	                }
	            }
	            else {
	                // remove delegated events
	                for (var type in delegatedEvents) {
	                    var delegated = delegatedEvents[type];

	                    for (var i = 0; i < delegated.selectors.length; i++) {
	                        if (delegated.selectors[i] === this.selector
	                            && delegated.contexts[i] === this._context) {

	                            delegated.selectors.splice(i, 1);
	                            delegated.contexts .splice(i, 1);
	                            delegated.listeners.splice(i, 1);

	                            // remove the arrays if they are empty
	                            if (!delegated.selectors.length) {
	                                delegatedEvents[type] = null;
	                            }
	                        }

	                        events.remove(this._context, type, delegateListener);
	                        events.remove(this._context, type, delegateUseCapture, true);

	                        break;
	                    }
	                }
	            }

	            this.dropzone(false);

	            interactables.splice(indexOf(interactables, this), 1);

	            return interact;
	        }
	    };

	    function warnOnce (method, message) {
	        var warned = false;

	        return function () {
	            if (!warned) {
	                window.console.warn(message);
	                warned = true;
	            }

	            return method.apply(this, arguments);
	        };
	    }

	    Interactable.prototype.snap = warnOnce(Interactable.prototype.snap,
	         'Interactable#snap is deprecated. See the new documentation for snapping at http://interactjs.io/docs/snapping');
	    Interactable.prototype.restrict = warnOnce(Interactable.prototype.restrict,
	         'Interactable#restrict is deprecated. See the new documentation for resticting at http://interactjs.io/docs/restriction');
	    Interactable.prototype.inertia = warnOnce(Interactable.prototype.inertia,
	         'Interactable#inertia is deprecated. See the new documentation for inertia at http://interactjs.io/docs/inertia');
	    Interactable.prototype.autoScroll = warnOnce(Interactable.prototype.autoScroll,
	         'Interactable#autoScroll is deprecated. See the new documentation for autoScroll at http://interactjs.io/docs/#autoscroll');
	    Interactable.prototype.squareResize = warnOnce(Interactable.prototype.squareResize,
	         'Interactable#squareResize is deprecated. See http://interactjs.io/docs/#resize-square');

	    Interactable.prototype.accept = warnOnce(Interactable.prototype.accept,
	         'Interactable#accept is deprecated. use Interactable#dropzone({ accept: target }) instead');
	    Interactable.prototype.dropChecker = warnOnce(Interactable.prototype.dropChecker,
	         'Interactable#dropChecker is deprecated. use Interactable#dropzone({ dropChecker: checkerFunction }) instead');
	    Interactable.prototype.context = warnOnce(Interactable.prototype.context,
	         'Interactable#context as a method is deprecated. It will soon be a DOM Node instead');

	    /*\
	     * interact.isSet
	     [ method ]
	     *
	     * Check if an element has been set
	     - element (Element) The Element being searched for
	     = (boolean) Indicates if the element or CSS selector was previously passed to interact
	    \*/
	    interact.isSet = function(element, options) {
	        return interactables.indexOfElement(element, options && options.context) !== -1;
	    };

	    /*\
	     * interact.on
	     [ method ]
	     *
	     * Adds a global listener for an InteractEvent or adds a DOM event to
	     * `document`
	     *
	     - type       (string | array | object) The types of events to listen for
	     - listener   (function) The function to be called on the given event(s)
	     - useCapture (boolean) #optional useCapture flag for addEventListener
	     = (object) interact
	    \*/
	    interact.on = function (type, listener, useCapture) {
	        if (isString(type) && type.search(' ') !== -1) {
	            type = type.trim().split(/ +/);
	        }

	        if (isArray(type)) {
	            for (var i = 0; i < type.length; i++) {
	                interact.on(type[i], listener, useCapture);
	            }

	            return interact;
	        }

	        if (isObject(type)) {
	            for (var prop in type) {
	                interact.on(prop, type[prop], listener);
	            }

	            return interact;
	        }

	        // if it is an InteractEvent type, add listener to globalEvents
	        if (contains(eventTypes, type)) {
	            // if this type of event was never bound
	            if (!globalEvents[type]) {
	                globalEvents[type] = [listener];
	            }
	            else {
	                globalEvents[type].push(listener);
	            }
	        }
	        // If non InteractEvent type, addEventListener to document
	        else {
	            events.add(document, type, listener, useCapture);
	        }

	        return interact;
	    };

	    /*\
	     * interact.off
	     [ method ]
	     *
	     * Removes a global InteractEvent listener or DOM event from `document`
	     *
	     - type       (string | array | object) The types of events that were listened for
	     - listener   (function) The listener function to be removed
	     - useCapture (boolean) #optional useCapture flag for removeEventListener
	     = (object) interact
	     \*/
	    interact.off = function (type, listener, useCapture) {
	        if (isString(type) && type.search(' ') !== -1) {
	            type = type.trim().split(/ +/);
	        }

	        if (isArray(type)) {
	            for (var i = 0; i < type.length; i++) {
	                interact.off(type[i], listener, useCapture);
	            }

	            return interact;
	        }

	        if (isObject(type)) {
	            for (var prop in type) {
	                interact.off(prop, type[prop], listener);
	            }

	            return interact;
	        }

	        if (!contains(eventTypes, type)) {
	            events.remove(document, type, listener, useCapture);
	        }
	        else {
	            var index;

	            if (type in globalEvents
	                && (index = indexOf(globalEvents[type], listener)) !== -1) {
	                globalEvents[type].splice(index, 1);
	            }
	        }

	        return interact;
	    };

	    /*\
	     * interact.enableDragging
	     [ method ]
	     *
	     * Deprecated.
	     *
	     * Returns or sets whether dragging is enabled for any Interactables
	     *
	     - newValue (boolean) #optional `true` to allow the action; `false` to disable action for all Interactables
	     = (boolean | object) The current setting or interact
	    \*/
	    interact.enableDragging = warnOnce(function (newValue) {
	        if (newValue !== null && newValue !== undefined) {
	            actionIsEnabled.drag = newValue;

	            return interact;
	        }
	        return actionIsEnabled.drag;
	    }, 'interact.enableDragging is deprecated and will soon be removed.');

	    /*\
	     * interact.enableResizing
	     [ method ]
	     *
	     * Deprecated.
	     *
	     * Returns or sets whether resizing is enabled for any Interactables
	     *
	     - newValue (boolean) #optional `true` to allow the action; `false` to disable action for all Interactables
	     = (boolean | object) The current setting or interact
	    \*/
	    interact.enableResizing = warnOnce(function (newValue) {
	        if (newValue !== null && newValue !== undefined) {
	            actionIsEnabled.resize = newValue;

	            return interact;
	        }
	        return actionIsEnabled.resize;
	    }, 'interact.enableResizing is deprecated and will soon be removed.');

	    /*\
	     * interact.enableGesturing
	     [ method ]
	     *
	     * Deprecated.
	     *
	     * Returns or sets whether gesturing is enabled for any Interactables
	     *
	     - newValue (boolean) #optional `true` to allow the action; `false` to disable action for all Interactables
	     = (boolean | object) The current setting or interact
	    \*/
	    interact.enableGesturing = warnOnce(function (newValue) {
	        if (newValue !== null && newValue !== undefined) {
	            actionIsEnabled.gesture = newValue;

	            return interact;
	        }
	        return actionIsEnabled.gesture;
	    }, 'interact.enableGesturing is deprecated and will soon be removed.');

	    interact.eventTypes = eventTypes;

	    /*\
	     * interact.debug
	     [ method ]
	     *
	     * Returns debugging data
	     = (object) An object with properties that outline the current state and expose internal functions and variables
	    \*/
	    interact.debug = function () {
	        var interaction = interactions[0] || new Interaction();

	        return {
	            interactions          : interactions,
	            target                : interaction.target,
	            dragging              : interaction.dragging,
	            resizing              : interaction.resizing,
	            gesturing             : interaction.gesturing,
	            prepared              : interaction.prepared,
	            matches               : interaction.matches,
	            matchElements         : interaction.matchElements,

	            prevCoords            : interaction.prevCoords,
	            startCoords           : interaction.startCoords,

	            pointerIds            : interaction.pointerIds,
	            pointers              : interaction.pointers,
	            addPointer            : listeners.addPointer,
	            removePointer         : listeners.removePointer,
	            recordPointer        : listeners.recordPointer,

	            snap                  : interaction.snapStatus,
	            restrict              : interaction.restrictStatus,
	            inertia               : interaction.inertiaStatus,

	            downTime              : interaction.downTimes[0],
	            downEvent             : interaction.downEvent,
	            downPointer           : interaction.downPointer,
	            prevEvent             : interaction.prevEvent,

	            Interactable          : Interactable,
	            interactables         : interactables,
	            pointerIsDown         : interaction.pointerIsDown,
	            defaultOptions        : defaultOptions,
	            defaultActionChecker  : defaultActionChecker,

	            actionCursors         : actionCursors,
	            dragMove              : listeners.dragMove,
	            resizeMove            : listeners.resizeMove,
	            gestureMove           : listeners.gestureMove,
	            pointerUp             : listeners.pointerUp,
	            pointerDown           : listeners.pointerDown,
	            pointerMove           : listeners.pointerMove,
	            pointerHover          : listeners.pointerHover,

	            eventTypes            : eventTypes,

	            events                : events,
	            globalEvents          : globalEvents,
	            delegatedEvents       : delegatedEvents,

	            prefixedPropREs       : prefixedPropREs
	        };
	    };

	    // expose the functions used to calculate multi-touch properties
	    interact.getPointerAverage = pointerAverage;
	    interact.getTouchBBox     = touchBBox;
	    interact.getTouchDistance = touchDistance;
	    interact.getTouchAngle    = touchAngle;

	    interact.getElementRect         = getElementRect;
	    interact.getElementClientRect   = getElementClientRect;
	    interact.matchesSelector        = matchesSelector;
	    interact.closest                = closest;

	    /*\
	     * interact.margin
	     [ method ]
	     *
	     * Deprecated. Use `interact(target).resizable({ margin: number });` instead.
	     * Returns or sets the margin for autocheck resizing used in
	     * @Interactable.getAction. That is the distance from the bottom and right
	     * edges of an element clicking in which will start resizing
	     *
	     - newValue (number) #optional
	     = (number | interact) The current margin value or interact
	    \*/
	    interact.margin = warnOnce(function (newvalue) {
	        if (isNumber(newvalue)) {
	            margin = newvalue;

	            return interact;
	        }
	        return margin;
	    },
	    'interact.margin is deprecated. Use interact(target).resizable({ margin: number }); instead.') ;

	    /*\
	     * interact.supportsTouch
	     [ method ]
	     *
	     = (boolean) Whether or not the browser supports touch input
	    \*/
	    interact.supportsTouch = function () {
	        return supportsTouch;
	    };

	    /*\
	     * interact.supportsPointerEvent
	     [ method ]
	     *
	     = (boolean) Whether or not the browser supports PointerEvents
	    \*/
	    interact.supportsPointerEvent = function () {
	        return supportsPointerEvent;
	    };

	    /*\
	     * interact.stop
	     [ method ]
	     *
	     * Cancels all interactions (end events are not fired)
	     *
	     - event (Event) An event on which to call preventDefault()
	     = (object) interact
	    \*/
	    interact.stop = function (event) {
	        for (var i = interactions.length - 1; i >= 0; i--) {
	            interactions[i].stop(event);
	        }

	        return interact;
	    };

	    /*\
	     * interact.dynamicDrop
	     [ method ]
	     *
	     * Returns or sets whether the dimensions of dropzone elements are
	     * calculated on every dragmove or only on dragstart for the default
	     * dropChecker
	     *
	     - newValue (boolean) #optional True to check on each move. False to check only before start
	     = (boolean | interact) The current setting or interact
	    \*/
	    interact.dynamicDrop = function (newValue) {
	        if (isBool(newValue)) {
	            //if (dragging && dynamicDrop !== newValue && !newValue) {
	                //calcRects(dropzones);
	            //}

	            dynamicDrop = newValue;

	            return interact;
	        }
	        return dynamicDrop;
	    };

	    /*\
	     * interact.pointerMoveTolerance
	     [ method ]
	     * Returns or sets the distance the pointer must be moved before an action
	     * sequence occurs. This also affects tolerance for tap events.
	     *
	     - newValue (number) #optional The movement from the start position must be greater than this value
	     = (number | Interactable) The current setting or interact
	    \*/
	    interact.pointerMoveTolerance = function (newValue) {
	        if (isNumber(newValue)) {
	            pointerMoveTolerance = newValue;

	            return this;
	        }

	        return pointerMoveTolerance;
	    };

	    /*\
	     * interact.maxInteractions
	     [ method ]
	     **
	     * Returns or sets the maximum number of concurrent interactions allowed.
	     * By default only 1 interaction is allowed at a time (for backwards
	     * compatibility). To allow multiple interactions on the same Interactables
	     * and elements, you need to enable it in the draggable, resizable and
	     * gesturable `'max'` and `'maxPerElement'` options.
	     **
	     - newValue (number) #optional Any number. newValue <= 0 means no interactions.
	    \*/
	    interact.maxInteractions = function (newValue) {
	        if (isNumber(newValue)) {
	            maxInteractions = newValue;

	            return this;
	        }

	        return maxInteractions;
	    };

	    interact.createSnapGrid = function (grid) {
	        return function (x, y) {
	            var offsetX = 0,
	                offsetY = 0;

	            if (isObject(grid.offset)) {
	                offsetX = grid.offset.x;
	                offsetY = grid.offset.y;
	            }

	            var gridx = Math.round((x - offsetX) / grid.x),
	                gridy = Math.round((y - offsetY) / grid.y),

	                newX = gridx * grid.x + offsetX,
	                newY = gridy * grid.y + offsetY;

	            return {
	                x: newX,
	                y: newY,
	                range: grid.range
	            };
	        };
	    };

	    function endAllInteractions (event) {
	        for (var i = 0; i < interactions.length; i++) {
	            interactions[i].pointerEnd(event, event);
	        }
	    }

	    function listenToDocument (doc) {
	        if (contains(documents, doc)) { return; }

	        var win = doc.defaultView || doc.parentWindow;

	        // add delegate event listener
	        for (var eventType in delegatedEvents) {
	            events.add(doc, eventType, delegateListener);
	            events.add(doc, eventType, delegateUseCapture, true);
	        }

	        if (PointerEvent) {
	            if (PointerEvent === win.MSPointerEvent) {
	                pEventTypes = {
	                    up: 'MSPointerUp', down: 'MSPointerDown', over: 'mouseover',
	                    out: 'mouseout', move: 'MSPointerMove', cancel: 'MSPointerCancel' };
	            }
	            else {
	                pEventTypes = {
	                    up: 'pointerup', down: 'pointerdown', over: 'pointerover',
	                    out: 'pointerout', move: 'pointermove', cancel: 'pointercancel' };
	            }

	            events.add(doc, pEventTypes.down  , listeners.selectorDown );
	            events.add(doc, pEventTypes.move  , listeners.pointerMove  );
	            events.add(doc, pEventTypes.over  , listeners.pointerOver  );
	            events.add(doc, pEventTypes.out   , listeners.pointerOut   );
	            events.add(doc, pEventTypes.up    , listeners.pointerUp    );
	            events.add(doc, pEventTypes.cancel, listeners.pointerCancel);

	            // autoscroll
	            events.add(doc, pEventTypes.move, listeners.autoScrollMove);
	        }
	        else {
	            events.add(doc, 'mousedown', listeners.selectorDown);
	            events.add(doc, 'mousemove', listeners.pointerMove );
	            events.add(doc, 'mouseup'  , listeners.pointerUp   );
	            events.add(doc, 'mouseover', listeners.pointerOver );
	            events.add(doc, 'mouseout' , listeners.pointerOut  );

	            events.add(doc, 'touchstart' , listeners.selectorDown );
	            events.add(doc, 'touchmove'  , listeners.pointerMove  );
	            events.add(doc, 'touchend'   , listeners.pointerUp    );
	            events.add(doc, 'touchcancel', listeners.pointerCancel);

	            // autoscroll
	            events.add(doc, 'mousemove', listeners.autoScrollMove);
	            events.add(doc, 'touchmove', listeners.autoScrollMove);
	        }

	        events.add(win, 'blur', endAllInteractions);

	        try {
	            if (win.frameElement) {
	                var parentDoc = win.frameElement.ownerDocument,
	                    parentWindow = parentDoc.defaultView;

	                events.add(parentDoc   , 'mouseup'      , listeners.pointerEnd);
	                events.add(parentDoc   , 'touchend'     , listeners.pointerEnd);
	                events.add(parentDoc   , 'touchcancel'  , listeners.pointerEnd);
	                events.add(parentDoc   , 'pointerup'    , listeners.pointerEnd);
	                events.add(parentDoc   , 'MSPointerUp'  , listeners.pointerEnd);
	                events.add(parentWindow, 'blur'         , endAllInteractions );
	            }
	        }
	        catch (error) {
	            interact.windowParentError = error;
	        }

	        // prevent native HTML5 drag on interact.js target elements
	        events.add(doc, 'dragstart', function (event) {
	            for (var i = 0; i < interactions.length; i++) {
	                var interaction = interactions[i];

	                if (interaction.element
	                    && (interaction.element === event.target
	                        || nodeContains(interaction.element, event.target))) {

	                    interaction.checkAndPreventDefault(event, interaction.target, interaction.element);
	                    return;
	                }
	            }
	        });

	        if (events.useAttachEvent) {
	            // For IE's lack of Event#preventDefault
	            events.add(doc, 'selectstart', function (event) {
	                var interaction = interactions[0];

	                if (interaction.currentAction()) {
	                    interaction.checkAndPreventDefault(event);
	                }
	            });

	            // For IE's bad dblclick event sequence
	            events.add(doc, 'dblclick', doOnInteractions('ie8Dblclick'));
	        }

	        documents.push(doc);
	    }

	    listenToDocument(document);

	    function indexOf (array, target) {
	        for (var i = 0, len = array.length; i < len; i++) {
	            if (array[i] === target) {
	                return i;
	            }
	        }

	        return -1;
	    }

	    function contains (array, target) {
	        return indexOf(array, target) !== -1;
	    }

	    function matchesSelector (element, selector, nodeList) {
	        if (ie8MatchesSelector) {
	            return ie8MatchesSelector(element, selector, nodeList);
	        }

	        // remove /deep/ from selectors if shadowDOM polyfill is used
	        if (window !== realWindow) {
	            selector = selector.replace(/\/deep\//g, ' ');
	        }

	        return element[prefixedMatchesSelector](selector);
	    }

	    function matchesUpTo (element, selector, limit) {
	        while (isElement(element)) {
	            if (matchesSelector(element, selector)) {
	                return true;
	            }

	            element = parentElement(element);

	            if (element === limit) {
	                return matchesSelector(element, selector);
	            }
	        }

	        return false;
	    }

	    // For IE8's lack of an Element#matchesSelector
	    // taken from http://tanalin.com/en/blog/2012/12/matches-selector-ie8/ and modified
	    if (!(prefixedMatchesSelector in Element.prototype) || !isFunction(Element.prototype[prefixedMatchesSelector])) {
	        ie8MatchesSelector = function (element, selector, elems) {
	            elems = elems || element.parentNode.querySelectorAll(selector);

	            for (var i = 0, len = elems.length; i < len; i++) {
	                if (elems[i] === element) {
	                    return true;
	                }
	            }

	            return false;
	        };
	    }

	    // requestAnimationFrame polyfill
	    (function() {
	        var lastTime = 0,
	            vendors = ['ms', 'moz', 'webkit', 'o'];

	        for(var x = 0; x < vendors.length && !realWindow.requestAnimationFrame; ++x) {
	            reqFrame = realWindow[vendors[x]+'RequestAnimationFrame'];
	            cancelFrame = realWindow[vendors[x]+'CancelAnimationFrame'] || realWindow[vendors[x]+'CancelRequestAnimationFrame'];
	        }

	        if (!reqFrame) {
	            reqFrame = function(callback) {
	                var currTime = new Date().getTime(),
	                    timeToCall = Math.max(0, 16 - (currTime - lastTime)),
	                    id = setTimeout(function() { callback(currTime + timeToCall); },
	                  timeToCall);
	                lastTime = currTime + timeToCall;
	                return id;
	            };
	        }

	        if (!cancelFrame) {
	            cancelFrame = function(id) {
	                clearTimeout(id);
	            };
	        }
	    }());

	    /* global exports: true, module, define */

	    // http://documentcloud.github.io/underscore/docs/underscore.html#section-11
	    if (true) {
	        if (typeof module !== 'undefined' && module.exports) {
	            exports = module.exports = interact;
	        }
	        exports.interact = interact;
	    }
	    // AMD
	    else if (typeof define === 'function' && define.amd) {
	        define('interact', function() {
	            return interact;
	        });
	    }
	    else {
	        realWindow.interact = interact;
	    }

	} (typeof window === 'undefined'? undefined : window));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _helpers = __webpack_require__(2);

	var _helpers2 = _interopRequireDefault(_helpers);

	var _soundselector = __webpack_require__(7);

	var _soundselector2 = _interopRequireDefault(_soundselector);

	var _viewtemplate = __webpack_require__(4);

	var _viewtemplate2 = _interopRequireDefault(_viewtemplate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Grid(container) {

		this.dimensions = {
			rows: 6, cols: 8
		};

		this.container = container;
		this.cells = [];
		this.controls = null;
		this.soundSelector = null;

		this.view = this.create();
	}

	Grid.prototype = {

		constructor: Grid,

		dock: function dock(soundbite) {

			//	if we didn't initiate a touch with the mouse on the element
			//	don't dock

			if (!soundbite.beganWithMouseDown) return;
			soundbite.beganWithMouseDown = false;

			//	only dock the element if we're within the grid

			if (!this.isInsideGridBounds(soundbite.element)) return;

			//	find the closest nearby cell

			var closestCell = this.nearestEmptyCell(soundbite.element),
			    cellElement = closestCell.element;

			//	update the soundbite's properties to reflect the docking

			soundbite.setDocked(closestCell.id);

			//	add it to the parent, and mark that the parent encloses an element

			cellElement.appendChild(soundbite.element);
			closestCell.isEmpty = false;
		},

		undock: function undock(soundbite, event) {

			var dockedCell = this.getCellById(soundbite.gridId);

			if (dockedCell === -1) return;

			dockedCell.element.removeChild(soundbite.element);
			soundbite.template.container.appendChild(soundbite.element);
			dockedCell.isEmpty = true;

			soundbite.setUndocked(event);
		},

		isInsideGridBounds: function isInsideGridBounds(element) {
			var gridRect = this.grid.getBoundingClientRect(),
			    elementRect = element.getBoundingClientRect(),
			    elementWidth = elementRect.width,
			    elementHeight = elementRect.height,
			    adjustedPosition = {
				left: elementRect.left + elementWidth / 2,
				top: elementRect.top + elementHeight / 2,
				right: elementRect.right - elementWidth / 2,
				bottom: elementRect.bottom - elementHeight / 2
			};

			if (adjustedPosition.left < gridRect.left || adjustedPosition.top < gridRect.top) {
				return false;
			}

			if (adjustedPosition.right > gridRect.right || adjustedPosition.bottom > gridRect.bottom) {
				return false;
			}

			return true;
		},


		getEmptyCells: function getEmptyCells() {
			return this.cells.filter(function (cell) {
				return cell.isEmpty === true;
			});
		},

		getCellById: function getCellById(id) {
			var cell = this.cells.filter(function (cell) {
				return cell.id === id;
			});
			if (cell.length === 0) return -1;
			return cell[0];
		},

		nearestEmptyCell: function nearestEmptyCell(element) {
			var cells = this.getEmptyCells(),
			    position = element.getBoundingClientRect();

			var min = cells.reduce(function (offsets, cell, i) {
				var cellPosition = cell.element.getBoundingClientRect(),
				    x = Math.abs(position.left - cellPosition.left),
				    y = Math.abs(position.top - cellPosition.top);

				if (i === 0 || x <= offsets.x && y <= offsets.y) {
					Object.assign(offsets, { x: x, y: y, id: cell.id });
				}
				return offsets;
			}, {});

			return cells.filter(function (cell) {
				return cell.id === min.id;
			})[0];
		},

		//	draw + create the grid

		create: function create() {

			//	define the control text and ids

			var controlIds = ['play', 'direction', 'effects', 'newSound'],
			    controlText = ['play', 'direc', 'fx', '+'];

			//	create the basic grid from the ViewTemplate

			var view = new _viewtemplate2.default(this.container, [{
				stickyHeader: true,
				className: 'grid__controls',
				cellClassName: 'grid__cell__controls',
				rows: 1,
				cols: 4,
				innerText: controlText,
				ids: controlIds
			}, {
				className: 'grid__sounds',
				rows: this.dimensions.rows,
				cols: this.dimensions.cols,
				ids: 'auto'
			}]);

			//	get the control elements separately

			this.controls = {
				play: view.getCellById('play'),
				direction: view.getCellById('direction'),
				effects: view.getCellById('effects'),
				newSound: view.getCellById('newSound')
			};

			//	get the grid section separately

			this.grid = view.container;

			//	get the cells separately

			var cells = [];

			view.getCellsInSection('grid__sounds').map(function (cell) {
				cells.push({
					element: cell,
					id: cell.id,
					isEmpty: true
				});
			});

			this.cells = cells;

			//	display the grid, and keep it centered in the viewport

			this.style(view);

			view.addToDocument();
			view.keepCentered();
			view.hide();

			return view;
		},

		style: function style(view) {
			view.getAllCells().map(function (cell) {
				_helpers2.default.setStyle(cell, {
					backgroundColor: _helpers2.default.toRGB(20, 200, _helpers2.default.randInt(0, 255))
				});
			});
		},

		//	control display

		hide: function hide() {
			this.view.hide();
		},

		show: function show() {
			this.view.show();
		}
	};

	exports.default = Grid;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _viewtemplate = __webpack_require__(4);

	var _viewtemplate2 = _interopRequireDefault(_viewtemplate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function SoundSelector(container, bites) {

		this.bites = bites;
		this.container = container;
		this.controls = {};
		this.view = this.create();
		this.addBites();
	}

	SoundSelector.prototype = {
		constructor: SoundSelector,

		create: function create() {

			//	create the basic grid from the ViewTemplate

			var nCols = 2,
			    nRows = Math.ceil(this.bites.original.length / nCols);

			var view = new _viewtemplate2.default(this.container, [{
				stickyHeader: true,
				className: 'soundSelector__header',
				cellClassName: 'soundSelector__cell__header',
				innerText: ['', ''],
				ids: ['soundSelector__close', ''],
				rows: 1,
				cols: 1
			}, {
				className: 'soundSelector__sounds',
				cellClassName: 'soundSelector__cell',
				rowClassName: 'soundSelector__row',
				rows: nRows,
				cols: nCols,
				ids: []
			}], { name: 'soundSelector' });

			view.addToDocument();
			view.keepCentered();
			view.hide();

			// this.controls.select = view.getCellById('soundSelector__select')
			this.controls.close = view.getCellById('soundSelector__close');

			return view;
		},

		addBites: function addBites() {
			var view = this.view,
			    cells = view.getCellsInSection('soundSelector__sounds'),
			    bites = this.bites.original;

			for (var i = 0; i < bites.length; i++) {
				cells[i].appendChild(bites[i].element);
			}
		},

		//	control displaying

		hide: function hide() {
			this.view.hide();
		},

		show: function show() {
			this.view.show();
		}

	};

	exports.default = SoundSelector;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _audiomanager = __webpack_require__(9);

	var _audiomanager2 = _interopRequireDefault(_audiomanager);

	var _helpers = __webpack_require__(2);

	var _helpers2 = _interopRequireDefault(_helpers);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//	SoundBites is an array of soundbites

	function SoundBites(audioParams, templates) {

		this.templates = templates;

		this.original = this.templates.map(function (temp) {
			temp.type = 'dockedInSoundSelector';
			temp.audioParams = audioParams;
			return new SoundBite(temp);
		});

		this.inuse = [];
		this.all = [];
		this.getAllBites();
	}

	SoundBites.prototype = {
		constructor: SoundBites,

		createBite: function createBite(template) {
			this.inuse.push(new SoundBite(template));
			this.getAllBites();
		},

		getAllBites: function getAllBites() {
			this.all = this.all.concat(this.original, this.inuse);
		},

		getBiteById: function getBiteById(id) {
			var found = this.all.filter(function (bite) {
				return bite.id === id;
			});
			if (found.length === 0) return -1;
			return found[0];
		},

		getInUseBitesInRowOrColumn: function getInUseBitesInRowOrColumn(type, n) {
			var bites = this.inuse;

			return bites.filter(function (bite) {
				if (bite.isDocked === false) return false;

				var currentId = bite.gridId,
				    indexOfStrComponent = 0,
				    splitString = currentId.split(',');

				if (type === 'columns') indexOfStrComponent = 1;

				return splitString[indexOfStrComponent] === n.toString();
			});
		},

		getFilenames: function getFilenames() {
			return this.templates.filter(function (template) {
				template.filename;
			});
		}
	};

	//	an individual soundbite

	function SoundBite(template) {

		this.classNames = {
			base: 'soundbite',
			inGrid: 'soundbite__grid',
			dockedInGrid: 'soundbite__grid__docked',
			undockedInGrid: 'soundbite__grid__undocked',
			dockedInSoundSelector: 'soundbite__soundSelector'
		};
		this.id = _helpers2.default.randId('soundbite_');
		this.gridId = null;
		this.isDocked = false;
		this.audioParams = template.audioParams;
		this.filename = template.filename;
		this.color = template.color;
		this.template = template;

		this.element = _helpers2.default.createDiv({ className: this.classNames.base, id: this.id });
		_helpers2.default.setStyle(this.element, { backgroundColor: this.color });

		if (template.type != null) {
			var additionalClass = this.classNames[template.type];
			this.element.classList.add(additionalClass);
		}

		if (template.container != null) {
			template.container.appendChild(this.element);
		}

		if (template.makeCenter) {
			this.center();
		}
	}

	SoundBite.prototype = {
		constructor: SoundBite,

		setDocked: function setDocked(id) {
			var element = this.element;

			//	get rid of the element's style attributes

			element.removeAttribute('style');

			element.style.backgroundColor = this.color;

			element.setAttribute('data-x', 0);
			element.setAttribute('data-y', 0);

			//	make it inherit the style of its parent

			element.classList.remove(this.classNames.undockedInGrid);
			element.classList.add(this.classNames.dockedInGrid);

			//	mark as docked, and take note of the row / col
			//	in which we're docked

			this.gridId = id;
			this.isDocked = true;
		},

		setUndocked: function setUndocked(event) {
			var element = this.element,
			    dockedClass = this.classNames.dockedInGrid,
			    undockedClass = this.classNames.undockedInGrid,
			    elementRect = element.getBoundingClientRect();

			element.classList.remove(dockedClass);
			element.classList.add(undockedClass);

			_helpers2.default.setStyle(element, {
				backgroundColor: this.template.color,
				position: 'fixed',
				top: _helpers2.default.toPixels(event.clientY - 50 / 2),
				left: _helpers2.default.toPixels(event.clientX - 50 / 2)
			});

			element.setAttribute('data-x', 0);
			element.setAttribute('data-y', 0);

			this.isDocked = false;
			this.gridId = null;
		},

		center: function center() {
			var element = this.element,
			    windowWidth = window.innerWidth,
			    windowHeight = window.innerHeight,
			    width = element.getBoundingClientRect().width,
			    height = element.getBoundingClientRect().height;

			_helpers2.default.setStyle(element, {
				position: 'fixed',
				top: _helpers2.default.toPixels((windowHeight - height) / 2),
				left: _helpers2.default.toPixels((windowWidth - width) / 2)
			});
		}
	};

	exports.default = SoundBites;

	// setPosition: function() {
	// 		let element = this.element,
	// 			cell = this.containerCell,
	// 			cellRect = cell.getBoundingClientRect()

	// 		let top = Helpers.toPixels(cellRect.top),
	// 			left = Helpers.toPixels(cellRect.left)

	// 		Helpers.setStyle(element, { top: top, left: left })
	// 	},

	// 	setDimensions: function() {
	// 		let element = this.element,
	// 			cell = this.containerCell,
	// 			cellRect = cell.getBoundingClientRect(),
	// 			width = Helpers.toPixels(cellRect.width),
	// 			height = Helpers.toPixels(cellRect.height)

	// 		Helpers.setStyle(element, { width: width, height: height })
	// 	},

	// 	resizeHandler: function() {
	// 		this.setPosition()
	// 		this.setDimensions()
	// 	}

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	function AudioManager(filenames) {
		this.context = new (window.AudioContext || window.webkitAudioContext)();
		this.params = this.getDefaultAudioParams();
		this.buffers = [];
		this.filenames = filenames;
		this.playedDummySound = false; //	for proper iOS audio
	}

	AudioManager.prototype = {

		//	define default audio parameters

		getDefaultAudioParams: function getDefaultAudioParams() {
			return {
				gain: {
					enabled: true,
					value: .5,
					min: .5,
					max: 2
				},
				filter: {
					enabled: true,
					value: 1,
					maxFrequency: 3000,
					minFrequency: 500
				},
				reverse: {
					enabled: false
				},
				attack: {
					enabled: true,
					value: 0
				},
				envelope: {
					enabled: false,
					attack: 0,
					release: 1
				},
				region: {
					enabled: true,
					value: 0
				},
				pitch: {
					enabled: true,
					value: .5,
					min: -8,
					max: 8
				}
			};
		},

		//	from the array of buffer objects in this.buffers,
		//	return the buffer that matches <filename>

		getBufferByFilename: function getBufferByFilename(filename) {
			var buffers = this.buffers;

			var oneBuffer = buffers.filter(function (buffer) {
				return buffer.filename === filename;
			});

			if (oneBuffer.length === 0) return -1;

			if (oneBuffer.length > 1) {
				throw new Error('More than one buffer found for' + filename);
			}

			return oneBuffer[0].buffer;
		},

		//	return a promise to load a sound, given a filename

		loadSound: function loadSound(filename) {
			var ctx = this;

			return new Promise(function (resolve, reject) {
				var request = new XMLHttpRequest(),
				    fullfile = '/sounds/' + filename;

				request.open('GET', fullfile);
				request.responseType = 'arraybuffer';

				request.onload = function () {
					ctx.context.decodeAudioData(request.response, function (buffer) {
						resolve(buffer);
					});
				};

				request.onerror = function (err) {
					reject(err);
				};

				request.send();
			});
		},

		//	given an array of filenames, resolve each promise, and
		//	push an array of buffers to the object

		loadSounds: function loadSounds(filenames) {

			var promises = [],
			    buffers = this.buffers;

			for (var i = 0; i < filenames.length; i++) {
				promises.push(this.loadSound(filenames[i]));
			}

			var promise = Promise.all(promises).then(function (sounds) {
				for (var _i = 0; _i < sounds.length; _i++) {
					buffers.push({
						filename: filenames[_i],
						buffer: sounds[_i]
					});
				}
			}).catch(function (err) {
				console.log('An error ocurred');
			});

			return promise;
		},

		//	given a soundbite with filename and audioParam properties,
		//	get the buffer associated with <filename>, and play the sound
		//	with the params associated with <audioParams>

		processAndPlay: function processAndPlay(soundBite) {

			var filename = soundBite.filename,
			    audioParams = soundBite.audioParams,
			    buffer = this.getBufferByFilename(filename);

			if (buffer === -1) throw new Error('Could not find buffer');

			var context = this.context,
			    gain = context.createGain(),
			    filter = context.createBiquadFilter(),
			    source = context.createBufferSource(),
			    params = this.params,
			    duration = buffer.duration;

			//	overwrite the default parameters as necessary

			if (audioParams != null) {
				var keys = Object.keys(audioParams),
				    newObj = {};

				for (var i = 0; i < keys.length; i++) {
					newObj[keys[i]] = Object.assign({}, params[keys[i]], audioParams[keys[i]]);
				}

				params = Object.assign({}, params, newObj);
			}

			//	handle reverse playback

			if (params.reverse.enabled) {
				Array.prototype.reverse.call(buffer.getChannelData(0));
				Array.prototype.reverse.call(buffer.getChannelData(1));
			}

			//	handle gain

			var gainAdjustment = 1;

			if (params.gain.enabled) {
				gainAdjustment = this.transformToFullValue(params.gain.min, params.gain.max, params.gain.value);
			}

			gain.gain.value = gainAdjustment;

			//	handle attack / release

			if (params.attack.enabled) {
				var now = context.currentTime,
				    attack = now + params.attack.value * duration;

				gain.gain.cancelScheduledValues(0);
				gain.gain.setValueAtTime(0, now);
				gain.gain.linearRampToValueAtTime(gainAdjustment, attack);
			}

			if (params.envelope.enabled) {
				var _now = context.currentTime,
				    _attack = _now + params.envelope.attack * duration,
				    release = _attack + params.envelope.release * duration;

				gain.gain.cancelScheduledValues(0);
				gain.gain.setValueAtTime(0, _now);
				gain.gain.linearRampToValueAtTime(gainAdjustment, _attack);
				gain.gain.linearRampToValueAtTime(0, release);
			}

			//	handle filtering

			filter.type = 'lowpass';
			filter.frequency.value = 20000;

			if (params.filter.enabled) {
				if (params.filter.value == null) {
					throw new Error('If a filter is enabled, you must specify a frequency');
				}

				var maxFreq = params.filter.maxFrequency,
				    minFreq = params.filter.minFrequency,
				    freq = params.filter.value;

				if (freq > 1) freq = 1;
				if (freq < 0) freq = 0;

				var absoluteFrequency = this.transformToFullValue(minFreq, maxFreq, freq);

				filter.frequency.value = absoluteFrequency;
			}

			//	handle clip start offset

			var startOffset = 0;

			if (params.region.enabled) {
				startOffset = params.region.value * duration;
			}

			//	handle pitch shifting

			var semitone = 0;

			if (params.pitch.enabled) {
				semitone = this.transformToFullValue(params.pitch.min, params.pitch.max, params.pitch.value);
			}

			source.playbackRate.value = Math.pow(2, semitone / 12);

			//	finally, play

			source.buffer = buffer;
			source.connect(filter);
			filter.connect(gain);
			gain.connect(context.destination);

			source.start(0, startOffset);
		},

		transformToFullValue: function transformToFullValue(min, max, percentage) {
			return Math.round((max - min) * percentage + min);
		},

		playDummySound: function playDummySound() {
			if (this.playedDummySound) return;

			var buffer = this.context.createBuffer(1, 1, 22050),
			    source = this.context.createBufferSource();

			source.buffer = buffer;
			source.connect(this.context.destination);
			source.start(0);

			this.playedDummySound = true;
		}

	};

	exports.default = AudioManager;

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	function Sequencer(soundBites, audioManager, grid) {

		this.dimensions = {
			columns: grid.dimensions.cols,
			rows: grid.dimensions.rows
		};
		this.audioManager = audioManager;
		this.soundBites = soundBites;
		this.direction = 'columns';
		this.speed = 300;
		this.minSpeed = 100;
		this.maxSpeed = 800;
		this.speedStep = 50;
		this.loopId = null;
		this.iteration = 0;
		this.isPlaying = false;
	}

	Sequencer.prototype = {
		constructor: Sequencer,

		loop: function loop() {
			var soundBites = this.soundBites,
			    direction = this.direction,
			    audioManager = this.audioManager,
			    ctx = this,
			    dimension = this.dimensions[direction];

			this.isPlaying = true;

			this.loopId = setInterval(function () {
				var iteration = ctx.iteration,
				    dockedBites = soundBites.getInUseBitesInRowOrColumn(direction, iteration);

				iteration++;

				if (iteration > dimension - 1) iteration = 0;

				ctx.iteration = iteration;

				if (dockedBites.length === 0) return;

				for (var i = 0; i < dockedBites.length; i++) {
					audioManager.processAndPlay(dockedBites[i]);
				}
			}, this.speed);
		}

	};

	exports.default = Sequencer;

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var templates = [{ filename: 'between_friends_hi.mp3', color: 'blue' }, { filename: 'celeste_piano_c_e.mp3', color: 'red' }, { filename: 'celeste_piano_g_e.mp3', color: 'green' }, { filename: 'note_a.mp3', color: 'white' }];

	exports.templates = templates;

/***/ }
/******/ ]);