require( 'dotenv' ).config();

const Fetch = require('@11ty/eleventy-fetch');

switch ( process.env.ELEVENTY_ENV ) {
	case 'development':
		url = 'http://admin.strathclydemasters.localhost/api/fixtures/AF0A0A85-84D7-478A-909A2E7F51C605CA';
	break;

	default:
		url = 'https://admin.strathclydemasters.com/api/fixtures/AF0A0A85-84D7-478A-909A2E7F51C605CA';
}

module.exports = async function () {
	return  await Fetch( url, {
		duration: '0s',
		type: 'json',
	} );
};
