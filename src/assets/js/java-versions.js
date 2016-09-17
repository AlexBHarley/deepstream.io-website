
$.getJSON( 'https://crossorigin.me/https://api.bintray.com/packages/deepstreamio/maven/deepstream.io-client-java', function( data ){
	$('.version').text( data.latest_version );
});