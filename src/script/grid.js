import Helpers from './helpers.js'
import SoundSelector from './soundselector.js'

function Grid(container) {

	this.dimensions = {
		rows: 6, cols: 8
	}

	this.container = container
	this.grid = null
	this.cells = []
	this.controls = null
	this.soundSelector = null
}

Grid.prototype = {

	constructor: Grid,

	dock: function(soundbite) {

		//	only dock the element if we're within the grid

		if (!this.isInsideGridBounds(soundbite.element)) return;

		//	find the closest nearby cell

		let closestCell = this.nearestEmptyCell(soundbite.element),
			gridId = closestCell.id,
			cellElement = closestCell.element

		//	update the soundbite's properties to reflect the docking

		soundbite.setDocked(gridId)

		//	add it to the parent, and mark that the parent encloses an element

		cellElement.appendChild(soundbite.element)
		closestCell.isEmpty = false
	},

	undock: function(element) {

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

	//	draw the grid

	create: function() {
		let container = this.container,
			grid = document.createElement('div')

		grid.className = 'grid'

		this.grid = grid
		this.createControls(grid)
		this.createInitialCells(grid)
		this.createSoundSelectorDropdown()

		container.appendChild(grid)
		document.body.appendChild(container)
	},

	//	create the soundbite container

	createSoundSelectorDropdown: function() {
		let selectorContainer = this.controls.newSound
		this.soundSelector = new SoundSelector(selectorContainer)
	},

	//	create the top row of the grid: the sticky-header controls

	createControls: function(gridElement) {
		let controls = Helpers.createDiv({ className: 'controls' }),
			classNames = ['cell', 'cell__controls'],
			innerText = ['play', 'direc', 'fx', '+'],
			ids = innerText,
			cells = Helpers.createRow(4, classNames, innerText, ids)

		controls.appendChild(cells)
		gridElement.appendChild(controls)

		this.controls = {
			play: cells.childNodes[0],
			direction: cells.childNodes[1],
			effects: cells.childNodes[2],
			newSound: cells.childNodes[3]
		}
	},

	//	create the initial rows into which elements can be docked

	createInitialCells: function(gridElement) {
		let sounds = document.createElement('div'),
			nRows = this.dimensions.rows,
			nCols = this.dimensions.cols,
			cells = []

		for (let i=0; i<nRows; i++) {

			//	create a row with classNames 'cell' and 'cell__soundContainer'

			let row = Helpers.createRow(nCols, ['cell', 'cell__soundContainer'])

			//	add ids such that each cell is marked 0,0 ... 1,1 ... etc.

			Helpers.addIds(row, i)

			//	add the row to the sounds div

			sounds.appendChild(row)

			//	add a reference to each child cell to the grid object

			Array.prototype.map.call(row.childNodes, function(node) {
				cells.push({
					element: node,
					id: node.id,
					isEmpty: true
				})
			})
		}

		this.cells = cells

		sounds.className = 'sounds'
		gridElement.appendChild(sounds)
	},

	//	center the grid in the viewport

	center: function() {
		let grid = this.grid,
			gridRect = grid.getBoundingClientRect(),
			position = Helpers.getElementCenterInViewport(gridRect.width, gridRect.height)

		position.top = Helpers.toPixels(position.top),
		position.left = Helpers.toPixels(position.left)

		Helpers.setStyle(grid, position)
	},

	//	show controls

	showNewSoundsButton: function() {
		this.soundSelector.show()
	},

	hideNewSoundsButton: function() {
		this.soundSelector.hide()
	}
}

export default Grid