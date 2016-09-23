module.exports = function( args ) {
	check( 'title', args );
	check( 'description', args );
};

function check( type, args ) {
	if(  !args.data.root[ type ] || args.data.root[ type ].trim().length === 0 ) {
		if( args.data.root.relativePath ) {
			console.log( 'Missing ' + type + ' for ' + args.data.root.relativePath );
		}
	}
}