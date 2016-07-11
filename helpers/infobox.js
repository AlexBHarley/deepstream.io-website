const hbs = require( 'handlebars' );

const types = {
	important: 'Important',
	hint: 'Hint',
	warning: 'Warning',
	info: 'Info'
}

module.exports = function( type, header, options ) {
	if( !types[ type ] ) {
		throw new Error( `Unknown infobox ${type}, currently only supporting ${Object.keys(types)}` );
	}

	if( typeof header !== 'string' ) {
		options = header;
		header = types[ type ];
	}

	return new hbs.SafeString(
		'<div class="docbox infobox"><h3>' +
		header +
		'</h3><ul><li>' +
		options.fn() +
		'</li></ul></div>\n\n' );
};
