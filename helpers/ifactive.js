module.exports = function( level, className, root, data, key ) {

	if( key === undefined ) {
		return '';
	}

	if( level === 'level1' || level === 'level2' ) {
		if( root[ level ] === data[ key ].name ) {
			return className;
		}
	}

	if( level === 'level3' ) {
		var parts = key.split( '/' );	
		if( parts[ 0 ] === root.level1 &&
			parts[ 1 ] === root.level2 &&
			parts[ 2 ] === root.level3
		){
			return className;
		}
	}

	return '';
};