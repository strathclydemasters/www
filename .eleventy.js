// add yaml support with npm install js-yaml --save-dev
const yaml = require( 'js-yaml' );

module.exports = function( eleventyConfig ) {
	eleventyConfig.setTemplateFormats( 'html,md' );

	eleventyConfig.addPassthroughCopy( 'assets' );
	eleventyConfig.addPassthroughCopy( 'images' );

	eleventyConfig.addDataExtension( 'yml', contents => yaml.safeLoad( contents ) );
};
