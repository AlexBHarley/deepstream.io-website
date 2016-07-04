module.exports = function( level, className, data, key ) {
	if( level === 'level1' || level === 'level2' ) {
		if( data[ level ] === key ) {
			return className;
		}
	}

	if( level === 'level3' ) {
		var parts = key.split( '/' );

		if( parts[ 0 ] === data.level1 &&
			parts[ 1 ] === data.level2 &&
			parts[ 2 ] === data.level3
		){
			return className;
		}
	}

	return '';
};