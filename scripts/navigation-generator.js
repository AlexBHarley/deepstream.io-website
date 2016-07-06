/************************************
 * Navigation Generator
 ***********************************/
var sort = function( nav ) {
	var ordered = [];
	var order = Object.keys( nav ).sort();
	for( var i=0; i<order.length;i++) {
		if( order[ i ] === 'undefined' ) continue;

		if( !nav[ order[ i ] ].title ) {
			ordered.push( {
				name: order[ i ],
				children: sort( nav[ order[ i ] ] )
			} );
		} else {
			ordered.push( nav[ order[ i ] ] );
		}
	}
	return ordered;
};

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
					path: `${file.level1}/${file.level2}/${file.level3}/${file.level3}.html`,
					indexPath: `${file.level1}/${file.level2}/${file.level3}/`
				};
			}
		}

		for( var level1 in metadata.nav ) {
			metadata.nav[ level1 ] = sort( metadata.nav[ level1 ] );
		}

		for( filePath in files ) {
			files[ filePath ].tree = metadata.nav[ files[ filePath ].level1 ];
			files[ filePath ].tree_level_2 = files[ filePath ].tree.find( function( file, element ) {
				return file.level2 === element.name;
			}.bind( null, files[ filePath ] ) );

		}

		return done();
	});
}
