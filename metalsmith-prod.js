var metalSmithCommon = require( './scripts/metalsmith-common' );
var MetalSmith = require( 'metalsmith' );
var metalsmith = new MetalSmith( __dirname );

metalsmith.source( './src' );
metalsmith.destination( './dist' );
metalsmith.clean( true );

/************************************
 * Apply Common Metalsmith tasks
 ***********************************/
metalSmithCommon( metalsmith );

/************************************
 * RUN
 ***********************************/
metalsmith.build(function(err){
	if (err) {
		console.log(err);
	}
});
