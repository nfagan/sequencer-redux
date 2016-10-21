module.exports = {
	entry: "./src/script/main.js",
	output: {
		path: __dirname,
		filename: "./dist/script/bundle.js"
	},
	module: {
		loaders: [
			{ 
				test: /\.js$/, 
				exclude: /(node_modules|bower_components)/,
				loader: 'babel',
				query: {
					presets: ['es2015']
				} 
			}
		]
	}
}