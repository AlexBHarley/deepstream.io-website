const colors = require('colors')
const beep = require('beepbeep')
const child_process = require('child_process')

const cli = global.cli || {};

var MetalSmith = require( 'metalsmith' );
var metalsmith = new MetalSmith( __dirname );

metalsmith.source( '../src' );
metalsmith.destination( '../dist' );
metalsmith.clean( true );

/************************************
* Remove Drafts
***********************************/
if (!cli.drafts || cli.production) {
	var drafts =  require('metalsmith-drafts');
	metalsmith.use( drafts() );
}

/************************************
* HANDLEBARS HELPER
***********************************/
var metalsmithRegisterHelper = require('metalsmith-register-helpers');
metalsmith.use(metalsmithRegisterHelper( {
	"directory": "../helpers"
}));

/************************************
* Normalise Paths
***********************************/
const pathNormalise = require( './path-normalise' );
metalsmith.use( pathNormalise() );

/************************************
* Generate Specs
***********************************/
const specsGenerator = require( './specs-generator' );
metalsmith.use( specsGenerator() );

/************************************
* Generate Blog
***********************************/
const blogGenerator = require( './blog-generator' );
metalsmith.use( blogGenerator() );

/************************************
* Generate Missing Pages
***********************************/
const pageGenerator = require( './page-generator' );
metalsmith.use( pageGenerator() );

/************************************
* Add Navigation
***********************************/
const navigationGenerator = require( './navigation-generator' );
metalsmith.use( navigationGenerator() );

/************************************
* IN PLACE
***********************************/
var metalsmithInPlace = require('metalsmith-in-place');
metalsmith.use(metalsmithInPlace({
	'engine': 'handlebars',
	'partials': '../partials',
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
	'directory': '../layouts',
	'pattern': [ '404.html', '**/index.md', '**/index.html' ]
}));

/************************************
* Link Validation
***********************************/
if (cli.brokenLinks || cli.production) {
	var linkChecker = require('./link-checker');
	metalsmith.use(linkChecker());
}

/************************************
* S3 Deployment
***********************************/
if (cli.deploy) {
	var s3 = require('metalsmith-s3');
	metalsmith.use(s3({
		action: 'write',
		bucket: 'deepstream.io-metal',
		region: 'eu-central-1'
	}));
}

metalsmith.use(function(done) {
	console.log(colors.green('built done') + ' at ' + new Date())
	if (process.argv.indexOf('trigger-bs-reload') !== -1) {
		child_process.exec('npm run reload', function(err, stdout, stderr) {
			if (err) {
				console.error(err)
			}
			if (stderr) {
				console.error(stderr)
			}
		})
	}
	if (cli.beep) {
		beep()
	}
});

/************************************
 * RUN
 ***********************************/
metalsmith.build(function(err){
	if (err) {
		console.log(err);
	}
});
