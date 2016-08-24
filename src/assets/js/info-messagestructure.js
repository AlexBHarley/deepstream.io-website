( function( $ ) {

	var C = {
	    TYPES: {
	        'S': 'TYPES.STRING',
	        'O': 'TYPES.OBJECT',
	        'N': 'TYPES.NUMBER',
	        'L': 'TYPES.NULL',
	        'T': 'TYPES.TRUE',
	        'F': 'TYPES.FALSE',
	        'U': 'TYPES.UNDEFINED'
	    },
	    TOPIC: {
	        'A': 'TOPIC.AUTH',
	        'X': 'TOPIC.ERROR',
	        'E': 'TOPIC.EVENT',
	        'R': 'TOPIC.RECORD',
	        'P': 'TOPIC.RPC',
	        'W': 'TOPIC.WEBRTC',
	        'PRIVATE/': 'TOPIC.PRIVATE'
	    },
	    EVENT: {
	        'ACK_TIMEOUT': 'EVENT.ACK_TIMEOUT',
	        'RESPONSE_TIMEOUT': 'EVENT.RESPONSE_TIMEOUT',
	        'DELETE_TIMEOUT': 'EVENT.DELETE_TIMEOUT',
	        'UNSOLICITED_MESSAGE': 'EVENT.UNSOLICITED_MESSAGE',
	        'MESSAGE_PARSE_ERROR': 'EVENT.MESSAGE_PARSE_ERROR',
	        'VERSION_EXISTS': 'EVENT.VERSION_EXISTS',
	        'NOT_AUTHENTICATED': 'EVENT.NOT_AUTHENTICATED',
	        'LISTENER_EXISTS': 'EVENT.LISTENER_EXISTS',
	        'NOT_LISTENING': 'EVENT.NOT_LISTENING',
	        'TOO_MANY_AUTH_ATTEMPTS': 'EVENT.TOO_MANY_AUTH_ATTEMPTS',
	        'IS_CLOSED': 'EVENT.IS_CLOSED',
	        'UNKNOWN_CALLEE': 'EVENT.UNKNOWN_CALLEE'
	    },
	    ACTIONS: {
	        'A': 'ACTIONS.ACK',
	        'R': 'ACTIONS.READ',
	        'C': 'ACTIONS.CREATE',
	        'U': 'ACTIONS.UPDATE',
	        'P': 'ACTIONS.PATCH',
	        'D': 'ACTIONS.DELETE',
	        'S': 'ACTIONS.SUBSCRIBE',
	        'US': 'ACTIONS.UNSUBSCRIBE',
	        'I': 'ACTIONS.INVOKE',
	        'SP': 'ACTIONS.SUBSCRIPTION_FOR_PATTERN_FOUND',
	        'SR': 'ACTIONS.SUBSCRIPTION_FOR_PATTERN_REMOVED',
	        'L': 'ACTIONS.LISTEN',
	        'UL': 'ACTIONS.UNLISTEN',
	        'PU': 'ACTIONS.PROVIDER_UPDATE',
	        'Q': 'ACTIONS.QUERY',
	        'CR': 'ACTIONS.CREATEORREAD',
	        'EVT': 'ACTIONS.EVENT',
	        'E': 'ACTIONS.ERROR',
	        'REQ': 'ACTIONS.REQUEST',
	        'RES': 'ACTIONS.RESPONSE',
	        'REJ': 'ACTIONS.REJECTION'
	    }
	};

	function parseMessageSpec( message ) {
		var parts = message.substring( 0, message.length - 1 ).split( '|' );
		var data = parts.slice( 2 );
		for( var i=0; i<data.length;i++) {
			data[ i ] = C.ACTIONS[ data[ i ] ] || C.EVENT[ data[ i ] ] || data[ i ];
			data[ i ] = data[ i ].replace( /\</g, '&lt;' ).replace( /\>/g, '&gt;' )
		}

		return {
			raw: message,
			topic: C.TOPIC[ parts[ 0 ] ],
			action: C.ACTIONS[ parts[ 1 ] ],
			data: data
		}
	}

	$( document ).ready(function() {

		$( '.content' ).on( 'mouseenter', '.message-format', function( e ) {
			var destination = $( e.target ).offset();
			var message = parseMessageSpec( $( e.target).text() );

			$( '.message-in-depth .event' ).text( message.topic );
			$( '.message-in-depth .action' ).text( message.action );

			var ml = message.data.length > 1 ? '<br/>' : '';
			$( '.message-in-depth .data' ).html( '[ ' + ml + message.data.join( ',<br/>' ) + ml + ' ]' );

			var height = $( '.message-in-depth' ).height() + 10;
			$( '.message-in-depth' )
				.css({top: destination.top - height, left: destination.left })
				.show();
		} );

		$( '.content' ).on( 'mouseleave', '.message-format', function( e ) {
			$( '.message-in-depth' )
				.hide();
		} );
	});

} )( jQuery );