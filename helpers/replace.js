const replacements = {
	'client-js': 'JavaScript Client',
	'client-java': 'Java/Android Client',
	'common': 'Shared',
	'server': 'Server configuration'
}

module.exports = function( name ) {
	return replacements[ name ] || name;
}