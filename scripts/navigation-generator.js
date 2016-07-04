/************************************
 * Navigation Generator
 ***********************************/
module.exports = function( metalsmith ) {
	metalsmith.use(function( files, metalsmith, done ) {
		var metadata = metalsmith.metadata();
		metadata.nav = {};

		var fileParts;
		var filePath;
		var file;
		for( filePath in files ) {

			file = files[ filePath ];

			if( !metadata.nav[ file.level1 ] ) {
				metadata.nav[ file.level1 ] = {};
			}

			if( file.isLevel2 || file.isLevel3 ) {
				if( !metadata.nav[ file.level1 ][ file.level2 ] ) {
					metadata.nav[ file.level1 ][ file.level2 ] = {};
				}
			}

			if( file.isLevel3 ) {
				metadata.nav[ file.level1 ][ file.level2 ][ file.level3 ] = {
					title: file.level3,
					path: filePath.replace( 'index.md', '' ).replace( 'index.html', '' ).replace( /\\/g, '/' )
				};
			}

			file.tree = metadata.nav[ file.level1 ];
		}
		return done();
	});
}
