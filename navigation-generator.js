/************************************
 * Navigation Generator
 ***********************************/
module.exports = function( metalsmith ) {
	metalsmith.use(function( files, metalsmith, done ) {
		var metadata = metalsmith.metadata();
		metadata.nav = {};
		var fileParts;
		var filePath;
		for( filePath in files ) {
			if( filePath.match( '.*\.md' ) ) {
				fileParts = filePath.split( '\\' );
				if( !metadata.nav[ fileParts[ 0 ] ] ) {
					metadata.nav[ fileParts[ 0 ] ] = {};
				}
				if( !metadata.nav[ fileParts[ 0 ] ][ fileParts[ 1 ] ] ) {
					metadata.nav[ fileParts[ 0 ] ][ fileParts[ 1 ] ] = [];
				}
				metadata.nav[ fileParts[ 0 ] ][ fileParts[ 1 ] ].push( {
					title: fileParts[ 2 ],
					path: filePath.replace( '.md', '.html' )
				} );
			}
		}
		return done();
	});
}
