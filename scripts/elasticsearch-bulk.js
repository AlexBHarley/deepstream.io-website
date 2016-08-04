/************************************
 * Normalise Paths between os systems
 ***********************************/

const fs = require('fs')
const path = require('path')

module.exports = function() {
	return function( files, metalsmith, done ) {
		var metadata = metalsmith.metadata()

		var filePath
		var file
		var counter = 0
		var result = []
		for( filePath in files ) {
			if (path.extname(filePath) !== '.md') {
				continue
			}
			file = files[ filePath ]
			result.push({
				filePath: filePath,
				title: file.title,
				description: file.description,
				content: file.contents.toString()
			})
		}
		result = result.map(function(item) {
			const type = item.filePath.split('/')[0]
			const id = item.filePath.replace(/\//g, '_')
			counter++
			return [
				{ index:  { _index: 'pages', _type: type, _id: id } },
				item
			]
		})
		// flatten
		result = [].concat.apply([], result)
		const jsonLines = result.map(item => JSON.stringify(item))
		fs.writeFileSync('elasticsearch-bulk', jsonLines.join('\n') + '\n', 'utf8')
		console.log(`created a elastic-search bulk file with ${counter} indices`)
		done()
	}
}
