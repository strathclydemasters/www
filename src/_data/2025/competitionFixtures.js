require( 'dotenv' ).config();

const Fetch = require( '@11ty/eleventy-fetch' );

switch ( process.env.ELEVENTY_ENV ) {
	case 'development':
		url = 'http://admin.strathclydemasters.localhost/api/fixtures/773570B9-961D-45C7-A5A37F182A170103/competitions';
	break;


	default:
		url = 'https://admin.strathclydemasters.com/api/fixtures/773570B9-961D-45C7-A5A37F182A170103/competitions';
}

module.exports = async function () {
	return  await Fetch( url, {
		duration: '0s',
		type: 'json',
	} );
};
