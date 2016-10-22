import AudioManager from './audiomanager.js'
import Helpers from './helpers.js'

const tween = require('../../node_modules/gsap/src/minified/TweenMax.min.js')

//	SoundBites is an array of soundbites

function SoundBites(audioParams, templates) {

	this.templates = templates

	this.original = this.templates.map(function(temp) {
		temp.type = 'dockedInSoundSelector'
		temp.audioParams = audioParams
		return new SoundBite(temp)
	})

	this.inuse = []
	this.all = []
	this.getAllBites()
}

SoundBites.prototype = {
	constructor: SoundBites,

	createBite: function(template) {
		this.inuse.push(new SoundBite(template))
		this.getAllBites()
	},

	getAllBites: function() {
		this.all = this.all.concat(this.original, this.inuse)
	},

	getBiteById: function(id) {
		let found = this.all.filter(function(bite) { return bite.id === id })
		if (found.length === 0) return -1;
		return found[0]
	},

	getInUseBitesInRowOrColumn: function(type, n) {
		let bites = this.inuse

		return bites.filter(function(bite) {
			if (bite.isDocked === false) return false;

			let currentId = bite.gridId,
				indexOfStrComponent = 0,
				splitString = currentId.split(',')

			if (type === 'columns') indexOfStrComponent = 1;

			return splitString[indexOfStrComponent] === n.toString()
		})
	},

	getFilenames: function() {
		return this.templates.filter(function(template) { template.filename })
	}
}

//	an individual soundbite

function SoundBite(template) {

	this.classNames = {
		base: 'soundbite',
		inGrid: 'soundbite__grid',
		dockedInGrid: 'soundbite__grid__docked',
		undockedInGrid: 'soundbite__grid__undocked',
		dockedInSoundSelector: 'soundbite__soundSelector',
	}
	this.id = Helpers.randId('soundbite_')
	this.gridId = null
	this.isDocked = false
	this.audioParams = template.audioParams
	this.filename = template.filename
	this.color = template.color
	this.template = template

	this.element = Helpers.createDiv({ className: this.classNames.base, id: this.id })
	Helpers.setStyle(this.element, { backgroundColor: this.color })

	if (template.type != null) {
		let additionalClass = this.classNames[template.type]
		this.element.classList.add(additionalClass)
	}

	if (template.container != null) {
		template.container.appendChild(this.element)
	}

	if (template.makeCenter) {
		let position = this.center() 
		this.animateElementPopIn(position)
	}
}

SoundBite.prototype = {
	constructor: SoundBite,

	setDocked: function(id) {
		let element = this.element

		//	get rid of the element's style attributes

		element.removeAttribute('style')

		element.style.backgroundColor = this.color

		element.setAttribute('data-x', 0)
		element.setAttribute('data-y', 0)

		//	make it inherit the style of its parent

		element.classList.remove(this.classNames.undockedInGrid)
		element.classList.add(this.classNames.dockedInGrid)

		//	mark as docked, and take note of the row / col
		//	in which we're docked

		this.gridId = id
		this.isDocked = true
	},

	setUndocked: function(event) {
		let element = this.element,
			dockedClass = this.classNames.dockedInGrid,
			undockedClass = this.classNames.undockedInGrid,
			elementRect = element.getBoundingClientRect()

		element.classList.remove(dockedClass)
		element.classList.add(undockedClass)

		Helpers.setStyle(element,
		{	
			backgroundColor: this.template.color,
			position: 'fixed',
			top: Helpers.toPixels(event.clientY - 50/2),
			left: Helpers.toPixels(event.clientX - 50/2)
		})

		element.setAttribute('data-x', 0)
		element.setAttribute('data-y', 0)

		this.isDocked = false
		this.gridId = null
	},

	center: function() {
		let element = this.element,
			windowWidth = window.innerWidth,
			windowHeight = window.innerHeight,
			width = element.getBoundingClientRect().width,
			height = element.getBoundingClientRect().height,
			top = Helpers.toPixels((windowHeight - height) / 2),
			left = Helpers.toPixels((windowWidth - width)/2)

		Helpers.setStyle(element,
		{
			position: 'fixed',
			top: top,
			left: left
		})

		return { top: top, left: left }
	},

	animateElementPopIn: function(position) {
		let circle = document.createElement('div')
			Helpers.setStyle(circle,
			{
				position: 'fixed',
				top: position.top, 
				left: position.left,
				borderRadius: '50%',
				borderWidth: 'thick',
				borderColor: 'black',
				opacity: '1',
				backgroundColor: 'gray',
				height: '50px',
				width: '50px'
			})

		document.body.appendChild(circle)

		let tl = new TimelineMax()
		tl.to(circle, .4, { css: { 'transform': 'scale(2,2)', 'opacity': '0' } })
		setTimeout( () => document.body.removeChild(circle),400)
	},
}

export default SoundBites


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