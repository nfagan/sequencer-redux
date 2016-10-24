function Sequencer(soundBites, audioManager, grid) {

	this.dimensions = {
		columns: grid.dimensions.cols,
		rows: grid.dimensions.rows
	}
	this.grid = grid
	this.audioManager = audioManager
	this.soundBites = soundBites
	this.direction = 'columns'
	this.speed = 300
	this.minSpeed = 100
	this.maxSpeed = 800
	this.speedStep = 50
	this.loopId = null
	this.iteration = 0
	this.isPlaying = false

}

Sequencer.prototype = {
	constructor: Sequencer,

	loop: function() {
		let soundBites = this.soundBites,
			direction = this.direction,
			audioManager = this.audioManager,
			ctx = this,
			dimension = this.dimensions[direction]

		this.grid.setControlText('play', 'pause')

		this.isPlaying = true

		this.loopId = setInterval(function() {
			let iteration = ctx.iteration,
				dockedBites = soundBites.getInUseBitesInRowOrColumn(direction, iteration)

			iteration++

			if (iteration > dimension-1) iteration = 0;

			ctx.iteration = iteration

			if (dockedBites.length === 0) return;

			for (let i=0; i<dockedBites.length; i++) {
				dockedBites[i].animatePlaying()
				audioManager.processAndPlay(dockedBites[i])
			}

		},this.speed)
	},

	pause: function() {
		clearInterval(this.loopId)
		this.isPlaying = false
		this.grid.setControlText('play', 'play')
	},

	togglePlaying: function() {
		this.isPlaying ? this.pause() : this.loop()
	},

	toggleDirection: function() {
		this.direction = this.direction === 'columns' ? 'rows' : 'columns'
		this.grid.toggleControlOrientation('direction')
		this.pause()
		this.loop()
	}

}

export default Sequencer