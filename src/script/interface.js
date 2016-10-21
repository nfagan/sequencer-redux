import Helpers from './helpers.js'
import Effects from './effects.js'
import Grid from './grid.js'
import SoundBite from './soundbite.js'

function Interface() {

	let gridContainer = Helpers.createDiv({ className: 'grid__container' }),
		effectsContainer = Helpers.createDiv({ className: 'effects__container' })

	this.effects = new Effects(effectsContainer)
	this.grid = new Grid(gridContainer)

}

Interface.prototype = {

	constructor: Interface,

	init: function() {
		this.grid.create()
		this.grid.center()
	},

	listen: function() {
		this.handleResize()
		this.handleNewSoundsButton()
	},

	handleResize: function() {
		window.addEventListener('resize', this.grid.center.bind(this.grid))
	},

	handleNewSoundsButton: function() {
		let grid = this.grid,
			effects = this.effects,
			newSoundsButton = grid.controls.newSound

		//	when clicking on + button, show the sound selection panel

		newSoundsButton.addEventListener('click', function(event) {
			event.stopPropagation()
			grid.showNewSoundsButton()
		})

		//	when clicking on the grid, hide the sound selection panel

		grid.grid.addEventListener('click', function(event) {
			grid.hideNewSoundsButton()
			effects.show()
		})
	}

}

export default Interface

// let promise = new Promise(function(resolve, reject) {
// 			grid.create()
// 			resolve()
// 		})

// 		promise.then(function(){
// 			grid.center()
// 			window.addEventListener('resize', function() {
// 				grid.center()
// 			})
// 		})

// (function() {
// 	let container = document.createElement('div')
// 	container.className = 'grid__container'

// 	let grid = new Grid(container)
// 	let promise = new Promise(function(resolve, reject) {
// 		grid.create()
// 		resolve()
// 	})

// 	promise.then(function(){
// 		grid.center()
// 		window.addEventListener('resize', function() {
// 			grid.center()
// 		})
// 	})

// 	let soundbites = []

// 	for (let i=0; i<5; i++) {
// 		soundbites.push(new SoundBite(document.body))
// 	}

// 	setTimeout(function() {
// 		for (let i=0; i<5; i++) {
// 			grid.soundSelector.appendChild(soundbites[i])
// 		}
// 	},200)

// })();

