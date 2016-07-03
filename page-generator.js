const path = require( 'path');
const fs = require( 'fs');

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

function createSection( files, path ) {
	createMissingFiles( files, path, function() {
		files[ path ] = {
			'filename': path,
			'contents': new Buffer( "{{> level-section}}" )
		};
	} );
}

function createSubsection( files, path ) {
	createMissingFiles( files, path, function() {
		files[ path ] = {
			'filename': path,
			'contents': new Buffer( "{{> level-subsection}}" )
		};
	} );
}

module.exports = function( metalsmith ) {
	var data;
	metalsmith.use(function( files, metalsmith, done ) {
		for( filePath in files ) {

			data = parseFilePath( filePath );

			if( filePath.match( '.*\.md' ) ) {

				if( data.isLevel2 || data.isLevel3 ) {
					createSection( files, path.join( './', data.level1, 'index.html' ) );
					//throw new Error( 'Missing section file, would you want it to be generated?' )
				}

				if( data.isLevel3 ) {
					createSubsection( files, path.join( './', data.level1, data.level2, 'index.html' ) );
				}
			}

			// Rename to index
			if( filePath.match( '.*\.md' ) || filePath.match( '.*\.html' ) ) {
				var match;
				var fileName = data.isLevel3 ? data.level3 : data.level2 ? data.level2 : data.level1;
				var content = files[ filePath ];
					delete files[ filePath ];
					filePath = filePath.replace( `${fileName}.md`, 'index.md' )
					filePath = filePath.replace( `${fileName}.html`, 'index.html' )
					filePath = filePath.replace( `install.html`, 'index.html' ) //TODO
					content.filePath = filePath;
					files[ filePath ] = content;
			}
		}
		return done();
	});
}
