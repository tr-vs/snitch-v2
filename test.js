const { stringify } = require('querystring');
const fetch = require('node-fetch');
async function bruh() {
	const params3 = stringify({
		artist: 'uzi',
		api_key: 'b97a0987d8be2614dae53778e3240bfd',
		method: 'artist.search',
		limit: 1,
		format: 'json',
	});
	const autocorrect = await fetch(`https://ws.audioscrobbler.com/2.0/?${params3}`).then(r => r.json());
	console.log(autocorrect.results.artistmatches.artist[0].name);
	const params = stringify({
		method: 'user.getrecenttracks',
		user: 'eggxoll',
		api_key: 'b97a0987d8be2614dae53778e3240bfd',
		format: 'json',
		limit: 1,
	});
	const data = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`).then(r => r.json());
	console.log(data.recenttracks.track[0].artist['#text']);
}
bruh();