import Helpers from './helpers.js'
import SoundSelector from './soundselector.js'
import ViewTemplate from './viewtemplate.js'

function Grid(container) {

	this.dimensions = {
		rows: 6, cols: 8
	}

	this.container = container
	this.cells = []
	this.controls = null
	this.soundSelector = null

	this.view = this.create()
}

Grid.prototype = {

	constructor: Grid,

	dock: function(soundbite) {

		//	if we didn't initiate a touch with the mouse on the element
		//	don't dock

		if (!soundbite.beganWithMouseDown) return;
		soundbite.beganWithMouseDown = false

		//	only dock the element if we're within the grid

		if (!this.isInsideGridBounds(soundbite.element)) return;

		//	find the closest nearby cell

		let closestCell = this.nearestEmptyCell(soundbite.element),
			cellElement = closestCell.element

		//	update the soundbite's properties to reflect the docking

		soundbite.setDocked(closestCell.id)

		//	add it to the parent, and mark that the parent encloses an element

		cellElement.appendChild(soundbite.element)
		closestCell.isEmpty = false
	},

	undock: function(soundbite, event) {

		let dockedCell = this.getCellById(soundbite.gridId)

		if (dockedCell === -1) return;

		dockedCell.element.removeChild(soundbite.element)
		soundbite.template.container.appendChild(soundbite.element)
		dockedCell.isEmpty = true

		soundbite.setUndocked(event)
	},

	isInsideGridBounds(element) {
		let gridRect = this.grid.getBoundingClientRect(),
			elementRect = element.getBoundingClientRect(),
			elementWidth = elementRect.width,
			elementHeight = elementRect.height,
			adjustedPosition = { 
				left: elementRect.left + elementWidth/2,
				top: elementRect.top + elementHeight/2,
				right: elementRect.right - elementWidth/2,
				bottom: elementRect.bottom - elementHeight/2
			}

		if ((adjustedPosition.left < gridRect.left) || 
			(adjustedPosition.top < gridRect.top)) {
			return false
		}

		if ((adjustedPosition.right > gridRect.right) ||
			(adjustedPosition.bottom > gridRect.bottom)) {
			return false
		}

		return true
	},

	getEmptyCells: function() {
		return this.cells.filter(function(cell) { return cell.isEmpty === true })
	},

	getCellById: function(id) {
		let cell = this.cells.filter(function(cell) { return cell.id === id })
		if (cell.length === 0) return -1;
		return cell[0]
	},

	nearestEmptyCell: function(element) {
		let cells = this.getEmptyCells(),
			position = element.getBoundingClientRect()

		let min = cells.reduce(function(offsets, cell, i) {
			let cellPosition = cell.element.getBoundingClientRect(),
				x = Math.abs(position.left - cellPosition.left),
				y = Math.abs(position.top - cellPosition.top)

			if ((i === 0) || ((x <= offsets.x) && (y <= offsets.y))) {
				Object.assign(offsets, { x: x, y: y, id: cell.id })
			}
			return offsets
		},{})

		return cells.filter(function(cell) { return cell.id === min.id })[0]
	},

	//	draw + create the grid

	create: function() {

		//	define the control text and ids

		let controlIds = ['play', 'direction', 'effects', 'newSound'],
			controlText = ['&#128075;', 'direc', 'fx', '+']

		//	create the basic grid from the ViewTemplate

		let view = new ViewTemplate(
			this.container,
			[{
				stickyHeader: true,
				className: 'grid__controls',
				cellClassName: 'grid__cell__controls',
				rows: 1,
				cols: 4,
				innerText: controlText,
				ids: controlIds
			},
			{
				className: 'grid__sounds',
				rows: this.dimensions.rows,
				cols: this.dimensions.cols,
				ids: 'auto'
			}])

		//	get the control elements separately

		this.controls = {
			play: view.getCellById('play'),
			direction: view.getCellById('direction'),
			effects: view.getCellById('effects'),
			newSound: view.getCellById('newSound')
		}

		//	get the grid section separately

		this.grid = view.container

		//	get the cells separately

		let cells = []

		view.getCellsInSection('grid__sounds')
			.map(function(cell) {
				cells.push({
					element: cell,
					id: cell.id,
					isEmpty: true
				})
			})

		this.cells = cells

		//	display the grid, and keep it centered in the viewport

		this.style(view)

		view.addToDocument()
		view.keepCentered()
		view.hide()

		return view
	},

	style: function(view) {
		view.getAllCells()
			.map(function(cell) {
				Helpers.setStyle(cell, {
					backgroundColor: Helpers.toRGB(20,200, Helpers.randInt(0,255))	
				})
			})
	},

	//	control display

	hide: function() { this.view.hide() },

	show: function() { this.view.show() }
}

export default Grid