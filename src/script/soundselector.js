function SoundSelector(container) {
	let selector = document.createElement('div'),
		className = 'soundSelector'

	selector.className = className
	container.appendChild(selector)

	this.visibility = null
	this.element = selector
	this.className = className
	this.hide()
}

SoundSelector.prototype = {
	constructor: SoundSelector,

	appendChild: function(soundbite) {
		this.element.appendChild(soundbite.element)
	},

	show: function() {
		let className = this.className
		this.element.className = className + ' ' + className + '--visible'
		this.visibility = 'visible'
	},

	hide: function() {
		let className = this.className
		this.element.className = className + ' ' + className + '--hidden'
		this.visibility = 'hidden'
	}

}

export default SoundSelector