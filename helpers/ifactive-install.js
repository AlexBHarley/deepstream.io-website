module.exports = function( level, className, root, data, key ) {
	if( level === 'level2' ) {
		var parts = key.split( '/' );

		if( parts[ 0 ] === root.level1 &&
			parts[ 1 ] === root.level2
		){
			return className;
		}
	}

	return '';
};