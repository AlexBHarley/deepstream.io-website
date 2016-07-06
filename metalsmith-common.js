module.exports = function( metalsmith ) {
	/************************************
	 * HANDLEBARS HELPER
	 ***********************************/
	var metalsmithRegisterHelper = require('metalsmith-register-helpers');
	metalsmith.use(metalsmithRegisterHelper());

	/************************************
	 * Normalise Paths
	 ***********************************/
	const pathNormalise = require( './scripts/path-normalise' );
	pathNormalise( metalsmith );

	/************************************
	 * Generate Specs
	 ***********************************/
	const specsGenerator = require( './scripts/specs-generator' );
	specsGenerator( metalsmith );

	/************************************
	 * Generate Blog
	 ***********************************/
	const blogGenerator = require( './scripts/blog-generator' );
	blogGenerator( metalsmith );

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
};