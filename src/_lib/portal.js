require( 'dotenv' ).config();

const Fetch = require( '@11ty/eleventy-fetch' );

const DEV_API = 'http://localhost:5177/api/';
const PROD_API = 'https://portal.strathclydemasters.com/api/';

const fetchJson = ( url, fetchOptions = {} ) => Fetch( url, {
	duration: '0s',
	type: 'json',
	fetchOptions
} );

// Fetch JSON from the portal API. In development, try the local portal first
// and fall back to production if it isn't running.
module.exports = async function portal( path ) {
	if ( process.env.ELEVENTY_ENV === 'development' ) {
		try {
			return await fetchJson( DEV_API + path, { signal: AbortSignal.timeout( 2000 ) } );
		} catch ( error ) {
			console.warn( `[portal] Local API unavailable for ${ path }, using production data` );
		}
	}

	return fetchJson( PROD_API + path );
};
