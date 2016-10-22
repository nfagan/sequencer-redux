function AudioManager(filenames) {
	this.context = new (window.AudioContext || window.webkitAudioContext)()
	this.params = this.getDefaultAudioParams()
	this.buffers = []
	this.filenames = filenames
}

AudioManager.prototype = {

	//	define default audio parameters

	getDefaultAudioParams: function() {
		return {
			gain: {
				enabled: true,
				value: .5,
				min: .5,
				max: 2,
			},
			filter: {
				enabled: true, 
				value: 1,
				maxFrequency: 3000,
				minFrequency: 500
			},
			reverse: {
				enabled: false
			},
			attack: {
				enabled: true,
				value: 0
			},
			envelope: {
				enabled: false, 
				attack: 0,
				release: 1
			},
			region: {
				enabled: true,
				value: 0
			},
			pitch: {
				enabled: true,
				value: .5,
				min: -8,
				max: 8,
			}
		}
	},

	//	from the array of buffer objects in this.buffers,
	//	return the buffer that matches <filename>

	getBufferByFilename: function(filename) {
		let buffers = this.buffers

		let oneBuffer = buffers.filter(function(buffer) {
			return buffer.filename === filename
		})

		if (oneBuffer.length === 0) return -1;

		if (oneBuffer.length > 1) {
			throw new Error('More than one buffer found for' + filename)
		}

		return oneBuffer[0].buffer
	},

	//	return a promise to load a sound, given a filename

	loadSound: function(filename) {
		let ctx = this

		return new Promise(function(resolve, reject) {
			let request = new XMLHttpRequest(),
				fullfile = '/sounds/' + filename

			request.open('GET', fullfile)
			request.responseType = 'arraybuffer'

			request.onload = function() {
				ctx.context.decodeAudioData(request.response, function(buffer) {
					resolve(buffer)
				})
			}

			request.onerror = function(err) {
				reject(err)
			}

			request.send()
		})
	},

	//	given an array of filenames, resolve each promise, and
	//	push an array of buffers to the object

	loadSounds: function(filenames) {

		let promises = [],
			buffers = this.buffers

		for (let i=0; i<filenames.length; i++) {
			promises.push(this.loadSound(filenames[i]))
		}

		let promise = Promise.all(promises)
			.then(function(sounds) {
				for (let i=0; i<sounds.length; i++) {
					buffers.push({
						filename: filenames[i],
						buffer: sounds[i]
					})
				}
			})
			.catch(function(err) {
				console.log('An error ocurred')
			})

		return promise
	},

	//	given a soundbite with filename and audioParam properties,
	//	get the buffer associated with <filename>, and play the sound
	//	with the params associated with <audioParams>

	processAndPlay: function(soundBite) {

		let filename = soundBite.filename,
			audioParams = soundBite.audioParams,
			buffer = this.getBufferByFilename(filename)

		if (buffer === -1) throw new Error('Could not find buffer');

		let context = this.context,
			gain = context.createGain(),
			filter = context.createBiquadFilter(),
			source = context.createBufferSource(),
			params = this.params,
			duration = buffer.duration

		//	overwrite the default parameters as necessary

		if (audioParams != null) {
			let keys = Object.keys(audioParams),
				newObj = {}

			for (let i=0; i<keys.length; i++) {
				newObj[keys[i]] = Object.assign({}, params[keys[i]], audioParams[keys[i]])
			}

			params = Object.assign({}, params, newObj)
		}

		//	handle reverse playback

		if (params.reverse.enabled) {
			Array.prototype.reverse.call(buffer.getChannelData(0))
			Array.prototype.reverse.call(buffer.getChannelData(1))
		}

		//	handle gain

		let gainAdjustment = 1

		if (params.gain.enabled) {
			gainAdjustment = 
				this.transformToFullValue(params.gain.min, params.gain.max, params.gain.value)
		}

		gain.gain.value = gainAdjustment

		//	handle attack / release

		if (params.attack.enabled) {
			let now = context.currentTime,
				attack = now + params.attack.value*duration

			gain.gain.cancelScheduledValues(0)
			gain.gain.setValueAtTime(0, now)
			gain.gain.linearRampToValueAtTime(gainAdjustment, attack)
		}

		if (params.envelope.enabled) {
			let now = context.currentTime,
				attack = now + params.envelope.attack*duration,
				release = attack + params.envelope.release*duration

			gain.gain.cancelScheduledValues(0)
			gain.gain.setValueAtTime(0, now)
			gain.gain.linearRampToValueAtTime(gainAdjustment, attack)
			gain.gain.linearRampToValueAtTime(0, release)
		}

		//	handle filtering

		filter.type = 'lowpass'
		filter.frequency.value = 20000

		if (params.filter.enabled) {
			if (params.filter.value == null) {
				throw new Error('If a filter is enabled, you must specify a frequency')
			}

			let maxFreq = params.filter.maxFrequency,
				minFreq = params.filter.minFrequency,
				freq = params.filter.value

			if (freq > 1) freq = 1;
			if (freq < 0) freq = 0;

			let absoluteFrequency = this.transformToFullValue(minFreq, maxFreq, freq)

			filter.frequency.value = absoluteFrequency
		}

		//	handle clip start offset

		let startOffset = 0

		if (params.region.enabled) {
			startOffset = params.region.value * duration
		}

		//	handle pitch shifting

		let semitone = 0

		if (params.pitch.enabled) {
			semitone = this.transformToFullValue(params.pitch.min, params.pitch.max, params.pitch.value)
		}

		source.playbackRate.value = Math.pow(2, semitone/12)

		//	finally, play

		source.buffer = buffer
		source.connect(filter)
		filter.connect(gain)
		gain.connect(context.destination)

		source.start(0, startOffset)
	},

	transformToFullValue: function(min, max, percentage) {
		return Math.round(((max - min) * percentage) + min)
	}

}

export default AudioManager

// //	testing it all out

// let filenames = [
// 	'celeste_piano_c.mp3',
// 	'celeste_piano_g_e.mp3',
// 	'celeste_piano_c_e.mp3'
// ]

// const manager = new AudioManager(filenames)

// const test__params = [
// 	{
// 		filter: { enabled: true, frequency: .2 },
// 		gain: { enabled: false, value: 1 },
// 		envelope: { enabled: true, attack: .2, release: 1 } 
// 	},
// 	{
// 		filter: { enabled: true, frequency: 1 },
// 		gain: { enabled: false, value: .5 },
// 		pitch: { enabled: true, semitone: 0 }
// 	},
// 	{ 
// 		filter: { enabled: true, frequency: 1 },
// 		gain: { enabled: false, value: 1 },
// 		reverse: { enabled: true },
// 		region: { enabled: true, start: .8 },
// 		pitch: { enabled: true, semitone: -12 },
// 		envelope: { enabled: true, attack: 0 }
// 	}
// ]

// manager.loadSounds(manager.filenames)
// 	.then(function() {
// 		for (let i=0; i<test__params.length; i++) {
// 			manager.processAndPlay({ filename: filenames[i], audioParams: test__params[i] })
// 		}
// 	})
