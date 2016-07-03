var MetalSmith = require( 'metalsmith' );
var metalsmith = new MetalSmith( __dirname );

metalsmith.source( './src' );
metalsmith.destination( './dist' );
metalsmith.clean( true );

/************************************
 * WATCH
 ***********************************/
var metalsmithWatch = require('metalsmith-watch');
metalsmith.use(metalsmithWatch({
	'paths': {
		'${source}/**/*': true,
		'templates/**/*': true,
		'layouts': true,
		'partials': true
	},
	'livereload': false
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
 * LESS
 ***********************************/
var metalsmithLess = require('metalsmith-less');
metalsmith.use(metalsmithLess({
	'pattern': '**/*.less'
}));

/************************************
 * CODE HIGHLIGHTING
 ***********************************/
/*var metalsmithHLJS = require('metalsmith-code-highlight');
metalsmith.use(metalsmithHLJS());
*/

/************************************
 * Markdown
 ***********************************/
var markdown = require('metalsmith-markdown');
metalsmith.use(markdown({
  smartypants: true,
  gfm: true,
  tables: true
}));

/************************************
 * HANDLEBARS HELPER
 ***********************************/
var metalsmithRegisterHelper = require('metalsmith-register-helpers');
metalsmith.use(metalsmithRegisterHelper());

/************************************
 * PATTERN
 ***********************************/
var globPattern = [ '**/*.md', '**/*.html' ];

/************************************
 * IN PLACE
 ***********************************/
var metalsmithInPlace = require('metalsmith-in-place');
metalsmith.use(metalsmithInPlace({
	'engine': 'handlebars',
	'partials': 'partials',
	'pattern': globPattern
}));

/************************************
 * LAYOUTS
 ***********************************/
var metalsmithLayouts = require('metalsmith-layouts');
metalsmith.use(metalsmithLayouts({
	'engine': 'handlebars',
	'default': 'main-layout.html',
	'directory': 'layouts',
	'pattern': globPattern
}));

/************************************
 * Add data
 ***********************************/
metalsmith.metadata().data = require( './data.json' );

/************************************
 * RUN
 ***********************************/
metalsmith.build(function(err){
	if (err) {
		console.log(err);
	}
});