import Helpers from './helpers.js'
import Effects from './effects.js'
import Grid from './grid.js'
import SoundBites from './soundbites.js'
import SoundSelector from './soundselector.js'
import AudioManager from './audiomanager.js'
import Sequencer from './sequencer.js'
import { templates } from './audiotemplates.js'

const interact = require('interact.js')
require('../../node_modules/gsap/src/minified/TweenMax.min.js')

/*
	Inteface interfaces between all views -- grid view, 
	effects view, and sound selection view
*/

function Interface() {

	//	establish containers in which to insert the views

	let gridContainer = Helpers.createDiv({ className: 'grid__container' }),
		effectsContainer = Helpers.createDiv({ className: 'effects__container' }),
		soundSelectorContainer = Helpers.createDiv( {className: 'soundSelector__container' })

	//	get the audio templates

	let filenames = templates.map(function(temp) { return temp.filename })

	//	create the views
	let audioManager = new AudioManager(filenames),
		effects = new Effects(effectsContainer),
		grid = new Grid(gridContainer),
		soundBites = new SoundBites(audioManager.getDefaultAudioParams(), templates),
		soundSelector = new SoundSelector(soundSelectorContainer, soundBites),
		sequencer = new Sequencer(soundBites, audioManager, grid)

	this.audioManager = audioManager
	this.sequencer = sequencer
	this.soundBites = soundBites
	this.effects = effects
	this.grid = grid
	this.soundSelector = soundSelector

	//	show the grid only

	this.changeState('SELECT_SOUNDS')

	//	configure events

	this.listen()

	//	start the looping

	this.audioManager.loadSounds(audioManager.filenames)
		.then(function() {
			sequencer.loop()
		})
}

Interface.prototype = {

	constructor: Interface,

	listen: function() {
		this.handleEffectsButton()
		this.handleEffectsCloseButton()
		this.handleSoundSelectorButton()
		this.handleSoundSelectorCloseButton()
		this.handleSoundSelectorSoundBites()
		this.handleGridSoundBites()
		this.handleSequencerPlayButton()
		this.handleSequencerDirectionButton()
	},

	changeState: function(state, target) {
		let effects = this.effects,
			soundSelector = this.soundSelector,
			grid = this.grid,
			soundBites = this.soundBites

		if (state === 'GRID') {
			effects.hide()
			soundSelector.hide()
			grid.show()

			this.state = state
		}

		if (state === 'SELECT_SOUNDS') {
			soundBites.clearAnimations('effects')
			effects.hide()
			grid.hide()
			soundSelector.show()

			this.state = state
		}

		if (state === 'AWAITING_EFFECTS') {
			soundBites.clearAnimations('effects')
			soundBites.animateEffectSelection()
			this.state = state
		}

		if (state === 'EFFECTS') {
			soundBites.clearAnimations('effects')
			grid.hide()
			soundSelector.hide()
			effects.show(target)

			this.state = state
		}

		console.log('current state is', this.state)
	},

	//	sequencer controls

	handleSequencerPlayButton: function() {
		let playButton = this.grid.controls.play,
			sequencer = this.sequencer,
			ctx = this

		playButton.addEventListener('click', function() {
			sequencer.togglePlaying()
			ctx.animateButtonPress(playButton)
		})
	},

	handleSequencerDirectionButton: function() {
		let directionButton = this.grid.controls.direction,
			sequencer = this.sequencer,
			ctx = this

		directionButton.addEventListener('click', function() {
			sequencer.toggleDirection()
			ctx.animateButtonPress(directionButton)
		})
	},

	//	effect control handlers

	handleEffectsButton: function() {
		let effectsButton = this.grid.controls.effects,
			ctx = this

		effectsButton.addEventListener('click', function() {
			ctx.changeState('AWAITING_EFFECTS')
			ctx.animateButtonPress(effectsButton)
		})
	},

	handleEffectsCloseButton: function() {
		let closeButton = this.effects.controls.close,
			ctx = this

		closeButton.addEventListener('click', function() {
			ctx.changeState('GRID')
		})
	},

	//	sound selector control handlers

	handleSoundSelectorButton: function() {
		let soundSelectorButton = this.grid.controls.newSound,
			ctx = this

		soundSelectorButton.addEventListener('click', function() {
			ctx.changeState('SELECT_SOUNDS')
			ctx.animateButtonPress(soundSelectorButton)
		})

	},

	handleSoundSelectorCloseButton: function() {
		let closeButton = this.soundSelector.controls.close,
			ctx = this

		interact(closeButton).
			on('doubletap', function() {
				ctx.changeState('GRID')
			})

		// closeButton.addEventListener('click', function() {
		// 	ctx.changeState('GRID')
		// })
	},

	//	sound bites handling while in SoundSelection

	handleSoundSelectorSoundBites: function() {
		let ctx = this,
			grid = this.grid,
			audioManager = this.audioManager,
			soundBites = this.soundBites,
			oneBite = soundBites.original[0],
			biteClass = '.' + oneBite.classNames.dockedInSoundSelector

		//	create a new bite on double tap

		interact(biteClass)
			.on('down', function(event) {

				//	to make web audio work properly in iOS

				audioManager.playDummySound()

				//	identify which kind of soundbite to create

				let target = soundBites.getBiteById(event.target.id),
					template = target.template,
					container = grid.container

				//	change relevant bits of the template

				template.type = 'inGrid'
				template.container = container
				template.audioParams = ctx.audioManager.getDefaultAudioParams()
				template.makeCenter = true	//	center the element

				//	show the grid

				ctx.changeState('GRID')

				//	create the soundbite and add it to the document

				soundBites.createBite(template)
			})

	},

	handleGridSoundBites: function() {
		let soundBites = this.soundBites,
			grid = this.grid,
			oneBite = soundBites.original[0],
			biteClass = '.' + oneBite.classNames.inGrid,
			ctx = this

		//	handle drag and drop on the grid -- release

		function elementRelease(event) {
			let target = soundBites.getBiteById(event.target.id)
			grid.dock(target)
		}

		//	handle pickup

		function elementPickup(event) {
			let target = soundBites.getBiteById(event.target.id)
			target.beganWithMouseDown = true
			target.clearAnimation('playing')
			grid.undock(target, event)
		}

		//	handle effect selection

		function effectSelection(event) {
			let target = soundBites.getBiteById(event.target.id)
			ctx.changeState('EFFECTS', target)
		}

		//	add the interactivity

		interact(biteClass)

			// make draggable

			.draggable({ enabled: true, onmove: Helpers.dragMoveListener })

			//	determine whether to pick up the element or 
			//	show the effects view

			.on('down', function(event) {
				let state = ctx.state

				if (state === 'GRID') {
					elementPickup(event)
				}

				if (state === 'AWAITING_EFFECTS') {
					effectSelection(event)
				}
			})

			//	release element on mouseup / touchup

			.on('up', elementRelease)

			//	show the effects view if double clicking an element

			.on('doubletap', function(event) {
				effectSelection(event)
			})
	},

	//	animations

	animateButtonPress: function(element) {
		let tl = new TimelineMax(),
			body = document.querySelector('body'),
			fontSize = window.getComputedStyle(body).getPropertyValue('font-size')

		tl.to(element, .15, { css: { 'fontSize': '30px' } })
			.to(element, .15, { css: { 'fontSize': fontSize } })
	}

}

export default Interface

