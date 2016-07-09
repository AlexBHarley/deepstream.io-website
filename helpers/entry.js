var hbs = require('handlebars');

function entry( tree, path ) {

	var err = () => { console.log( 'Failed to find ' + path ); };

	var parts = path
		.split( '/' )
		.filter( part => { return part.trim().length > 0; });

	try{
		var entry = tree
		.filter( item => {return item.name === parts[ 0 ]; })[ 0 ]
		.children
		.filter( item => { return item.path.indexOf( parts[ 1 ] ) > -1; })[ 0 ];
	} catch( e ) {
		console.log( 'ERROR', e );
		err();
	}

	if( !entry ) {
		err();
	}

	var html = `<a class="entry" href="/${entry.indexPath}">
		<h4>${entry.title}</h4>
		<p>${entry.description}</p>
	</a>`;

	return new hbs.SafeString( html );
}

module.exports = entry;
