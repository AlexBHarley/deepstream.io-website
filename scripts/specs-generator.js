var fs = require( 'fs' );
var path = require( 'path' );
var parse = require( 'csv-parse' );
var walk = require( 'walk' );

var Gherkin = require('gherkin');
var parser = new Gherkin.Parser();

function readMessageStructures( loadedSpec, next ) {
	var specs = loadedSpec.specs;
	var content = fs.readFileSync( 'data/specs.csv' ).toString('utf8');
	parse(content, {
		columns: true,
		skip_empty_lines: true,
		trim: true
	}, function( err, output ) {
		output.forEach( function( entry ) {
			if( !specs[ entry.type ] ) {
				specs[ entry.type ] = {
					name: entry.type,
					structures: []
				};
			}
			entry.id = entry.type + '-' + entry.id;
			specs[ entry.type ].structures.push( entry );
		} )
		walkFeatureTree( loadedSpec, next );
	});
}

function readMessageScenarios( loadedSpec, root, stats, next ) {
	var features = loadedSpec.features;
	if( stats.name.indexOf( '.feature' ) > -1 ) {
		var content = fs.readFileSync( path.join( root, stats.name ) ).toString('utf8');
		feature = parser.parse( content ).feature;
		if( feature.tags.length === 0 ) {
			console.warn( 'Please add a tag to the feature', feature.name );
		} else {
			var tag = feature.tags[ 0 ].name.substr( 1 );
			if( !features[ tag ] ) {
				features[ tag ] = [];
			}
			features[ tag ].push( {
				content: content,
				feature: feature
			} );
		}
	}
	next();
}

var walkFeatureTree = function( loadedSpec, next ) {
	var inputDir =  path.join( __dirname, '../../deepstream.io-client-specs/features' );
	var walker = walk.walk( inputDir, {} );
	walker.on( 'file', readMessageScenarios.bind( null, loadedSpec ) );
	walker.on( 'end', function() {
		next( null, loadedSpec );
	} );
};

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = function( metalsmith ) {
	metalsmith.use(function( files, metalsmith, done ) {
		var metadata = metalsmith.metadata();
		metadata.messageSpecs = {
			specs: {},
			features: {},
		};
		readMessageStructures( metadata.messageSpecs, ( error, messageSpecs ) => {
			var fileName;
			var title;

			for( var specName in messageSpecs.features ) {
				title = capitalizeFirstLetter(specName);
				fileName = `info/specs/${specName}/${specName}.html`;
				files[ fileName ] = {
					title: `${title} Features`,
					description: `Cucumber features for ${title} in deepstream.io`,
					filename: fileName,
					contents: new Buffer( `<h1>${specName}</h1>
{{> specs-paths messageSpecs.features.${specName} }}`)
				}
			}
			done();
		} );
	});
}