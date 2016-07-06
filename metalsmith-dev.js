var metalSmithCommon = require( './metalsmith-common' );
var MetalSmith = require( 'metalsmith' );
var metalsmith = new MetalSmith( __dirname );

metalsmith.source( './src' );
metalsmith.destination( './dist' );
metalsmith.clean( true );


/************************************
 * Browser Sync
 ***********************************/
var browserSync = require('metalsmith-browser-sync');
metalsmith.use(browserSync({
	server : "dist",
	files  : ["src/**/*.css"]
}));

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
