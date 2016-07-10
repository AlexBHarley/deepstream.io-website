/************************************
 * Blog Generator
 ***********************************/
'use strict';
const moment = require( 'moment' );
const hbs = require( 'handlebars' );
const marked = require( 'marked' );

const yaml = require('js-yaml');
const fs   = require('fs');
let authors
try {
  authors = yaml.safeLoad( fs.readFileSync( 'data/authors.yml' ) );
} catch (e) {
  console.error( 'Author data missing or invalid', e );
  process.exit( 1 );
}

var checkMeta = function( file ) {
	if( !file.title || !file.dateISO || !file.author || !file.thumbnail ) {
		throw new Error( 'Missing meta data for blog entry (title|dateISO|author|thumbnail) ' + file.filename );
	}

	if( !authors[ file.author] ) {
		throw new Error( 'Author needs to be declared in data/author.json file ' + file.author );
	}
};

var addBlogMeta = function( file ) {
	file.excerpt = marked(file.contents.toString().match( '^[\r\n\S]*([^\n\r]*)')[ 1 ])
	file.blog = {
		date: moment( file.dateISO, 'YYYYMMDD' ).format( 'MMMM Do YYYY' ),
		shortDate: moment( file.dateISO, 'YYYYMMDD' ).format( 'DD/MM/YYYY' ),
		author:  authors[ file.author],
		thumbnail: '/' + file.filename.replace( 'readme.md', file.thumbnail ),
		blogPath: file.filename.replace( 'readme.md', '' )
	};
};

var sortBlogs = function( blogPosts ) {
	blogPosts.sort( function( fileA, fileB ) {
		return parseInt( fileB.dateISO ) - parseInt( fileA.dateISO );
	});
	for( var i = 0; i < blogPosts.length; i++ ) {
		blogPosts[ i ].blog.isLatest = i < 4;
	}
};

module.exports = function() {

	return function( files, metalsmith, done ) {
		const metadata = metalsmith.metadata();
		metadata.blogPosts = [];

		var fileParts;
		var filePath;
		var file;
		for( filePath in files ) {
			if( filePath.match( 'blog/[^/]+/.*\.md' ) ) {
				file = files[ filePath ];
				checkMeta( file );
				addBlogMeta( file );
				metadata.blogPosts.push( file );
			}
		}
		sortBlogs( metadata.blogPosts );

		done();
	}
}
