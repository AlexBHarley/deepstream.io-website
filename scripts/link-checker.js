'use strict'
/************************************
 * Checking all href attributes in the rendered HTML
 ***********************************/
const path = require('path')
const colors = require('colors')

module.exports = function( metalsmith ) {
	var file;
	var results;
	var html;
	var regex = /href="([^"]*)"/g

	metalsmith.use(function( files, metalsmith, done ) {
		var metadata = metalsmith.metadata()

		for( filePath in files ) {
			// Create if missing
			file = files[ filePath ]
			html = file.contents.toString()

			var matches, results = [];
			while (matches = regex.exec(html)) {
			   results.push(matches[1]);
			}
			// console.log(results)
			for (var i = 0; i < results.length; i++) {
				var entry = results[i]
				if (entry.indexOf('http') === 0) {
					// skip
				} else if (entry.indexOf('//') === 0) {
					// skip
				} else if (entry.indexOf('#') === 0) {
					// skip
				} else if (filePath.indexOf('assets/') !== -1) {
					// skip
				} else if (entry === '/') {
					// skip
				} else {
					checkLink(entry, filePath, files)
				}
			}
		}

		return done();
	})
}

function printWarning(link, filePath, files) {
	if (files[link + '/index.html']) {
		// fallback check
		console.log('consider to use a trailing slash'.yellow + ` for '${link}' in ${filePath}`)
	} else {
		console.log('broken link'.red + ` '${link}' in ${filePath}`)
	}
}

function checkLink(link, filePath, files) {
	if (link.substr(0, 1) === '/') {
		link = link.substr(1)
	}
	if (link.match(/\/$/) ) {
		link = link + 'index.html'
	}
	link = link.replace(/(#.*)/, '')

	var extname = path.extname(link)

	// TODO: WIP solution is here https://regex101.com/r/kO1cO1/7
	// if (extname !== '.html' || extname !== '') {
	// 	console.log('direct link to non index.html'.red + ` for '${link}' in ${filePath}`)
	// 	return
	// }

	if (link.indexOf('.') === 0) {
		const absolutePath = path.join(filePath, link)
		if (files[absolutePath] == null) {
			printWarning(absolutePath, filePath, files)
		}
	} else {
		if (files[link] == null) {
			printWarning(link, filePath, files)
		}
	}
}
