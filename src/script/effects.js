import Helpers from './helpers.js'
import ViewTemplate from './viewtemplate.js'
const interact = require('interact.js')

function Effects(container) {

	this.container = container
	this.view = null
	this.controls = {}
	this.effects = {}

	this.effectTemplates = [
		{ name: 'gain', innerText: '&#128266;' },
		{ name: 'filter', innerText: '&#128584;' },
		{ name: 'pitch', innerText: '&#128585;' },
		{ name: 'attack', innerText: '&#128586;' },
		{ name: 'region', innerText: '&#127881;' },
		{ name: 'reverse', innerText: '&#127803;' }
	]

	this.soundBite = null

	this.create()
	this.slider()
}

Effects.prototype = {

	constructor: Effects,

	create: function() {

		//	create the basic grid from the ViewTemplate

		let view = new ViewTemplate(
			this.container,
			[{
				stickyHeader: true,
				className: 'effects__header',
				cellClassName: 'effects__cell__header',
				innerText: ['&#10003;', 'play'],
				ids: ['effects__close', 'effects__playSound'],
				rows: 1,
				cols: 1,
			},
			{
				className: 'effects__effects',
				cellClassName: 'effects__cell',
				cellClassPattern: ['effects__cell__name', 'effects__cell__effect'],
				rowClassName: 'effects__row',
				rows: 0,
				cols: 2,
				ids: []
			}],
			{ name: 'effects' })

		view.addToDocument()
		view.keepCentered()
		view.hide()

		//	keep a reference to the control elements

		this.controls.close = view.getCellById('effects__close')

		//	add the view module

		this.view = view

		//	create the effects

		this.createEffects()
	},

	createEffect: function(template) {
		let view = this.view,
			section = view.getSectionByClassName('effects__effects')[0],
			canvas = document.createElement('canvas')

		canvas.className = 'effects__canvas'

		section.ids = ['', template.name]
		section.innerText = [template.innerText, '']

		view.createRow(section)
		view.getCellById(template.name).appendChild(canvas)

		this.effects[template.name] = { canvas: canvas }
	},

	createEffects: function() {
		let templates = this.effectTemplates

		for (let i=0; i<templates.length; i++) {
			this.createEffect(templates[i])
		}
	},

	//	get the percentage of the canvas width that the user
	//	clicked / dragged

	getXPercent: function(event) {
		let canvas = event.target,
			canvasLeft = canvas.getBoundingClientRect().left,
			canvasRight = canvas.getBoundingClientRect().right,
			clientX = event.clientX,
			percentage = (clientX - canvasLeft)/(canvasRight - canvasLeft)

		return percentage
	},

	drawRectangle: function(canvas, percent) {
		let ctx = canvas.getContext('2d'),
			width = canvas.width * percent

		ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctx.fillRect(0, 0, width, canvas.height)
	},

	//	set up canvas drag event listeners

	slider: function() {
		let ctx = this

		function assignValues(event) {
			let type = event.target.parentNode.id,
				percent = ctx.getXPercent(event),
				soundBite = ctx.soundBite

			soundBite.audioParams[type].value = percent
		}

		function draw(event) {
			ctx.drawRectangle(event.target, ctx.getXPercent(event))
		}

		interact('.effects__canvas')
			.draggable({
				restrict: {
					restriction: 'self'
		    	},
		    	max: Infinity
		  	})
		  	.on('dragmove', function(event) {
		  		assignValues(event)
				draw(event)
		  	})
		  	.on('click', function(event) {
				assignValues(event)
				draw(event)
		  	})
	},

	show: function(soundBite) {
		this.view.show()
		this.soundBite = soundBite
		this.slider()

		let effectNames = Object.keys(this.effects)

		for (let i=0; i<effectNames.length; i++) {
			let currentValue = soundBite.audioParams[effectNames[i]].value,
				currentCanvas = this.effects[effectNames[i]].canvas

			this.drawRectangle(currentCanvas, currentValue)
		}
	},

	hide: function() { this.view.hide() }

}

export default Effects