var metalSmithCommon = require( './metalsmith-common' );
var MetalSmith = require( 'metalsmith' );
var metalsmith = new MetalSmith( __dirname );

metalsmith.source( './src' );
metalsmith.destination( './dist' );
metalsmith.clean( true );

/************************************
 * Remove Drafts
 ***********************************/
var drafts = require('metalsmith-drafts');
metalsmith.use( drafts() );

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
