( function( $ ) {

	$( document ).ready(function() {
		var menuOpen = false;

		$( '.menu-button' ).click( function() {
			menuOpen = !menuOpen;
			$( 'body' ).toggleClass( 'menu-open', menuOpen );
		} );

		$( '.mobile-menu li' ).click( function() {
			menuOpen = false;
			$( 'body' ).toggleClass( 'menu-open', false );
		} );
	});

} )( jQuery );