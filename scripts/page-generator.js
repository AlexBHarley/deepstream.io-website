const fs = require( 'fs');
const merge = require('lodash.merge');
const colors = require('colors');
const cli = global.cli || {};

/************************************
 * Navigation Generator
 ***********************************/
function parseFilePath( filePath ) {
	var levels = filePath.split( '/' );
	return {
		level1: levels[ 0 ], //docs
		level2: levels[ 1 ], //client
		level3: levels[ 2 ], //datasync-list
		isLevel1: levels.length === 2,
		isLevel2: levels.length === 3,
		isLevel3: levels.length === 4
	}
}

function createMissingFiles( files, filePath, callback ) {
	if( files[ filePath ] || files[ filePath.replace( 'md', 'html' ) ] ) {
		return;
	}
	callback();
}

function createSection( files, data, filePath ) {
	createMissingFiles( files, filePath, function() {
		files[ filePath ] = {
			'filename': filePath,
			'contents': new Buffer( `{{> level-section }}` ),
			'level1': data.level1,
			'isLevel1': true,
			'isLevel2': false,
			'isLevel3': false
		};
	} );
}

function createSubsection( files, data, filePath ) {
	createMissingFiles( files, filePath, function() {
		files[ filePath ] = {
			'filename': filePath,
			'contents': new Buffer( `{{> level-subsection }}` ),
			'level1': data.level1,
			'level2': data.level2,
			'isLevel1': false,
			'isLevel2': true,
			'isLevel3': false
		};
	} );
}

module.exports = function( metalsmith ) {
	var data;
	metalsmith.use(function( files, metalsmith, done ) {
		var metadata = metalsmith.metadata();
		metadata.nav = {};


		for( filePath in files ) {

			data = parseFilePath( filePath );

			// Create if missing
			if( filePath.match( '.*\.md' ) ) {

				if( data.isLevel2 || data.isLevel3 ) {
					createSection( files, data, [ data.level1, 'index.html' ].join( '/' ) );
					//throw new Error( 'Missing section file, would you want it to be generated?' )
				}

				if( data.isLevel3 ) {
					createSubsection( files, data, [ data.level1, data.level2, 'index.html' ].join( '/' ) );
				}
			}

			// Rename to index
			if( filePath.match( '.*\.md' ) || filePath.match( '.*\.html' ) ) {
				var match;
				var fileName = data.isLevel3 ? data.level3 : data.level2 ? data.level2 : data.level1;
				var file = files[ filePath ];

				// String table prefixes 'tuts'
				file.contents = new Buffer(
					file.contents
							.toString()
							.replace( /{{\/table}}\s*```/g, '{{/table}}\n')
							.replace(/```\s*{{/g, '{{')
				);

				if(cli.production || cli.missingMeta) {
					ensureMandatoryProperties( files[ filePath ] )
				}

				if( file.filename.match( 'readme.md' ) ) {
					delete files[ filePath ];
					filePath = file.filename.replace( 'readme.md', `${fileName}.md` );
					file.filename = file.filename.replace( 'readme.md', `${fileName}.md` );
					files[ filePath ] = file;
				}

				if( !file.filename.match( 'index.md|index.html' ) ) {
					filePath = filePath.replace( `readme.md`, `${fileName}.md` )
					filePath = filePath.replace( `${fileName}.md`, 'index.md' )
					filePath = filePath.replace( `${fileName}.html`, 'index.html' )
					filePath = filePath.replace( `install.html`, 'index.html' ) //TODO

					files[ filePath ] = {};
					merge( files[ filePath ], file, data );
					files[ filePath ].filename = filePath
					files[ filePath ].contents = new Buffer( file.contents )
				}

				// Merge meta data for levels
				merge( file, data );
			}
		}
		return done();
	});
}

function ensureMandatoryProperties(file) {
	var message = `file ${file.filename}`
	if (file.title == null) {
		message += `\n  has ${colors.yellow('no title')} property`
	}
	if (file.description == null) {
		message += `\n  has ${colors.yellow('no description')} description`
	}
	if (message.length !== `file ${file.filename}`.length) {
		console.log(message)
	}
}
