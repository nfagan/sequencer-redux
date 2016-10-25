import ViewTemplate from './viewtemplate.js'

function SoundSelector(container, bites) {

	this.bites = bites
	this.container = container
	this.controls = {}
	this.view = this.create()
	this.addBites()

}

SoundSelector.prototype = {
	constructor: SoundSelector,

	create: function() {

		//	create the basic grid from the ViewTemplate

		let nCols = 2,
			nRows = Math.ceil(this.bites.original.length / nCols)

		let view = new ViewTemplate(
			this.container,
			[{
				className: 'soundSelector__sounds',
				cellClassName: 'soundSelector__cell',
				rowClassName: 'soundSelector__row',
				rows: nRows,
				cols: nCols,
				ids: []
			}],
			{ name: 'soundSelector' })

		view.addToDocument()
		view.keepCentered()
		view.hide()

		// this.controls.select = view.getCellById('soundSelector__select')
		// this.controls.close = view.getCellById('soundSelector__close')

		this.controls.close = view.getSectionByClassName('soundSelector__sounds')[0].element

		return view

	},

	addBites: function() {
		let view = this.view,
			cells = view.getCellsInSection('soundSelector__sounds'),
			bites = this.bites.original

		for (let i=0; i<bites.length; i++) {
			cells[i].appendChild(bites[i].element)
		}

	},

	//	control displaying

	hide: function() { this.view.hide() },

	show: function() { this.view.show() }

}

export default SoundSelector

// let view = new ViewTemplate(
// 	this.container,
// 	[{
// 		stickyHeader: true,
// 		className: 'soundSelector__header',
// 		cellClassName: 'soundSelector__cell__header',
// 		innerText: ['', ''],
// 		ids: ['soundSelector__close', ''],
// 		rows: 1,
// 		cols: 1,
// 	},
// 	{
// 		className: 'soundSelector__sounds',
// 		cellClassName: 'soundSelector__cell',
// 		rowClassName: 'soundSelector__row',
// 		rows: nRows,
// 		cols: nCols,
// 		ids: []
// 	},
// 	{
// 		stickyFooter: true,
// 		className: 'soundSelector__footer',
// 		cellClassName: 'soundSelector__cell__footer',
// 		rows: 1,
// 		cols: 1
// 	}
// 	],
// 	{ name: 'soundSelector' })