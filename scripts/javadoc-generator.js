var fs = require( 'fs' );
var path = require( 'path' );
var parse = require( 'csv-parse' );
var walk = require( 'walk' );
var cheerio = require( 'cheerio' );

function walkFeatureTree ( files, next ) {
	var inputDir =  path.join( __dirname, '../../deepstream.io-client-java/build/docs/javadoc/io/deepstream' );
	var walker = walk.walk( inputDir, {} );
	walker.on( 'file', processDocFile.bind( null, files ) );
	walker.on( 'end', next );
};

function processDocFile( files, fileDir, stats, next ) {
	if( stats.name.startsWith( 'package-' ) ) {
		next();
		return;
	}

	const content = fs.readFileSync( path.join( fileDir, stats.name ) ).toString( 'utf8' );
	content = content.replace(
		/^[\s\S]*<!-- ======== START OF CLASS DATA ======== -->]*/,
		''
	)
	.replace(
		/<!-- ======= START OF BOTTOM NAVBAR ====== -->([\s\S]*)$/,
		''
	)

	var $ = cheerio.load( content );
	$( '.header' ).remove();
	$( '.inheritance' ).remove();
	$( 'hr' ).remove();
	$( '.contentContainer .description pre' ).remove();
	$( '.contentContainer .description dl' ).remove();
	//$( '.contentContainer .summary .overviewSummary + .blockList' ).remove();
	//$( '.contentContainer > .summary' ).remove();
	$( 'pre' ).wrap('<pre class="language-java"></pre>').wrap( '<code class="language-java"></code>' );


	$( '.blockList > .blockList:only-child' ).each( ( index, blockList ) => {
		$( blockList ).parent().parent().append( $( blockList ).children() );
	} );
	$( '.blockList:only-child' ).remove();
//	$( '.blockList:only-child' ).remove();

	const fileName = stats.name.replace('.html','');
	const metalsmithFileName = `docs/client-java/${fileName}/${fileName}.html`;
	files[ metalsmithFileName  ] = {
		title: `${stats.name.replace('.html','')}`,
		description: `deepstream.io javadoc for ${fileName}`,
		filename: fileName,
		contents: new Buffer( $.html() )
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
