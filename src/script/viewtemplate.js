import Helpers from './helpers.js'

function ViewTemplate(wrapper, sections, options) {

	this.wrapper = wrapper
	this.container = this.createDiv({ className: 'container' })
	this.sections = sections
	this.cells = []

	this.defaults = {
		stickyHeaderClassName: 'sticky-header',
		contentClassName: 'content',
		cellClassName: 'cell',
		rowClassName: 'row'
	}

	if (options != null) {
		if (options.name != null) this.container.classList.add(options.name);
	}

	this.wrapper.appendChild(this.container)
	this.create()
}

ViewTemplate.prototype = {

	constructor: ViewTemplate,

	create: function() {
		let ctx = this
		this.sections.map(function(section) {
			ctx.createSection(section)
		})
	},

	createSection: function(section) {
		let container = this.container,
			className = section.stickyHeader ? this.defaults.stickyHeaderClassName : this.defaults.contentClassName

		section.element = this.createDiv({ className: className })

		if (section.className != null) section.element.classList.add(section.className);

		for (let i=0; i<section.rows; i++) {
			section.rowN = i
			this.createRow(section)
		}

		this.container.appendChild(section.element)
	},

	createRow: function(section) {
		let row = this.createDiv({ className: this.defaults.rowClassName }),
			nCells = section.cols,
			cellClassName = this.defaults.cellClassName

		if (section.rowClassName != null) {
			row.classList.add(section.rowClassName)
		}

		for (let i=0; i<nCells; i++) {
			let appliedClassName = cellClassName

			//	if specifying a class for all cells

			if (section.cellClassName != null) {
				appliedClassName = cellClassName + ' ' + section.cellClassName
			}

			//	if specifying a class for cell[0], cells[1], ... 

			if (section.cellClassPattern != null) {
				appliedClassName = appliedClassName + ' ' + section.cellClassPattern[i]
			}

			let cell = this.createDiv({ className: appliedClassName })

			row.appendChild(cell)

			this.cells.push({
				element: cell,
				section: section.className
			})

			if (section.ids != null) {
				if (section.ids === 'auto') {
					cell.id = section.rowN.toString() + ',' + i.toString()
					continue;
				}

				cell.id = section.ids[i]
			}

			if (section.innerText != null) {
				cell.innerText = section.innerText[i]
			}
		}

		section.element.appendChild(row)
	},

	createDiv: function(options) {
		let div = document.createElement('div')

		if (options == null) return div;

		if (options.className != null) div.className = options.className;
		if (options.id != null) div.id = options.id;

		return div
	},

	addToDocument: function() {
		document.body.appendChild(this.wrapper)
	},

	//	keep the container centered

	center: function() {
		let container = this.container,
			containerRect = container.getBoundingClientRect(),
			position = Helpers.getElementCenterInViewport(containerRect.width, containerRect.height)

		position.top = Helpers.toPixels(position.top),
		position.left = Helpers.toPixels(position.left)

		Helpers.setStyle(container, position)
	},

	keepCentered: function() {
		this.center()
		window.addEventListener('resize', this.center.bind(this))
	},

	//	get elements

	getSectionByClassName: function(className) {
		let sections = this.sections

		return sections.filter(function(section) { return section.className === className })
	},

	getCellById: function(id) {
		let cells = this.getAllCells()

		return cells.filter(function(cell) { return cell.id === id })[0]
	},

	getAllCells: function() {
		return this.cellReducer(this.cells)
	},

	getCellsInSection: function(className) {
		let cells = this.cells.filter(function(cell) { return cell.section === className })

		if (cells.length === 0) return -1;

		return this.cellReducer(cells)
	},

	cellReducer: function(cells) {
		return cells.reduce(function(store, cell) {
			store.push(cell.element)
			return store
		},[])
	},

	hide: function() {
		this.wrapper.classList.add('hidden')
	},

	show: function() {
		this.wrapper.classList.remove('hidden')
		this.center()
	}

}

export default ViewTemplate