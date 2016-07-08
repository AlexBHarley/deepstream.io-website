/************************************
 * Normalise Paths between os systems
 ***********************************/
module.exports = function() {
	return function( files, metalsmith, done ) {
		var metadata = metalsmith.metadata();

		var fileParts;
		var filePath;
		var file;
		for( filePath in files ) {
			// Create if missing
			file = files[ filePath ];
			delete files[ filePath ];

			filePath = filePath.replace( /\\/g, '/' );
			file.filename = filePath;
			files[ filePath ] = file;
		}

		done();
	}
}