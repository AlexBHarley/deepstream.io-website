var MetalSmith = require( 'metalsmith' );
var metalsmith = new MetalSmith( __dirname );

metalsmith.source( './src' );
metalsmith.destination( './dist' );
metalsmith.clean( true );

/************************************
 * WATCH
 ***********************************/
// var metalsmithWatch = require('metalsmith-watch');
// metalsmith.use(metalsmithWatch({
// 	'paths': {
// 		'${source}/**/*': true,
// 		'templates/**/*': true,
// 		'layouts': true,
// 		'partials': true
// 	},
// 	'livereload': false
// }));

/************************************
 * Browser Sync
 ***********************************/
var browserSync = require('metalsmith-browser-sync');
metalsmith.use(browserSync({
	server : "dist",
	files  : ["src/**/*.css"]
}));

/************************************
 * Generate Missing Pages
 ***********************************/
const pageGenerator = require( './scripts/page-generator' );
pageGenerator( metalsmith );

/************************************
 * Add Navigation
 ***********************************/
const navigationGenerator = require( './scripts/navigation-generator' );
navigationGenerator( metalsmith );

/************************************
 * CODE HIGHLIGHTING
 ***********************************/
/*var metalsmithHLJS = require('metalsmith-code-highlight');
metalsmith.use(metalsmithHLJS());
*/

/************************************
 * HANDLEBARS HELPER
 ***********************************/
var metalsmithRegisterHelper = require('metalsmith-register-helpers');
metalsmith.use(metalsmithRegisterHelper());

/************************************
 * IN PLACE
 ***********************************/
var metalsmithInPlace = require('metalsmith-in-place');
metalsmith.use(metalsmithInPlace({
	'engine': 'handlebars',
	'partials': 'partials',
	'pattern': [ '**/*.md', '**/*.html' ]
}));

/************************************
 * Markdown
 ***********************************/
var markdown = require('metalsmith-markdown');
metalsmith.use(markdown({
	smartypants: false,
	gfm: true,
	tables: true
}));

/************************************
 * LAYOUTS
 ***********************************/
var metalsmithLayouts = require('metalsmith-layouts');
metalsmith.use(metalsmithLayouts({
	'engine': 'handlebars',
	'default': 'main-layout.html',
	'directory': 'layouts',
	'pattern': [ '**/index.md', '**/index.html' ]
}));

/************************************
 * RUN
 ***********************************/
metalsmith.build(function(err){
	if (err) {
		console.log(err);
	}
});
