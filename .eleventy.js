const path = require( 'node:path' );
const postcss = require( 'postcss' );
const tailwindcss = require( '@tailwindcss/postcss' );
const { default: Image } = require( '@11ty/eleventy-img' );
const moment = require( 'moment' );

module.exports = function( eleventyConfig ) {
	eleventyConfig.setQuietMode( true );
	eleventyConfig.setTemplateFormats( [ 'html', 'md', 'css' ] );

	eleventyConfig.addPassthroughCopy( './src/js' );
	eleventyConfig.addPassthroughCopy( './src/images' );
	eleventyConfig.addPassthroughCopy( './src/favicon' );
	eleventyConfig.addPassthroughCopy( './src/resources' );

	// Compile src/css/*.css through Tailwind
	eleventyConfig.addExtension( 'css', {
		outputFileExtension: 'css',
		compile: async function( inputContent, inputPath ) {
			return async () => {
				const result = await postcss( [
					tailwindcss( {
						base: path.resolve( '.' ),
						optimize: { minify: process.env.ELEVENTY_ENV === 'production' }
					} )
				] ).process( inputContent, { from: inputPath } );

				return result.css;
			};
		}
	} );

	eleventyConfig.addShortcode( 'year', () => `${ new Date().getFullYear() }` );

	// Resize a gallery photo and return the URL of the optimised copy
	eleventyConfig.addAsyncFilter( 'optimisedImage', async function( src, width = 900 ) {
		const metadata = await Image( src, {
			widths: [ width ],
			formats: [ 'webp' ],
			urlPath: '/images/optimised/',
			outputDir: path.join( eleventyConfig.directories.output, 'images/optimised/' )
		} );

		return metadata.webp[ 0 ].url;
	} );

	eleventyConfig.addFilter( 'where', function( array, property, value ) {
		return array.filter( p => p[ property ] == value );
	} );

	eleventyConfig.addFilter( 'dateFormat', function( value, format ) {
		return moment( new Date( value ) ).format( format );
	} );

	return {
		dir: {
			layouts: '_layouts'
		}
	};
};
