const colors = require('colors')
const beep = require('beepbeep')
const child_process = require('child_process')

module.exports = function( metalsmith ) {

	/************************************
	 * Remove Drafts
	 ***********************************/
	 if (!process.env.KEEP_DRAFT && !process.env.KEEP_DRAFTS) {
		var drafts =  require('metalsmith-drafts');
		metalsmith.use( drafts() );
	 } else {
	 	console.log('disable metalsmith-drafts plugin')
	 }

	/************************************
	 * HANDLEBARS HELPER
	 ***********************************/
	var metalsmithRegisterHelper = require('metalsmith-register-helpers');
	metalsmith.use(metalsmithRegisterHelper());

	/************************************
	 * Normalise Paths
	 ***********************************/
	const pathNormalise = require( './path-normalise' );
	pathNormalise( metalsmith );

	/************************************
	 * Generate Specs
	 ***********************************/
	const specsGenerator = require( './specs-generator' );
	specsGenerator( metalsmith );

	/************************************
	 * Generate Blog
	 ***********************************/
	const blogGenerator = require( './blog-generator' );
	blogGenerator( metalsmith );

	/************************************
	 * Generate Missing Pages
	 ***********************************/
	const pageGenerator = require( './page-generator' );
	pageGenerator( metalsmith );

	/************************************
	 * Add Navigation
	 ***********************************/
	const navigationGenerator = require( './navigation-generator' );
	navigationGenerator( metalsmith );

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
	 * Link Validation
	 ***********************************/
	var linkChecker = require('./link-checker');
	linkChecker(metalsmith);

	metalsmith.use(function(done) {
		console.log(colors.green('built done') + ' at ' + new Date())
		if (process.argv[2] === 'trigger-bs-reload') {
			child_process.exec('npm run reload', function(err, stdout, stderr) {
				if (err) {
					console.error(err)
				}
				if (stderr) {
					console.error(stderr)
				}
			})
		}
		if (process.env.BEEP) {
			beep()
		}
	})
};
