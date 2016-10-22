const Helpers = (function() {

	return {

		randId: function(append) {
			let id = Math.random().toString(36).substring(7)

			if (append == null) return id;

			return append + id
		},

		setStyle: function(el, properties) {
			let keys = Object.keys(properties)
			keys.map( (key) => { el.style[key] = properties[key] })
		},

		toPixels: function(number) { return number.toString() + 'px' },

		randInt: function(min, max) { return Math.round(Math.random() * (max - min) + min) },

		toRGB: function(r,g,b) { 
			return 'rgb(' + r.toString() + ',' + g.toString() + ',' + b.toString() + ')' 
		},

		getElementCenterInViewport: function(width,height) {
			let w = window.innerWidth,
				h = window.innerHeight
			return { top: (h-height)/2, left: (w-width)/2 }
		},

		getMatrixRepresentation: function(rows,cols) {
			let matrix = []
			for (let i=0;i<rows;i++) {
				for (let k=0;k<cols;k++) {
					matrix.push({row: i, col: k})
				}
			}
			return matrix
		},

		min: function(arr) {
			if (arr.length === 0) return;
			if (arr.length === 1) return arr[0];

			let min = arr[0]

			for (let i=1;i<arr.length;i++) {
				min = Math.min(min,arr[i])
			}
			return min
		},

		max: function(arr) {
			if (arr.length === 0) return;
			if (arr.length === 1) return arr[0];

			let max = arr[0]

			for (let i=1;i<arr.length;i++) {
				max = Math.max(max,arr[i])
			}
			return max
		},

		uniques: function(arr) { return arr.filter( (val,i,self) => self.indexOf(val) === i ) },

		//	generic template generator to create a row of cells

		createRow: function(nChildren, classNames, innerText, ids) {
			let row = document.createElement('div')
			row.className = 'row'

			if (innerText != null) {
				if (innerText.length !== nChildren) {
					throw new Error('Each child cell must have its own innerHTML innerText')
				}
			}

			for (let i=0; i<nChildren; i++) {
				let cell = document.createElement('div')

				for (let k=0; k<classNames.length; k++) {
					cell.classList.add(classNames[k])
				}

				//	add a randomized background color to the cell

				cell.style.backgroundColor = Helpers.toRGB(20,200, Helpers.randInt(0,255))

				//	set inner text if applicable

				if (innerText != null) cell.innerHTML = innerText[i];
				if (ids != null) cell.id = ids[i]

				row.appendChild(cell)
			}

			return row
		},

		//	add ids to a given row

		addIds: function(row, rowN) {
			let nodes = row.childNodes
			for (let i=0; i<nodes.length; i++) {
				nodes[i].id = rowN.toString() + ',' + i.toString()
			}
		},

		createDiv: function(options) {

			let element = document.createElement('div')

			if (options == null) return element;

			for (let prop in options) {
				element[prop] = options[prop]
			}
			
			return element
		},

		dragMoveListener: function(e) {
			let target = e.target,
	        	x = (parseFloat(target.getAttribute('data-x')) || 0) + e.dx,
	        	y = (parseFloat(target.getAttribute('data-y')) || 0) + e.dy

	        target.style.webkitTransform =
	    	target.style.transform =
	      		'translate(' + x + 'px, ' + y + 'px)'

			target.setAttribute('data-x', x)
	    	target.setAttribute('data-y', y)
		}
	}

})();

export default Helpers