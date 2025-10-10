require( 'dotenv' ).config();

const EleventyFetch = require( '@11ty/eleventy-fetch' );

switch ( process.env.ELEVENTY_ENV ) {
	case 'development':
		url = 'http://admin.strathclydemasters.localhost/api/fixtures/773570B9-961D-45C7-A5A37F182A170103';
	break;


	default:
		url = 'https://admin.strathclydemasters.com/api/fixtures/773570B9-961D-45C7-A5A37F182A170103';
}

module.exports = async function () {
	return EleventyFetch( url, {
		duration: '0d'
		,type: 'json'
		// ,fetchOptions: {
		// 	headers: {
		// 		'Authorization': process.env.API_TOKEN
		// 	}
		// }
	} );
};
