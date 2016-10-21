import Helpers from './helpers.js'

function Effects(container) {

	//	create the effects module with className 'effects'

	let effectsElement = Helpers.createDiv({ className: 'effects' })
	container.appendChild(effectsElement)

	//	define the effects that allow manipulation

	let effects = [
		{ name: 'volume', interactCanvas: null },
		{ name: 'attack', interactCanvas: null },
		{ name: 'release', interactCanvas: null },
		{ name: 'pitch', interactCanvas: null },
	]

	this.container = container
	this.effectsElement = effectsElement
	this.effects = effects

	for (let i=0; i<effects.length; i++) {
		this.createEffect(effects[i])
	}

	document.body.appendChild(container)
}

Effects.prototype = {

	constructor: Effects,

	createEffect: function(template) {
		let effectsElement = this.effectsElement,
			row = Helpers.createDiv({ className: 'effects__row' }),
			interactCanvas = Helpers.createDiv({ className: 'effects__item effects__item__effect', id: template.name })

		row.appendChild(Helpers.createDiv({ className: 'effects__item' }))
		row.appendChild(interactCanvas)
		row.appendChild(Helpers.createDiv({ className: 'effects__item effects__item__switch' }))

		effectsElement.appendChild(row)

		template.interactCanvas = interactCanvas

		this.createInteractCanvas(template)
	},

	createInteractCanvas: function(template) {

		function canvasCreator(id) {
			let canvas = document.createElement('canvas'),
				container = template.interactCanvas

			container.appendChild(canvas)

			canvas.style.height = '100%'
			canvas.style.width = '100%'

			return canvas
		}

		function drawRectangle(width) {
			ctx.clearRect(0, 0, canvas.width, canvas.height)
			ctx.fillRect(0, 0, width, canvas.height)
		}

		function getRectangleDimensions(canvas, event) {
			return getXPercent(canvas, event) * canvas.width
		}

		let canvas = canvasCreator(template.id),
			ctx = canvas.getContext('2d')

		drawRectangle(40)
	},

	show: function() { this.container.style.zIndex = '2' },

	hide: function() { this.container.style.zIndex = '1' }

}

export default Effects