require( 'dotenv' ).config();

const Fetch = require('@11ty/eleventy-fetch');

switch ( process.env.ELEVENTY_ENV ) {
	case 'development':
		url = 'http://localhost:5177/api/fixtures/2025';
	break;

	default:
		url = 'https://portal.strathclydemasters.com/api/fixtures/2025';
}

module.exports = async function () {
	return  await Fetch( url, {
		duration: '0s',
		type: 'json',
	} );
};
