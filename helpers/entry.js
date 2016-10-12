var hbs = require('handlebars');

function entry( tree, icon, path, title ) {


	var err = () => { console.log( 'Failed to find ' + path ); };

	var parts = path
		.split( '/' )
		.filter( part => { return part.trim().length > 0; });

	try{
		var entry = tree
		.filter( item => {return item.name === parts[ 0 ]; })[ 0 ];

		if( !entry ) {
			console.log( 'No children for ' + path );
			return;
		}
		entry = entry.children
		.filter( item => { return item.path.indexOf( parts[ 1 ] ) > -1; })[ 0 ];
	} catch( e ) {
		console.log( 'ERROR', e );
		err();
	}

	if( !entry ) {
		err();
	}

	var iconHtml;

	if( icon === false ) {
		iconHtml = '';
	} else if( icon.indexOf( 'ion' ) === -1 ) {
		iconHtml = `<img src="${icon}" class="entry-icon" />`;
	} else {
		iconHtml = `<div class="${icon} entry-icon"></div>`;
	}

	var finalTitle = typeof title === 'string' ? title : entry.title;


	var html = `<a class="entry" href="/${entry.indexPath}" title="${entry.description}">
		${iconHtml}
		<h4>${finalTitle}</h4>
	</a>`;

	return new hbs.SafeString( html );
}

module.exports = entry;
