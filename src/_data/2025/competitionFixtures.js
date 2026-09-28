require( 'dotenv' ).config();

const Fetch = require( '@11ty/eleventy-fetch' );

switch ( process.env.ELEVENTY_ENV ) {
	case 'development':
		url = 'http://localhost:5177/api/fixtures/2025/competitions';
	break;

	default:
		url = 'https://portal.strathclydemasters.com/api/fixtures/2025/competitions';
}

module.exports = async function () {
	return  await Fetch( url, {
		duration: '0s',
		type: 'json',
	} );
};
