const path = require( 'path');
const fs = require( 'fs');
var merge = require('lodash.merge');

/************************************
 * Navigation Generator
 ***********************************/
function parseFilePath( filePath ) {
	var levels = filePath.split( '\\' );
	return {
		level1: levels[ 0 ], //docs
		level2: levels[ 1 ], //client
		level3: levels[ 2 ], //datasync-list
		isLevel1: levels.length === 2,
		isLevel2: levels.length === 3,
		isLevel3: levels.length === 4
	}
}

function createMissingFiles( files, path, callback ) {
	if( files[ path ] || files[ path.replace( 'md', 'html' ) ] ) {
		return;
	}
	callback();
}

function createSection( files, data, path ) {
	createMissingFiles( files, path, function() {
		files[ path ] = {
			'filename': path,
			'contents': new Buffer( `{{> level-section data=nav.${data.level1} }}` ),
			'level1': data.level1,
			'isLevel1': true,
			'isLevel2': false,
			'isLevel3': false
		};
	} );
}

function createSubsection( files, data, path ) {
	createMissingFiles( files, path, function() {
		files[ path ] = {
			'filename': path,
			'contents': new Buffer( `{{> level-subsection data=nav.${data.level1}.${data.level2} }}` ),
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
					createSection( files, data, path.join( './', data.level1, 'index.html' ) );
					//throw new Error( 'Missing section file, would you want it to be generated?' )
				}

				if( data.isLevel3 ) {
					createSubsection( files, data, path.join( './', data.level1, data.level2, 'index.html' ) );
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

				filePath = filePath.replace( `${fileName}.md`, 'index.md' )
				filePath = filePath.replace( `${fileName}.html`, 'index.html' )
				filePath = filePath.replace( `install.html`, 'index.html' ) //TODO

				files[ filePath ]	 = {
					'filename': path,
					'contents': new Buffer( file.contents )
				};

				// Merge meta data for levels
				merge( files[ filePath ], data );
				merge( file, data );
			}
		}

		return done();
	});
}
