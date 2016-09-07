var fs = require( 'fs' );
var path = require( 'path' );
var parse = require( 'csv-parse' );
var walk = require( 'walk' );
var cheerio = require( 'cheerio' );

const javaDocPath = process.env.JAVA_DOC_PATH || '../dependencies/deepstream.io-client-java/build/docs/javadoc/io/deepstream';
function walkFeatureTree ( files, next ) {
	var inputDir =  path.join( __dirname, javaDocPath );
	var walker = walk.walk( inputDir, {} );
	walker.on( 'file', processDocFile.bind( null, files ) );
	walker.on( 'end', next );
};

function processDocFile( files, fileDir, stats, next ) {
	if( stats.name.startsWith( 'package-' ) ) {
		next();
		return;
	}

	var oldContent = fs.readFileSync( path.join( fileDir, stats.name ) ).toString( 'utf8' );
	var content = oldContent.replace(
		/^[\s\S]*<!-- ======== START OF CLASS DATA ======== -->/,
		'')
		.replace(
		/<!-- ======= START OF BOTTOM NAVBAR ====== -->([\s\S]*)$/,
		'' )
	.replace( /<h3/g, '<h2' ).replace( /<\/h3>/g, '</h2>' )
	.replace( /<h4/g, '<h3' ).replace( /<\/h4>/g, '</h3>' )
	.replace( /..\/..\/io\/deepstream\/([^\.]+)\.html/g, '../$1'  )

	var $ = cheerio.load( content );

	var type;
	var typeText = $('h2.title').text();
	if( content.indexOf( 'java.lang.Exception' ) > -1 ) {
		type = 'exception';
	}
	else if( typeText.indexOf( 'Enum ' ) > -1 ) {
		type = 'enum';
	} else if( typeText.indexOf( 'Class ' ) > -1 ) {
		type = 'class';
	}  else if( typeText.indexOf( 'Interface ' ) > -1 ) {
		type = 'interface';
	}

	if( type === 'enum' ) {
		$( 'a[name="method_detail"]' ).parent().remove();
	}

	$( 'a[name="enum_constant_detail"]' ).parent().remove();
	$( 'a[name="method_summary"]' ).parent().remove();
	$( 'a[name="constructor_summary"]' ).parent().remove();
	$( 'a[name="field_detail"]' ).parent().remove();

	$( '.description dl ').remove();
	$( '.description pre' ).remove();
	$( '.header' ).remove();
	$( '.inheritance' ).remove();
	$( 'hr' ).remove();

	$( 'pre' ).wrap('<pre class="language-java"></pre>').wrap( '<code class="language-java"></code>' );

	$( '.blockListLast > .blockList:only-child' ).each( function() {
		$( this ).parent().append( $( this ).children() );
	} );

	$( '.blockList > .blockList:only-child' ).each( function() {
		$( this ).parent().append( $( this ).children() );
	} );

	$( '.blockList' ).each( function() {
		$( this ).children().length === 0 && $( this ).remove();
	} );

	$( '.blockListLast' ).each( function() {
		$( this ).children().length === 0 && $( this ).remove();
	} );

	$( '.block').each( function() {
		$( this ).replaceWith( '<p>' + $(this).html() + '</p>' );
	} );

	$( 'ul').each( function() {
		$( this ).replaceWith( '<div>' + $(this).html() + '</div>' );
	} );

	var fileName = stats.name.replace('.html','');
	var metalsmithFileName = `docs/client-java/${fileName}/${fileName}.html`;
	files[ metalsmithFileName  ] = {
		title: `${stats.name.replace('.html','')}`,
		description: `deepstream.io javadoc for ${fileName}`,
		filename: fileName,
		contents: new Buffer($.html()),
		category: type
	}

	next( null );
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = function() {
	return function( files, metalsmith, done ) {
		walkFeatureTree( files, done );
	};
}
