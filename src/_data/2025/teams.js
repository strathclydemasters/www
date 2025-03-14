require( 'dotenv' ).config();

const EleventyFetch = require( '@11ty/eleventy-fetch' );

switch ( process.env.ELEVENTY_ENV ) {
	case 'development':
		url = 'http://admin.strathclydemasters.localhost/api/teams/2025';
	break;

	default:
		url = 'https://admin.strathclydemasters.com/api/teams/2025';
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
