require( 'dotenv' ).config();

const Fetch = require( '@11ty/eleventy-fetch' );

const DEV_API = 'http://localhost:5178/api/v1/';
const PROD_API = 'https://portal.mastersbasketballtournaments.com/api/v1/';
const TOURNAMENT = 'strathclyde-masters';

const fetchJson = ( url, fetchOptions = {} ) => Fetch( url, {
	duration: '0s',
	type: 'json',
	fetchOptions: {
		...fetchOptions,
		headers: { Authorization: `Bearer ${ process.env.PORTAL_API_KEY }` }
	}
} );

// Fetch JSON for this tournament from the portal API, e.g. portal( '2026/teams' ).
// In development, try the local portal first and fall back to production if it
// isn't running.
module.exports = async function portal( path ) {
	const tournamentPath = `${ TOURNAMENT }/${ path }`;

	if ( process.env.ELEVENTY_ENV === 'development' ) {
		try {
			return await fetchJson( DEV_API + tournamentPath, { signal: AbortSignal.timeout( 2000 ) } );
		} catch ( error ) {
			console.warn( `[portal] Local API unavailable for ${ path } (${ error.message }), using production data` );
		}
	}

	return fetchJson( PROD_API + tournamentPath );
};
