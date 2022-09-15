module.exports = function( eleventyConfig ) {
	eleventyConfig.setQuietMode( true );
	eleventyConfig.setTemplateFormats( 'html,md' );

	eleventyConfig.addPassthroughCopy( './src/assets' );
	eleventyConfig.addPassthroughCopy( './src/images' );
	eleventyConfig.addPassthroughCopy( './src/favicon' );
	eleventyConfig.addPassthroughCopy( './src/resources' );

	eleventyConfig.addShortcode( 'year', () => `${ new Date().getFullYear() }`);

	eleventyConfig.addFilter( 'where', function( array, property, value ) {
		return array.filter( p => p[ property ] == value );
	} );

	eleventyConfig.addFilter( 'dateFormat', function( value, format ) {
		let moment = require( 'moment' );
		let dateValue = new Date( value );

		return moment( dateValue ).format( format );
	} );

	eleventyConfig.setBrowserSyncConfig( {
		ui: false,
		ghostMode: false
	} );

	return {
		dir: {
			layouts: '_layouts'
		}
	};
};
