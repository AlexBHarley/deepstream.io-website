var http = require( 'http' );
var deepstreamClient = require( 'deepstream.io-client-js' );
var ds = deepstreamClient( 'localhost:6021' ).login( {}, init );
var querystring = require( 'querystring' );
var needle = require( 'needle' );
var todos;
var slackWebHook = 'https://hooks.slack.com/services/<your webhook key>';

function onListen() {
	console.log( 'Listening' );
}

// Add incoming Slack messages as deepstream records
function forwardMsg( data ) {
	if( !data || !data.text ) {
		return;
	}
	var id = 'todo/' + ds.getUid();
	var title = data.text.replace( 'ToDo', '' ).trim();
	var user = data.user_name;

	ds.record.getRecord( id ).set({
		title: title + ' (by ' + user + ')',
		completed: false
	});

	todos.addEntry( id );
}

function init() {
	todos = ds.record.getList( 'todos' );
	// forward deepstream message to slack
	ds.event.subscribe( '$slack:outbound-xa32asfd', function( text ){
		console.log( 'Forwarding', text );
		needle.post(slackWebHook, {text: text}, {json: true}, function(){});
	});

	createHttpServer();
}

function createHttpServer() {
	var server = new http.Server();

	server.on( 'request', function( request, response ){
		var msgBody = '';

		request.setEncoding( 'utf8' );
		//get post data
		request.on( 'data', function( data ){
			msgBody += data;
		});

		request.on( 'end', function(){
			console.log( 'received request for ' + request.url );
			console.log( 'with data', msgBody );
			forwardMsg( querystring.parse( msgBody) );
		});

		response.end( 'OK' );
	});

	server.listen( 6030, '0.0.0.0', onListen );
}