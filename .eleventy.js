const Image = require( '@11ty/eleventy-img' );

const stringifyAttributes = (attributeMap) => {
	return Object.entries(attributeMap)
	  .map(([attribute, value]) => {
		if (typeof value === 'undefined') return '';
		return `${attribute}="${value}"`;
	  })
	  .join(' ');
  };

const imageShortcode = async (
	src,
	alt,
	widths = [ 900 ],
	formats = [ 'webp' ],
	sizes = '100vw'
) => {
		const imageMetadata = await Image( src, {
			// widths: [...widths, null],
			// formats: [...formats, null],
			widths: widths,
			formats: formats,
			urlPath: '/images/gallery/2024/',
			outputDir: '_site/images/gallery/2024/',
		} );

		const sourceHtmlString = Object.values(imageMetadata)
			// Map each format to the source HTML markup
			.map((images) => {
				// The first entry is representative of all the others
				// since they each have the same shape
				const { sourceType } = images[0];

				// Use our util from earlier to make our lives easier
				const sourceAttributes = stringifyAttributes( {
					type: sourceType,
					// srcset needs to be a comma-separated attribute
					srcset: images.map( ( image ) => image.srcset ).join(', '),
					sizes,
				}) ;

		// Return one <source> per format
		return `<source ${sourceAttributes}>`;
	})
	.join('\n');

	const getLargestImage = (format) => {
		const images = imageMetadata[format];

		return images[images.length - 1];
	}

	const largestUnoptimizedImg = getLargestImage(formats[0]);
/*
	const imgAttributes = stringifyAttributes( {
		src: largestUnoptimizedImg.url,
		width: largestUnoptimizedImg.width,
		height: largestUnoptimizedImg.height,
		alt,
		loading: 'lazy',
		decoding: 'async',
	} );

	const imgHtmlString = `<img ${imgAttributes}>`;

	const pictureAttributes = stringifyAttributes({
		class: className,
	});
	const picture = `<picture ${pictureAttributes}>
		${sourceHtmlString}
		${imgHtmlString}
	</picture>`;
*/

	const snippet = `<div class="js-slide">
		<a class="js-fancybox d-block u-block-hover u-bg-overlay g-bg-black-opacity-0_3--after g-bg-primary-opacity-0_8--hover--after g-transition-0_3" href="javascript:;" data-fancybox="lightbox-gallery--10" data-src="${largestUnoptimizedImg.url}" data-caption="${alt}">
			<img class="img-fluid" src="${largestUnoptimizedImg.url}" alt="${alt}" loading="lazy">

			<span class="u-block-hover__additional--fade g-color-white g-z-index-2">
				<i class="hs-icon hs-icon-magnifier g-absolute-centered g-font-size-25"></i>
			</span>
		</a>
	</div>`;

	return `${snippet}`;
};

module.exports = function( eleventyConfig ) {
	eleventyConfig.setQuietMode( true );
	eleventyConfig.setTemplateFormats( 'html,md' );

	eleventyConfig.addPassthroughCopy( './src/assets' );
	eleventyConfig.addPassthroughCopy( './src/images' );
	eleventyConfig.addPassthroughCopy( './src/favicon' );
	eleventyConfig.addPassthroughCopy( './src/resources' );

	eleventyConfig.addShortcode( 'year', () => `${ new Date().getFullYear() }`);
	eleventyConfig.addShortcode( 'image', imageShortcode );

/*
	eleventyConfig.addShortcode( 'image', async function (src, alt, sizes) {
		let metadata = await Image( src, {
			widths: [ 300, 600 ],
			formats: [ 'webp', 'jpeg'],
			urlPath: '/img/2024/',
			outputDir: '_site/img/2024/',
		} );

		let imageAttributes = {
			alt,
			sizes,
			loading: 'lazy',
			decoding: 'async',
		};

		// You bet we throw an error on a missing alt (alt="" works okay)
		return Image.generateHTML( metadata, imageAttributes );
	} );
*/

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
