function SoundBite(container) {
	this.element = document.createElement('div')
	this.undockedClassName = 'soundbite'
	this.dockedClassName = 'cell__sound'
	this.element.className = this.undockedClassName
	this.gridId = null
	this.isDocked = false

	container.appendChild(this.element)
}

SoundBite.prototype = {
	constructor: SoundBite,

	setDocked: function(id) {

		//	get rid of the element's style attributes

		this.element.removeAttribute('style')

		//	make it inherit the style of its parent

		this.element.className = this.dockedClassName

		//	mark as docked, and take note of the row / col
		//	in which we're docked

		this.gridId = id
		this.isDocked = true
	},

	setUndocked: function() {

		this.element.addAttribute('style')
		this.element.className = this.undockedClassName
		this.isDocked = false
		this.gridId = null
	}
}

export default SoundBite