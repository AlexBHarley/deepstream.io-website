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
	// ignore link in the sidebar which trigger an ajax get
	// of HTML snippet which filename is not index.html
	var regex = /\shref="([^"]*)"(?! data-fetch="ajax")/g

	metalsmith.use(function( files, metalsmith, done ) {
		console.log('starting link-checker'.cyan)
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
				} else if (entry === 'mailto:info@deepstream.io') {
					// skip
				} else if (entry === 'mailto:info@deepstreamhub.com') {
					// skip
				}else {
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
		console.log('file not found'.red + ` '${link}' in ${filePath}`)
	}
}

function checkForInvalidExtension(link) {
	var extname = path.extname(link)
	if (extname !== ''
		&& extname !== '.html'
		&& extname !== '.css'
		&& extname !== '.js'
		&& extname !== '.ico') {
			console.log('direct link to non index.html'.red + ` for '${link}' in ${filePath}`)
			return true
	}
	return false
}

function checkLink(link, filePath, files) {
	link = link.split( '#' )[ 0 ];
	if (link.substr(0, 1) === '/') {
		link = link.substr(1)
	}
	if (link.match(/\/$/) ) {
		link = link + 'index.html'
	}
	link = link.replace(/(#.*)/, '')

	if (checkForInvalidExtension(link)) {
		return
	}

	if (link.indexOf('.') === 0) {
		const tempPath = filePath.replace( /\/[^\/]*\.html/, '/' );
		const absolutePath = path.join(tempPath, link).replace( /\\/g, '/' );
		if (files[absolutePath] == null) {
			printWarning(absolutePath, filePath, files)
		}
	} else {
		if (files[link] == null) {
			printWarning(link, filePath, files)
		}
	}
}
